-- ============================================================================
-- Google Stack & AI Agents Integration: Pi, Antigravity (agy), and Gemini
-- ============================================================================

local function get_visual_selection()
  local start_pos = vim.fn.getpos("'<")
  local end_pos = vim.fn.getpos("'>")
  local start_row, start_col = start_pos[2], start_pos[3]
  local end_row, end_col = end_pos[2], end_pos[3]

  if start_row == 0 or end_row == 0 then
    return ""
  end

  local lines = vim.api.nvim_buf_get_lines(0, start_row - 1, end_row, false)
  if #lines == 0 then
    return ""
  end

  if #lines == 1 then
    lines[1] = string.sub(lines[1], start_col, end_col)
  else
    lines[1] = string.sub(lines[1], start_col)
    lines[#lines] = string.sub(lines[#lines], 1, end_col)
  end

  return table.concat(lines, "\n")
end

local function run_agent_interactive(cmd_bin, prompt, title)
  local cmd
  if prompt and prompt ~= "" then
    if cmd_bin == "agy" then
      cmd = { "agy", "-i", prompt }
    elseif cmd_bin == "gemini" then
      cmd = { "gemini", "-i", prompt }
    elseif cmd_bin == "pi" then
      cmd = { "pi", prompt }
    else
      cmd = { cmd_bin, prompt }
    end
  else
    cmd = cmd_bin
  end

  Snacks.terminal(cmd, {
    win = {
      position = "float",
      border = "rounded",
      width = 0.88,
      height = 0.88,
      title = " " .. (title or cmd_bin) .. " ",
      title_pos = "center",
    },
  })
end

return {
  {
    "folke/which-key.nvim",
    opts = {
      spec = {
        { "<leader>a", group = "ai (Google / Pi / Antigravity)" },
      },
    },
  },
  {
    "folke/snacks.nvim",
    keys = {
      -- 1. Full Agent Terminals
      {
        "<leader>aa",
        function()
          run_agent_interactive("agy", nil, "Antigravity Agent (agy)")
        end,
        desc = "Antigravity Agent (agy)",
      },
      {
        "<leader>ac",
        function()
          Snacks.terminal({ "agy", "-c" }, {
            win = {
              position = "float",
              border = "rounded",
              width = 0.88,
              height = 0.88,
              title = " Antigravity (Resume Last Session) ",
              title_pos = "center",
            },
          })
        end,
        desc = "Antigravity: Continue Session",
      },
      {
        "<leader>ap",
        function()
          run_agent_interactive("pi", nil, "Pi Coding Agent")
        end,
        desc = "Pi Coding Agent",
      },
      {
        "<leader>aP",
        function()
          Snacks.terminal({ "pi", "-c" }, {
            win = {
              position = "float",
              border = "rounded",
              width = 0.88,
              height = 0.88,
              title = " Pi (Resume Last Session) ",
              title_pos = "center",
            },
          })
        end,
        desc = "Pi: Continue Session",
      },
      {
        "<leader>ag",
        function()
          run_agent_interactive("gemini", nil, "Google Gemini CLI")
        end,
        desc = "Google Gemini CLI",
      },

      -- 2. Visual Context Prompts
      {
        "<leader>ae",
        function()
          local code = get_visual_selection()
          local ft = vim.bo.filetype
          local prompt = "Explain what this " .. (ft ~= "" and ft .. " " or "") .. "code does and point out any potential bugs or edge cases:\n\n```" .. ft .. "\n" .. code .. "\n```"
          run_agent_interactive("gemini", prompt, "Gemini: Explain Code")
        end,
        mode = "v",
        desc = "Gemini: Explain Selected Code",
      },
      {
        "<leader>af",
        function()
          local code = get_visual_selection()
          local ft = vim.bo.filetype
          local prompt = "Refactor, optimize, and fix any issues in this " .. (ft ~= "" and ft .. " " or "") .. "code:\n\n```" .. ft .. "\n" .. code .. "\n```"
          run_agent_interactive("gemini", prompt, "Gemini: Fix / Refactor Code")
        end,
        mode = "v",
        desc = "Gemini: Refactor / Fix Code",
      },
      {
        "<leader>as",
        function()
          local code = get_visual_selection()
          local ft = vim.bo.filetype
          vim.ui.input({ prompt = "Ask Google AI: " }, function(input)
            if not input or input == "" then
              return
            end
            local prompt
            if code and code ~= "" then
              prompt = input .. "\n\nContext (" .. ft .. "):\n```" .. ft .. "\n" .. code .. "\n```"
            else
              prompt = input
            end
            run_agent_interactive("gemini", prompt, "Google AI: " .. input)
          end)
        end,
        mode = { "n", "v" },
        desc = "Ask Google AI (with selection context)",
      },
    },
  },
}
