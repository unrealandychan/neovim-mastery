/**
 * Complete 60-Stage Neovim Mastery & LazyVim IDE Dojo Curriculum.
 * Mapped to repository markdown chapters and modern LazyVim workflow.
 */

export const STAGES = [
  // =========================================================================
  // WEEK 1: Precision Motions & The Grammar of Code (Days 1–7)
  // =========================================================================
  {
    day: 1,
    week: 1,
    title: 'Mental Model & First Day Survival',
    concept: 'Normal Mode vs Insert Mode & Saving',
    chapterRef: '00-getting-started/03-first-day-survival-guide.md',
    mission: 'Enter Insert mode with "i", type "Welcome Eddie", return to Normal mode with <Esc>, and save with ":w".',
    initialText: '// Neovim Mastery\nconsole.log("");',
    cursorStart: { row: 1, col: 13 },
    targetText: '// Neovim Mastery\nconsole.log("Welcome Eddie");',
    requiredAction: 'save',
    parKeystrokes: 18,
    optimalKeys: ['i', 'W', 'e', 'l', 'c', 'o', 'm', 'e', ' ', 'E', 'd', 'd', 'i', 'e', 'Escape', ':', 'w', 'Enter'],
    hints: [
      'Your cursor starts between the double quotes.',
      'Press "i" to enter Insert mode.',
      'Type "Welcome Eddie", then press <Esc> to return to Normal mode.',
      'Type ":w" and press Enter to save.'
    ],
  },
  {
    day: 2,
    week: 1,
    title: 'Counted Motions & Word Navigation',
    concept: '2j, f, and ciw',
    chapterRef: '01-vim-grammar-and-motions/03-movement-mastery.md',
    mission: 'Navigate the config file! Drop down 2 lines with "2j", seek to 3000 with "f3", and replace with 8080 using "cw8080<Esc>".',
    initialText: 'const config = {\n  host: "localhost",\n  port: 3000,\n  retries: 3,\n};',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const config = {\n  host: "localhost",\n  port: 8080,\n  retries: 3,\n};',
    parKeystrokes: 11,
    optimalKeys: ['2', 'j', 'f', '3', 'c', 'w', '8', '0', '8', '0', 'Escape'],
    hints: [
      'Press "2j" to jump directly to line 3.',
      'Type "f3" to seek to the port number.',
      'Type "cw8080<Esc>" to change the port.'
    ],
  },
  {
    day: 3,
    week: 1,
    title: 'Inline Seeking Precision: f, t, F, T & ;',
    concept: 'Horizontal line snipers with repeat (;)',
    chapterRef: '01-vim-grammar-and-motions/03-movement-mastery.md',
    mission: 'Seek inside the SQL query using "f\'", then change inside single quotes with "ci\'active<Esc>".',
    initialText: 'const query = "SELECT id FROM users WHERE status = \'pending\';";',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const query = "SELECT id FROM users WHERE status = \'active\';";',
    parKeystrokes: 12,
    optimalKeys: ['f', '\'', 'c', 'i', '\'', 'a', 'c', 't', 'i', 'v', 'e', 'Escape'],
    hints: [
      'Type "f\'" to jump cursor directly to the first single quote.',
      'Type "ci\'" to wipe inside the quotes and enter Insert mode.',
      'Type "active" and press <Esc>.'
    ],
  },
  {
    day: 4,
    week: 1,
    title: 'Line Boundaries & Whitespace Navigation: 0, ^, $',
    concept: 'Inline boundary seeking and line-end deletion (d$)',
    chapterRef: '01-vim-grammar-and-motions/03-movement-mastery.md',
    mission: 'Seek to the semicolon with "f;", step right with "l", and delete the trailing comment with "d$".',
    initialText: '    const endpoint = "/api/v2/auth"; // REMOVE_DEPRECATED_COMMENT',
    cursorStart: { row: 0, col: 0 },
    targetText: '    const endpoint = "/api/v2/auth";',
    parKeystrokes: 5,
    optimalKeys: ['f', ';', 'l', 'd', '$'],
    hints: [
      'Type "f;" to seek to the semicolon.',
      'Type "l" to step onto the trailing space.',
      'Type "d$" to delete to the end of the line.'
    ],
  },
  {
    day: 5,
    week: 1,
    title: 'Buffer Topology Jumps & Traversal: gg, G, {, }',
    concept: 'File boundaries and line deletion',
    chapterRef: '02-navigation-and-project-management/01-buffers-windows-tabs.md',
    mission: 'Teleport to the end of the file with "G", and delete the obsolete debug line with "dd".',
    initialText: 'import { createApp } from "./app";\n\nconst app = createApp();\napp.listen(3000);\n\nconsole.log(process.env);',
    cursorStart: { row: 0, col: 0 },
    targetText: 'import { createApp } from "./app";\n\nconst app = createApp();\napp.listen(3000);\n',
    parKeystrokes: 3,
    optimalKeys: ['G', 'd', 'd'],
    hints: [
      'Press "G" to jump straight to the last line.',
      'Press "dd" to delete the debug line.'
    ],
  },
  {
    day: 6,
    week: 1,
    title: 'Search As A Motion: /pattern & ciw',
    concept: 'Surgical search seeking and word replacement',
    chapterRef: '01-vim-grammar-and-motions/03-movement-mastery.md',
    mission: 'Search forward for "userOld" with "/userOld<Enter>", then replace with "ciwclient<Esc>".',
    initialText: 'const userOld = fetchUser();\nconst info = format(userOld);',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const client = fetchUser();\nconst info = format(userOld);',
    parKeystrokes: 19,
    optimalKeys: ['/', 'u', 's', 'e', 'r', 'O', 'l', 'd', 'Enter', 'c', 'i', 'w', 'c', 'l', 'i', 'e', 'n', 't', 'Escape'],
    hints: [
      'Type "/userOld" and press Enter to search.',
      'Type "ciwclient<Esc>" to rename the variable.'
    ],
  },
  {
    day: 7,
    week: 1,
    title: 'Flash.nvim 2-Character Teleportation',
    concept: 's{c1}{c2} + label',
    chapterRef: '06-plugin-mastery-and-ecosystem/03-flash-nvim-teleportation-motions.md',
    mission: 'Teleport across the screen with Flash! Press "s", type "ta", jump with label "a", and change word to "finalVar" with "ciwfinalVar<Esc>".',
    initialText: 'const alpha = 1;\nconst count = 2;\nconst sum = 3;\nconst targetVar = 999;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const alpha = 1;\nconst count = 2;\nconst sum = 3;\nconst finalVar = 999;',
    parKeystrokes: 16,
    optimalKeys: ['s', 't', 'a', 'a', 'c', 'i', 'w', 'f', 'i', 'n', 'a', 'l', 'V', 'a', 'r', 'Escape'],
    hints: [
      'Type "s" then "ta" to engage Flash search on "targetVar".',
      'Press the target label "a" to jump.',
      'Type "ciwfinalVar<Esc>" to rename the variable.'
    ],
  },

  // =========================================================================
  // WEEK 2: Operators & Deep Text Objects (Days 8–14)
  // =========================================================================
  {
    day: 8,
    week: 2,
    title: 'String Literal Surgical Strikes: ci", da"',
    concept: 'Inner and around quote text objects',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Wipe inside double quotes from anywhere on the line with "ci"" and enter "https://api.v2.io".',
    initialText: 'export const API_BASE = "https://legacy.internal.staging/api/v1";',
    cursorStart: { row: 0, col: 0 },
    targetText: 'export const API_BASE = "https://api.v2.io";',
    parKeystrokes: 22,
    optimalKeys: ['c', 'i', '"', 'h', 't', 't', 'p', 's', ':', '/', '/', 'a', 'p', 'i', '.', 'v', '2', '.', 'i', 'o', 'Escape'],
    hints: [
      'Type "ci\"" to instantly clear inside quotes.',
      'Type "https://api.v2.io" and press <Esc>.'
    ],
  },
  {
    day: 9,
    week: 2,
    title: 'Parameter & Argument Extraction: ci(, da(',
    concept: 'Function argument text objects',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Refactor the signature: replace the 3 cluttered parameters using "ci(opts: UserOptions<Esc>".',
    initialText: 'export function createUser(name: string, age: number, role: string) {\n  return db.save();\n}',
    cursorStart: { row: 0, col: 0 },
    targetText: 'export function createUser(opts: UserOptions) {\n  return db.save();\n}',
    parKeystrokes: 22,
    optimalKeys: ['c', 'i', '(', 'o', 'p', 't', 's', ':', ' ', 'U', 's', 'e', 'r', 'O', 'p', 't', 'i', 'o', 'n', 's', 'Escape'],
    hints: [
      'Type "ci(" to wipe inside the parentheses.',
      'Type "opts: UserOptions" and press <Esc>.'
    ],
  },
  {
    day: 10,
    week: 2,
    title: 'Code Block Demolition: ci{, da{',
    concept: 'Block braces text objects',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Drop down into the catch block with "3j" and replace its body with "ci{throw err;<Esc>".',
    initialText: 'try {\n  runTask();\n} catch (err) {\n  console.warn("Retrying...");\n  retry();\n}',
    cursorStart: { row: 0, col: 0 },
    targetText: 'try {\n  runTask();\n} catch (err) {throw err;}',
    parKeystrokes: 16,
    optimalKeys: ['3', 'j', 'c', 'i', '{', 't', 'h', 'r', 'o', 'w', ' ', 'e', 'r', 'r', ';', 'Escape'],
    hints: [
      'Press "3j" to navigate inside the catch block.',
      'Type "ci{" to replace inside braces.',
      'Type "throw err;" and press <Esc>.'
    ],
  },
  {
    day: 11,
    week: 2,
    title: 'Tagged Template & JSX Objects: cit, dat',
    concept: 'HTML and JSX tag text objects',
    chapterRef: '04-language-specific-playbooks/01-typescript-javascript-web.md',
    mission: 'Change inside the badge element using "citActive Status<Esc>".',
    initialText: 'export const Badge = () => (\n  <span className="badge">Draft</span>\n);',
    cursorStart: { row: 1, col: 10 },
    targetText: 'export const Badge = () => (\n  <span className="badge">Active Status</span>\n);',
    parKeystrokes: 17,
    optimalKeys: ['c', 'i', 't', 'A', 'c', 't', 'i', 'v', 'e', ' ', 'S', 't', 'a', 't', 'u', 's', 'Escape'],
    hints: [
      'Positioned inside the span tag, type "cit" to change inner content.',
      'Type "Active Status" and press <Esc>.'
    ],
  },
  {
    day: 12,
    week: 2,
    title: 'Buffer Navigation & Persistence: :w & :bnext',
    concept: 'Saving and switching buffers',
    chapterRef: '02-navigation-and-project-management/01-buffers-windows-tabs.md',
    mission: 'Save this modified buffer using ":w", then switch to the next buffer using ":bnext".',
    initialText: '// Buffer 1: Ready to save\nconst appConfig = { port: 3000 };',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Buffer 1: Ready to save\nconst appConfig = { port: 3000 };',
    requiredAction: 'bnext',
    parKeystrokes: 10,
    optimalKeys: [':', 'w', 'Enter', ':', 'b', 'n', 'e', 'x', 't', 'Enter'],
    hints: [
      'Type ":w" <Enter> to write buffer.',
      'Type ":bnext" <Enter> to move to next buffer.'
    ],
  },
  {
    day: 13,
    week: 2,
    title: 'Linewise Swapping & Transposition: ddp',
    concept: 'Cutting a line and pasting below',
    chapterRef: '01-vim-grammar-and-motions/05-registers-and-clipboard.md',
    mission: 'Swap the two declaration lines in 3 keystrokes using "ddp"!',
    initialText: 'const SECOND = 2;\nconst FIRST = 1;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const FIRST = 1;\nconst SECOND = 2;',
    parKeystrokes: 3,
    optimalKeys: ['d', 'd', 'p'],
    hints: [
      'Type "dd" to delete and yank line 1.',
      'Type "p" to paste it right below line 2.'
    ],
  },
  {
    day: 14,
    week: 2,
    title: 'The Dot Command (.): Repetitive Automation',
    concept: 'Replaying linewise deletion across lines',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Delete obsolete line 1 with "dd", then use "." twice to repeat and delete obsolete lines 2 and 3.',
    initialText: 'obsolete 1\nobsolete 2\nobsolete 3\nKEEP_ME',
    cursorStart: { row: 0, col: 0 },
    targetText: 'KEEP_ME',
    parKeystrokes: 4,
    optimalKeys: ['d', 'd', '.', '.'],
    hints: [
      'Type "dd" to delete obsolete 1.',
      'Press "." once to repeat deletion for obsolete 2.',
      'Press "." again for obsolete 3.'
    ],
  },

  // =========================================================================
  // WEEK 3: Visual Modes & Column Editing (Days 15–21)
  // =========================================================================
  {
    day: 15,
    week: 3,
    title: 'Visual Character Mode & Till Motions: vt;c',
    concept: 'Visual selection till character and change',
    chapterRef: '01-vim-grammar-and-motions/04-visual-and-block-editing.md',
    mission: 'Select through the boolean expression with "vt;" and replace with "true<Esc>".',
    initialText: 'const canAccess = false && isGuest;',
    cursorStart: { row: 0, col: 18 },
    targetText: 'const canAccess = true;',
    parKeystrokes: 9,
    optimalKeys: ['v', 't', ';', 'c', 't', 'r', 'u', 'e', 'Escape'],
    hints: [
      'Cursor starts on "false". Press "v" for Visual mode.',
      'Type "t;" to select up to the semicolon.',
      'Type "c" to change selection to "true" and press <Esc>.'
    ],
  },
  {
    day: 16,
    week: 3,
    title: 'Visual Line Mode: Indentation & Joining',
    concept: 'V, j, >, and J',
    chapterRef: '01-vim-grammar-and-motions/04-visual-and-block-editing.md',
    mission: 'Select both function lines in Visual Line mode ("Vj") and indent them right with ">".',
    initialText: 'const a = 100;\nconst b = 200;',
    cursorStart: { row: 0, col: 0 },
    targetText: '  const a = 100;\n  const b = 200;',
    parKeystrokes: 3,
    optimalKeys: ['V', 'j', '>'],
    hints: [
      'Press "V" to enter Visual Line mode.',
      'Press "j" to select both lines.',
      'Press ">" to indent.'
    ],
  },
  {
    day: 17,
    week: 3,
    title: 'Visual Block Mode: Multi-Line Prefix Insertion',
    concept: '<C-v>, j, and I (Column insertion)',
    chapterRef: '01-vim-grammar-and-motions/04-visual-and-block-editing.md',
    mission: 'Batch comment 3 lines at once: enter Visual Block mode with "<C-v>", select 2 lines down with "2j", insert "// " with "I// <Esc>".',
    initialText: 'host: "0.0.0.0"\nport: 8080\nssl: true',
    cursorStart: { row: 0, col: 0 },
    targetText: '// host: "0.0.0.0"\n// port: 8080\n// ssl: true',
    parKeystrokes: 8,
    optimalKeys: ['<C-v>', '2', 'j', 'I', '/', '/', ' ', 'Escape'],
    hints: [
      'Press "<C-v>" to enter VISUAL BLOCK mode.',
      'Press "2j" to extend down 2 lines.',
      'Press "I", type "// ", and press <Esc> to apply to all selected lines!'
    ],
  },
  {
    day: 18,
    week: 3,
    title: 'Visual Block Mode: Column Deletion',
    concept: '<C-v>, 2j, 3l, and d',
    chapterRef: '01-vim-grammar-and-motions/04-visual-and-block-editing.md',
    mission: 'Strip the line prefix markers: block select 3 lines and 3 columns ("<C-v>2j3l"), then press "d" to slice them off.',
    initialText: '01: auth\n02: user\n03: cart',
    cursorStart: { row: 0, col: 0 },
    targetText: 'auth\nuser\ncart',
    parKeystrokes: 6,
    optimalKeys: ['<C-v>', '2', 'j', '3', 'l', 'd'],
    hints: [
      'Press "<C-v>" to enter Visual Block mode.',
      'Type "2j3l" to cover the "01: " column width.',
      'Press "d" to delete the column block.'
    ],
  },
  {
    day: 19,
    week: 3,
    title: 'Surround Manipulation: mini.surround',
    concept: 'gsaw" (surround word)',
    chapterRef: '06-plugin-mastery-and-ecosystem/06-micro-productivity-and-editing-plugins.md',
    mission: 'Surround the bare identifier with quotes: type "gsaw"" to wrap "development" in double quotes.',
    initialText: 'const env = development;',
    cursorStart: { row: 0, col: 15 },
    targetText: 'const env = "development";',
    parKeystrokes: 5,
    optimalKeys: ['g', 's', 'a', 'w', '"'],
    hints: [
      'Position cursor on "development".',
      'Type "gsaw\"" to surround inner word with double quotes.'
    ],
  },
  {
    day: 20,
    week: 3,
    title: 'Marks & Spatial Anchors: ma, \'a',
    concept: 'Setting and leaping between bookmarked lines',
    chapterRef: '01-vim-grammar-and-motions/03-movement-mastery.md',
    mission: 'Set mark "a" with "ma", leap to the bottom with "G", then jump back to mark "a" with "\'a", and delete line with "dd".',
    initialText: 'const TOP_SECRET = "xyz";\n// ... lots of lines ...\nconst FOOTER = "end";',
    cursorStart: { row: 0, col: 0 },
    targetText: '// ... lots of lines ...\nconst FOOTER = "end";',
    parKeystrokes: 7,
    optimalKeys: ['m', 'a', 'G', '\'', 'a', 'd', 'd'],
    hints: [
      'Type "ma" to store mark a.',
      'Type "G" to teleport to footer.',
      'Type "\'a" to leap back to mark a, then "dd" to delete.'
    ],
  },
  {
    day: 21,
    week: 3,
    title: 'Jumplist Time Travel: gd & Symbol Navigation',
    concept: 'Code symbol navigation with gd',
    chapterRef: '03-modern-ide-power-tools/02-code-navigation-and-inspection.md',
    mission: 'Dive to the definition of "userConfig" with "gd", then change word to "appConfig" with "ciwappConfig<Esc>".',
    initialText: 'const userConfig = { active: true };\n\nfunction start() {\n  return userConfig;\n}',
    cursorStart: { row: 3, col: 10 },
    targetText: 'const appConfig = { active: true };\n\nfunction start() {\n  return userConfig;\n}',
    parKeystrokes: 15,
    optimalKeys: ['g', 'd', 'c', 'i', 'w', 'a', 'p', 'p', 'C', 'o', 'n', 'f', 'i', 'g', 'Escape'],
    hints: [
      'Cursor is on "userConfig". Type "gd" to jump to its declaration line.',
      'Type "ciwappConfig<Esc>" to rename it.'
    ],
  },

  // =========================================================================
  // WEEK 4: Ex Commands & Global Stream Editing (Days 22–28)
  // =========================================================================
  {
    day: 22,
    week: 4,
    title: 'Global Regex Substitution: :%s/old/new/g',
    concept: 'Modernizing legacy ES5 var to const across buffer',
    chapterRef: '06-plugin-mastery-and-ecosystem/04-grug-far-project-search-and-replace.md',
    mission: 'Modernize all "var " to "const " using ":%s/var /const /g<Enter>".',
    initialText: 'var a = 1;\nvar b = 2;\nvar c = 3;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const a = 1;\nconst b = 2;\nconst c = 3;',
    parKeystrokes: 19,
    optimalKeys: [':', '%', 's', '/', 'v', 'a', 'r', ' ', '/', 'c', 'o', 'n', 's', 't', ' ', '/', 'g', 'Enter'],
    hints: [
      'Type ":%s/var /const /g" and press Enter.'
    ],
  },
  {
    day: 23,
    week: 4,
    title: 'Line Range Substitution: :2,3s/find/replace/g',
    concept: 'Precision scoped range replacements',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Replace "DEBUG" with "PROD" only on lines 2 through 3 using ":2,3s/DEBUG/PROD/g<Enter>".',
    initialText: 'const env1 = "DEBUG";\nconst env2 = "DEBUG";\nconst env3 = "DEBUG";',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const env1 = "DEBUG";\nconst env2 = "PROD";\nconst env3 = "PROD";',
    parKeystrokes: 20,
    optimalKeys: [':', '2', ',', '3', 's', '/', 'D', 'E', 'B', 'U', 'G', '/', 'P', 'R', 'O', 'D', '/', 'g', 'Enter'],
    hints: [
      'Type ":2,3s/DEBUG/PROD/g" and press Enter.'
    ],
  },
  {
    day: 24,
    week: 4,
    title: 'Global Line Deletion: :g/pattern/d',
    concept: 'Cleaning debug logs with ex command',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Strip all console.log statements instantly using ":g/console.log/d<Enter>".',
    initialText: 'function calculate() {\n  console.log("start");\n  const val = 42;\n  console.log("end");\n  return val;\n}',
    cursorStart: { row: 0, col: 0 },
    targetText: 'function calculate() {\n  const val = 42;\n  return val;\n}',
    parKeystrokes: 18,
    optimalKeys: [':', 'g', '/', 'c', 'o', 'n', 's', 'o', 'l', 'e', '.', 'l', 'o', 'g', '/', 'd', 'Enter'],
    hints: [
      'Type ":g/console.log/d" and press Enter.'
    ],
  },
  {
    day: 25,
    week: 4,
    title: 'Inverted Global Filter: :v/pattern/d',
    concept: 'Isolating public exports with :v',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Delete all lines that DO NOT contain "export" using ":v/export/d<Enter>".',
    initialText: 'const internalHelper = 1;\nexport const API_URL = "https://api.com";\nconst cache = {};\nexport const PORT = 8080;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'export const API_URL = "https://api.com";\nexport const PORT = 8080;',
    parKeystrokes: 13,
    optimalKeys: [':', 'v', '/', 'e', 'x', 'p', 'o', 'r', 't', '/', 'd', 'Enter'],
    hints: [
      'Type ":v/export/d" and press Enter to keep only exported lines.'
    ],
  },
  {
    day: 26,
    week: 4,
    title: 'Normal Command Execution: :%norm',
    concept: 'Batch executing normal mode keystrokes via Ex',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Prepend "// " to every line in the buffer using ":%norm I// <Enter>".',
    initialText: 'alpha: 1\nbeta: 2\ngamma: 3',
    cursorStart: { row: 0, col: 0 },
    targetText: '// alpha: 1\n// beta: 2\n// gamma: 3',
    parKeystrokes: 12,
    optimalKeys: [':', '%', 'n', 'o', 'r', 'm', ' ', 'I', '/', '/', ' ', 'Enter'],
    hints: [
      'Type ":%norm I// " and press Enter.'
    ],
  },
  {
    day: 27,
    week: 4,
    title: 'Command Mode Save & Write Verification: :w',
    concept: 'Validating written disk state',
    chapterRef: '00-getting-started/03-first-day-survival-guide.md',
    mission: 'Save the configuration buffer with ":w<Enter>".',
    initialText: 'export const SERVER_CONFIG = { mode: "production" };',
    cursorStart: { row: 0, col: 0 },
    targetText: 'export const SERVER_CONFIG = { mode: "production" };',
    requiredAction: 'save',
    parKeystrokes: 3,
    optimalKeys: [':', 'w', 'Enter'],
    hints: [
      'Type ":w" and press Enter.'
    ],
  },
  {
    day: 28,
    week: 4,
    title: 'Macro Recording: The Automation Loop (qa...q, @a)',
    concept: 'Recording and replaying keyboard macros',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Record macro "a" with "qaA;<Esc>jq" on line 1, then replay it on lines 2 and 3 with "2@a".',
    initialText: 'const a = 1\nconst b = 2\nconst c = 3',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const a = 1;\nconst b = 2;\nconst c = 3;',
    parKeystrokes: 10,
    optimalKeys: ['q', 'a', 'A', ';', 'Escape', 'j', 'q', '2', '@', 'a'],
    hints: [
      'Type "qa" to start recording to register a.',
      'Type "A;<Esc>j" then "q" to stop recording.',
      'Type "2@a" to replay the macro across the remaining 2 lines.'
    ],
  },

  // =========================================================================
  // WEEK 5: LazyVim Discovery & File Navigation (Days 29–35)
  // =========================================================================
  {
    day: 29,
    week: 5,
    title: 'LazyVim Fzf: Find Files (<leader>ff)',
    concept: '<Space>ff Fuzzy finder modal',
    chapterRef: '02-navigation-and-project-management/02-file-finding-telescope-fzf.md',
    mission: 'Launch the Fzf file finder modal using "<Space>ff".',
    initialText: '// Press <Space>ff to find files across the project\nconsole.log("Ready");',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>ff to find files across the project\nconsole.log("Ready");',
    requiredAction: 'fzf',
    parKeystrokes: 3,
    optimalKeys: [' ', 'f', 'f'],
    hints: [
      'Press Space, then "f", then "f" to trigger Fzf Find Files.'
    ],
  },
  {
    day: 30,
    week: 5,
    title: 'LazyVim Fzf: Live Grep (<leader>sg)',
    concept: '<Space>sg Codebase ripgrep search',
    chapterRef: '02-navigation-and-project-management/02-file-finding-telescope-fzf.md',
    mission: 'Launch the live grep search modal using "<Space>sg".',
    initialText: '// Press <Space>sg to search strings across project files',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>sg to search strings across project files',
    requiredAction: 'grep',
    parKeystrokes: 3,
    optimalKeys: [' ', 's', 'g'],
    hints: [
      'Press Space, then "s", then "g" to open Live Grep.'
    ],
  },
  {
    day: 31,
    week: 5,
    title: 'LazyVim Fzf: Buffer Picker (<leader>fb)',
    concept: '<Space>fb Active buffer navigation',
    chapterRef: '02-navigation-and-project-management/01-buffers-windows-tabs.md',
    mission: 'Open the buffer selector modal with "<Space>fb".',
    initialText: '// Press <Space>fb to switch between open buffers',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>fb to switch between open buffers',
    requiredAction: 'buffers',
    parKeystrokes: 3,
    optimalKeys: [' ', 'f', 'b'],
    hints: [
      'Press Space, then "f", then "b" to list active buffers.'
    ],
  },
  {
    day: 32,
    week: 5,
    title: 'LazyVim Neo-tree: File Explorer (<leader>e)',
    concept: '<Space>e Collapsible file sidebar',
    chapterRef: '02-navigation-and-project-management/03-file-explorers-neotree-oil.md',
    mission: 'Toggle the Neo-tree sidebar explorer using "<Space>e".',
    initialText: '// Press <Space>e to toggle Neo-tree sidebar explorer',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>e to toggle Neo-tree sidebar explorer',
    requiredAction: 'neotree',
    parKeystrokes: 2,
    optimalKeys: [' ', 'e'],
    hints: [
      'Press Space, then "e" to toggle Neo-tree.'
    ],
  },
  {
    day: 33,
    week: 5,
    title: 'LazyVim Trouble: Diagnostics Drawer (<leader>xx)',
    concept: '<Space>xx Workspace type and lint errors',
    chapterRef: '03-modern-ide-power-tools/06-diagnostics-and-trouble.md',
    mission: 'Toggle the Trouble diagnostics drawer with "<Space>xx".',
    initialText: '// Press <Space>xx to toggle Trouble diagnostics panel',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>xx to toggle Trouble diagnostics panel',
    requiredAction: 'trouble',
    parKeystrokes: 3,
    optimalKeys: [' ', 'x', 'x'],
    hints: [
      'Press Space, then "x", then "x" to open Trouble.'
    ],
  },
  {
    day: 34,
    week: 5,
    title: 'Diagnostic Hopping: ]d & Line Removal',
    concept: ']d Jump to next diagnostic error',
    chapterRef: '03-modern-ide-power-tools/06-diagnostics-and-trouble.md',
    mission: 'Jump to the diagnostic error line with "]d" and delete it with "dd".',
    initialText: 'const valid = true;\n// ERROR: Type mismatch at runtime\nconst port = 3000;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const valid = true;\nconst port = 3000;',
    parKeystrokes: 4,
    optimalKeys: [']', 'd', 'd', 'd'],
    hints: [
      'Type "]d" to jump directly to the diagnostic error.',
      'Type "dd" to remove the error line.'
    ],
  },
  {
    day: 35,
    week: 5,
    title: 'LazyVim Which-Key Intuition (<Space>)',
    concept: '<Space> Leader discovery and fast saving (<Space>w)',
    chapterRef: '01-vim-grammar-and-motions/01-why-neovim-mental-model.md',
    mission: 'Use the LazyVim leader key to save the buffer: press "<Space>w".',
    initialText: 'export const status = "saved_with_leader";',
    cursorStart: { row: 0, col: 0 },
    targetText: 'export const status = "saved_with_leader";',
    requiredAction: 'save',
    parKeystrokes: 2,
    optimalKeys: [' ', 'w'],
    hints: [
      'Press Space, then "w" to trigger the LazyVim quick save.'
    ],
  },

  // =========================================================================
  // WEEK 6: LSP Code Intelligence & Productivity (Days 36–42)
  // =========================================================================
  {
    day: 36,
    week: 6,
    title: 'LSP Hover Documentation (K)',
    concept: 'K symbol documentation and type inspection',
    chapterRef: '03-modern-ide-power-tools/02-code-navigation-and-inspection.md',
    mission: 'Inspect the type signature under cursor by pressing "K".',
    initialText: 'export interface UserSession {\n  id: string;\n  token: string;\n}',
    cursorStart: { row: 0, col: 20 },
    targetText: 'export interface UserSession {\n  id: string;\n  token: string;\n}',
    requiredAction: 'lsp_hover',
    parKeystrokes: 1,
    optimalKeys: ['K'],
    hints: [
      'Press uppercase "K" to request LSP hover docs.'
    ],
  },
  {
    day: 37,
    week: 6,
    title: 'LSP Goto Definition (gd)',
    concept: 'gd jump to declaration',
    chapterRef: '03-modern-ide-power-tools/02-code-navigation-and-inspection.md',
    mission: 'Jump to the definition of "createAuthService" using "gd".',
    initialText: 'function createAuthService() {}\n\nconst auth = createAuthService();',
    cursorStart: { row: 2, col: 15 },
    targetText: 'function createAuthService() {}\n\nconst auth = createAuthService();',
    requiredAction: 'lsp_definition',
    parKeystrokes: 2,
    optimalKeys: ['g', 'd'],
    hints: [
      'Type "gd" to jump to definition.'
    ],
  },
  {
    day: 38,
    week: 6,
    title: 'LSP References Inspection (gr)',
    concept: 'gr list all usages across codebase',
    chapterRef: '03-modern-ide-power-tools/02-code-navigation-and-inspection.md',
    mission: 'Query all references of the identifier under cursor using "gr".',
    initialText: 'export const APP_ID = "org.app.v1";',
    cursorStart: { row: 0, col: 15 },
    targetText: 'export const APP_ID = "org.app.v1";',
    requiredAction: 'lsp_references',
    parKeystrokes: 2,
    optimalKeys: ['g', 'r'],
    hints: [
      'Type "gr" to list references.'
    ],
  },
  {
    day: 39,
    week: 6,
    title: 'LSP Code Actions (<leader>ca)',
    concept: '<Space>ca quickfix and auto-import menu',
    chapterRef: '03-modern-ide-power-tools/03-refactoring-and-code-actions.md',
    mission: 'Trigger the LSP code actions menu using "<Space>ca".',
    initialText: 'const element = React.createElement("div");',
    cursorStart: { row: 0, col: 18 },
    targetText: 'const element = React.createElement("div");',
    requiredAction: 'lsp_code_action',
    parKeystrokes: 3,
    optimalKeys: [' ', 'c', 'a'],
    hints: [
      'Press Space, then "c", then "a" to show code actions.'
    ],
  },
  {
    day: 40,
    week: 6,
    title: 'LSP Symbol Rename (<leader>cr)',
    concept: '<Space>cr safe symbol refactor',
    chapterRef: '03-modern-ide-power-tools/03-refactoring-and-code-actions.md',
    mission: 'Open the LSP symbol rename dialog using "<Space>cr".',
    initialText: 'function oldProcessUser(id: string) {}',
    cursorStart: { row: 0, col: 12 },
    targetText: 'function oldProcessUser(id: string) {}',
    requiredAction: 'lsp_rename',
    parKeystrokes: 3,
    optimalKeys: [' ', 'c', 'r'],
    hints: [
      'Press Space, then "c", then "r" to trigger LSP rename.'
    ],
  },
  {
    day: 41,
    week: 6,
    title: 'LSP Document Formatting (<leader>cf)',
    concept: '<Space>cf auto-format document',
    chapterRef: '03-modern-ide-power-tools/04-formatting-and-linting.md',
    mission: 'Format this unindented buffer to clean Prettier standards using "<Space>cf".',
    initialText: 'function calc() {\nconst a = 1;\nreturn a;\n}',
    cursorStart: { row: 0, col: 0 },
    targetText: 'function calc() {\n  const a = 1;\n  return a;\n}',
    requiredAction: 'format',
    parKeystrokes: 3,
    optimalKeys: [' ', 'c', 'f'],
    hints: [
      'Press Space, then "c", then "f" to format the document.'
    ],
  },
  {
    day: 42,
    week: 6,
    title: 'Treesitter Method Hopping: ]m & [m',
    concept: 'AST function jump and change inside braces',
    chapterRef: '02-navigation-and-project-management/04-treesitter-code-navigation.md',
    mission: 'Jump to the second function with "]m", and wipe its inner contents with "ci{".',
    initialText: 'function first() {\n  return 1;\n}\n\nfunction target() {\n  OBSOLETE\n}',
    cursorStart: { row: 0, col: 0 },
    targetText: 'function first() {\n  return 1;\n}\n\nfunction target() {}',
    parKeystrokes: 6,
    optimalKeys: [']', 'm', 'c', 'i', '{', 'Escape'],
    hints: [
      'Type "]m" to leap cursor to function target.',
      'Type "ci{" to clear inside braces and press <Esc>.'
    ],
  },

  // =========================================================================
  // WEEK 7: Git, Search & Plugin Productivity (Days 43–49)
  // =========================================================================
  {
    day: 43,
    week: 7,
    title: 'LazyGit Dashboard (<leader>gg)',
    concept: '<Space>gg Floating terminal git management',
    chapterRef: '02-navigation-and-project-management/05-git-workflow-and-lazygit.md',
    mission: 'Open the LazyGit dashboard modal using "<Space>gg".',
    initialText: '// Press <Space>gg to open LazyGit dashboard',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>gg to open LazyGit dashboard',
    requiredAction: 'lazygit',
    parKeystrokes: 3,
    optimalKeys: [' ', 'g', 'g'],
    hints: [
      'Press Space, then "g", then "g" to open LazyGit.'
    ],
  },
  {
    day: 44,
    week: 7,
    title: 'Grug-Far: Project Search & Replace (<leader>sr)',
    concept: '<Space>sr Multi-file find and replace',
    chapterRef: '06-plugin-mastery-and-ecosystem/04-grug-far-project-search-and-replace.md',
    mission: 'Open Grug-Far project find and replace using "<Space>sr".',
    initialText: '// Press <Space>sr to trigger project search and replace',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>sr to trigger project search and replace',
    requiredAction: 'grug_far',
    parKeystrokes: 3,
    optimalKeys: [' ', 's', 'r'],
    hints: [
      'Press Space, then "s", then "r" to invoke Grug-Far.'
    ],
  },
  {
    day: 45,
    week: 7,
    title: 'Lazy.nvim Plugin Ecosystem (<leader>l)',
    concept: '<Space>l Plugin manager status',
    chapterRef: '06-plugin-mastery-and-ecosystem/01-lazy-nvim-plugin-manager.md',
    mission: 'Open the Lazy.nvim manager dashboard with "<Space>l".',
    initialText: '// Press <Space>l to inspect installed Lazy plugins',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>l to inspect installed Lazy plugins',
    requiredAction: 'lazy_home',
    parKeystrokes: 2,
    optimalKeys: [' ', 'l'],
    hints: [
      'Press Space, then "l" to inspect Lazy.nvim.'
    ],
  },
  {
    day: 46,
    week: 7,
    title: 'Google AI Stack: Antigravity Agent (<leader>aa)',
    concept: '<Space>aa Google Antigravity autonomous agent',
    chapterRef: '05-advanced-and-customization/02-lazy-extras-and-ai-assistants.md',
    mission: 'Launch the Google Antigravity agent in a floating terminal using "<Space>aa".',
    initialText: '// Press <Space>aa to launch Google Antigravity agent (agy)',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>aa to launch Google Antigravity agent (agy)',
    requiredAction: 'ai_antigravity',
    parKeystrokes: 3,
    optimalKeys: [' ', 'a', 'a'],
    hints: [
      'Press Space to invoke Which-Key.',
      'Type "a" to open the +ai (Google / Pi / Antigravity) group.',
      'Type "a" to spawn Google Antigravity.'
    ],
  },
  {
    day: 47,
    week: 7,
    title: 'Floating Terminal Multiplexing (<leader>ft)',
    concept: '<Space>ft Embedded floating terminal',
    chapterRef: '02-navigation-and-project-management/01-buffers-windows-tabs.md',
    mission: 'Toggle the floating terminal with "<Space>ft".',
    initialText: '// Press <Space>ft to toggle floating terminal',
    cursorStart: { row: 0, col: 0 },
    targetText: '// Press <Space>ft to toggle floating terminal',
    requiredAction: 'terminal',
    parKeystrokes: 3,
    optimalKeys: [' ', 'f', 't'],
    hints: [
      'Press Space, then "f", then "t" to open the floating terminal.'
    ],
  },
  {
    day: 48,
    week: 7,
    title: 'Vim-Surround Delimiter Replacement: cs"\' & ds"',
    concept: 'cs"\' replace and ds" delete surround',
    chapterRef: '06-plugin-mastery-and-ecosystem/06-micro-productivity-and-editing-plugins.md',
    mission: 'Replace double quotes around "production" with single quotes using "cs"\'".',
    initialText: 'const env = "production";',
    cursorStart: { row: 0, col: 15 },
    targetText: 'const env = \'production\';',
    parKeystrokes: 4,
    optimalKeys: ['c', 's', '"', '\''],
    hints: [
      'Positioned inside quotes, type "cs\"\'" to replace double quotes with single quotes.'
    ],
  },
  {
    day: 49,
    week: 7,
    title: 'Multi-Count Macro Orchestration: qaIexport <Esc>jq, 2@a',
    concept: 'Batch exporting private variables with macro',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Record macro "a" on line 1 ("qaIexport <Esc>jq"), then replay across lines 2 and 3 with "2@a".',
    initialText: 'const USER = "eddie";\nconst ROLE = "admin";\nconst ACCESS = true;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'export const USER = "eddie";\nexport const ROLE = "admin";\nexport const ACCESS = true;',
    parKeystrokes: 16,
    optimalKeys: ['q', 'a', 'I', 'e', 'x', 'p', 'o', 'r', 't', ' ', 'Escape', 'j', 'q', '2', '@', 'a'],
    hints: [
      'Type "qa" to start macro a.',
      'Type "Iexport <Esc>j" and "q" to stop.',
      'Type "2@a" to run across remaining lines.'
    ],
  },

  // =========================================================================
  // WEEK 8: The Grandmaster Trials & Polyglot Refactoring (Days 50–60)
  // =========================================================================
  {
    day: 50,
    week: 8,
    title: 'TypeScript Refactor: Parameter Pruning (f, dt))',
    concept: 'Precision seeking and forward slice deletion',
    chapterRef: '04-language-specific-playbooks/01-typescript-javascript-web.md',
    mission: 'Prune the deprecated callback parameter: seek to comma with "f,", and delete through closing paren with "dt)".',
    initialText: 'function getData(url: string, callback: any) {\n  return fetch(url);\n}',
    cursorStart: { row: 0, col: 0 },
    targetText: 'function getData(url: string) {\n  return fetch(url);\n}',
    parKeystrokes: 5,
    optimalKeys: ['f', ',', 'd', 't', ')'],
    hints: [
      'Type "f," to seek to the comma.',
      'Type "dt)" to delete right up to the closing parenthesis.'
    ],
  },
  {
    day: 51,
    week: 8,
    title: 'React Refactor: Component Name Modernization (ciw)',
    concept: 'Modern React component identifier renaming',
    chapterRef: '04-language-specific-playbooks/01-typescript-javascript-web.md',
    mission: 'Modernize the component name: change "OldHeader" to "AppHeader" using "ciwAppHeader<Esc>".',
    initialText: 'export const OldHeader = () => {\n  return <h1>Welcome</h1>;\n};',
    cursorStart: { row: 0, col: 13 },
    targetText: 'export const AppHeader = () => {\n  return <h1>Welcome</h1>;\n};',
    parKeystrokes: 13,
    optimalKeys: ['c', 'i', 'w', 'A', 'p', 'p', 'H', 'e', 'a', 'd', 'e', 'r', 'Escape'],
    hints: [
      'Cursor on "OldHeader". Type "ciwAppHeader<Esc>".'
    ],
  },
  {
    day: 52,
    week: 8,
    title: 'SQL Schema to TypeScript Interface Mapping',
    concept: 'Surround conversions on record fields',
    chapterRef: '04-language-specific-playbooks/01-typescript-javascript-web.md',
    mission: 'Enclose the raw column names in double quotes using "gsaw"" on line 1, then "j0gsaw"" on line 2.',
    initialText: 'email: string;\nstatus: string;',
    cursorStart: { row: 0, col: 0 },
    targetText: '"email": string;\n"status": string;',
    parKeystrokes: 12,
    optimalKeys: ['g', 's', 'a', 'w', '"', 'j', '0', 'g', 's', 'a', 'w', '"'],
    hints: [
      'Type "gsaw\"" to quote email.',
      'Type "j0gsaw\"" to quote status.'
    ],
  },
  {
    day: 53,
    week: 8,
    title: 'Go Struct Refactor: Updating Struct Tags (ci`)',
    concept: 'Backtick text object modification',
    chapterRef: '04-language-specific-playbooks/03-go-development-powerhouse.md',
    mission: 'Change the struct tag inside backticks to json:"user_id" with "ci`json:"user_id"<Esc>".',
    initialText: 'type User struct {\n  ID string `json:"old_id"`\n}',
    cursorStart: { row: 1, col: 14 },
    targetText: 'type User struct {\n  ID string `json:"user_id"`\n}',
    parKeystrokes: 19,
    optimalKeys: ['c', 'i', '`', 'j', 's', 'o', 'n', ':', '"', 'u', 's', 'e', 'r', '_', 'i', 'd', '"', 'Escape'],
    hints: [
      'Type "ci`" to clear inside backticks.',
      'Type json:"user_id" and exit with <Esc>.'
    ],
  },
  {
    day: 54,
    week: 8,
    title: 'Python Workflow: Indentation & Docstrings',
    concept: 'Visual line indentation and docstring edits',
    chapterRef: '04-language-specific-playbooks/02-python-environment-workflow.md',
    mission: 'Indent the function body right using "V" then ">".',
    initialText: 'def calculate_metrics():\nreturn 42',
    cursorStart: { row: 1, col: 0 },
    targetText: 'def calculate_metrics():\n  return 42',
    parKeystrokes: 2,
    optimalKeys: ['V', '>'],
    hints: [
      'Select line 2 with "V".',
      'Press ">" to indent.'
    ],
  },
  {
    day: 55,
    week: 8,
    title: 'Rust Craftsmanship: Match Arms & Option Unwrap',
    concept: 'Safe error message strings in Rust',
    chapterRef: '04-language-specific-playbooks/04-rust-craftsmanship.md',
    mission: 'Change the expect message inside quotes with "ci"" -> "connection timeout".',
    initialText: 'let conn = pool.get().expect("PANIC_HERE");',
    cursorStart: { row: 0, col: 32 },
    targetText: 'let conn = pool.get().expect("connection timeout");',
    parKeystrokes: 22,
    optimalKeys: ['c', 'i', '"', 'c', 'o', 'n', 'n', 'e', 'c', 't', 'i', 'o', 'n', ' ', 't', 'i', 'm', 'e', 'o', 'u', 't', 'Escape'],
    hints: [
      'Type "ci\"" to wipe inside quotes.',
      'Type "connection timeout" and press <Esc>.'
    ],
  },
  {
    day: 56,
    week: 8,
    title: 'Production Incident: Hotfixing JWT Secret Under Pressure',
    concept: 'Search, replace inside quotes, and instant save',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Production bug! Seek to the compromised secret with "/secret<Enter>", replace with "ci"STRONG_PROD_SECRET<Esc>", and save with ":w<Enter>".',
    initialText: 'export const JWT_SECRET = "default_dev_secret";\nexport const PORT = 4000;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'export const JWT_SECRET = "STRONG_PROD_SECRET";\nexport const PORT = 4000;',
    requiredAction: 'save',
    parKeystrokes: 33,
    optimalKeys: ['/', 's', 'e', 'c', 'r', 'e', 't', 'Enter', 'c', 'i', '"', 'S', 'T', 'R', 'O', 'N', 'G', '_', 'P', 'R', 'O', 'D', '_', 'S', 'E', 'C', 'R', 'E', 'T', 'Escape', ':', 'w', 'Enter'],
    hints: [
      'Search for "/secret" <Enter>.',
      'Type "ci\"" -> "STRONG_PROD_SECRET" -> <Esc>.',
      'Type ":w" <Enter> to save.'
    ],
  },
  {
    day: 57,
    week: 8,
    title: 'Speedrun Golf: Monolith Cleanup in Ex Commands',
    concept: ':%s and :g compound execution',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Strip all "console.log" lines with ":g/console.log/d<Enter>".',
    initialText: 'const a = 1;\nconsole.log(a);\nconst b = 2;\nconsole.log(b);',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const a = 1;\nconst b = 2;',
    parKeystrokes: 18,
    optimalKeys: [':', 'g', '/', 'c', 'o', 'n', 's', 'o', 'l', 'e', '.', 'l', 'o', 'g', '/', 'd', 'Enter'],
    hints: [
      'Type ":g/console.log/d" and press Enter.'
    ],
  },
  {
    day: 58,
    week: 8,
    title: 'Full LazyVim Integration: Format & Save',
    concept: '<Space>cf format and <Space>w save pipeline',
    chapterRef: '06-plugin-mastery-and-ecosystem/01-lazy-nvim-plugin-manager.md',
    mission: 'Format the messy indentation with "<Space>cf" and save with "<Space>w".',
    initialText: 'function run() {\nconst ready = true;\nreturn ready;\n}',
    cursorStart: { row: 0, col: 0 },
    targetText: 'function run() {\n  const ready = true;\n  return ready;\n}',
    requiredAction: 'save',
    parKeystrokes: 5,
    optimalKeys: [' ', 'c', 'f', ' ', 'w'],
    hints: [
      'Press "<Space>cf" to format.',
      'Press "<Space>w" to write buffer.'
    ],
  },
  {
    day: 59,
    week: 8,
    title: 'Vim Golf Gauntlet: The 5-Keystroke Code Surgery',
    concept: 'V2jcclean<Esc>',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Golf Challenge! Transform the 3 legacy lines into "clean" in under 10 keystrokes using "V2jcclean<Esc>".',
    initialText: 'broken_1\nbroken_2\nbroken_3',
    cursorStart: { row: 0, col: 0 },
    targetText: 'clean',
    parKeystrokes: 10,
    optimalKeys: ['V', '2', 'j', 'c', 'c', 'l', 'e', 'a', 'n', 'Escape'],
    hints: [
      'Press "V" for Visual Line.',
      'Press "2j" to select all 3 lines.',
      'Press "c" to change them into "clean" and press <Esc>.'
    ],
  },
  {
    day: 60,
    week: 8,
    title: 'The Neovim Grandmaster Crown: Full-Stack Graduation',
    concept: 'Ultimate Full-Stack Refactor & Certification',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Final Trial: Wipe "IN_PROGRESS" with "ci"", insert "NEOVIM_GRANDMASTER", and save with ":w".',
    initialText: 'export const CERTIFICATION_STATUS = "IN_PROGRESS";',
    cursorStart: { row: 0, col: 40 },
    targetText: 'export const CERTIFICATION_STATUS = "NEOVIM_GRANDMASTER";',
    requiredAction: 'save',
    parKeystrokes: 26,
    optimalKeys: ['c', 'i', '"', 'N', 'E', 'O', 'V', 'I', 'M', '_', 'G', 'R', 'A', 'N', 'D', 'M', 'A', 'S', 'T', 'E', 'R', 'Escape', ':', 'w', 'Enter'],
    hints: [
      'Type "ci\"" to clear inside quotes.',
      'Type "NEOVIM_GRANDMASTER" and press <Esc>.',
      'Type ":w" <Enter> to save and claim the Grandmaster Crown!'
    ],
  },
];
