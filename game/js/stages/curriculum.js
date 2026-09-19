/**
 * Complete 30-Day Neovim Mastery Game Curriculum.
 * Mapped to repository markdown chapters and pre-configured lazyvim settings.
 */

export const STAGES = [
  // ==========================================
  // WEEK 1: The Grammar of Vim Motions
  // ==========================================
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
    title: 'Arrowless Navigation',
    concept: 'h, j, k, l with Counts',
    chapterRef: '01-vim-grammar-and-motions/03-movement-mastery.md',
    mission: 'Navigate without arrow keys! Use count motions (3j, 2l) to land on BUG and delete it with "x" 3 times.',
    initialText: 'line 1: safe\nline 2: safe\nline 3: safe\nline 4: BUGclean',
    cursorStart: { row: 0, col: 0 },
    targetText: 'line 1: safe\nline 2: safe\nline 3: safe\nline 4: clean',
    parKeystrokes: 9,
    optimalKeys: ['3', 'j', '8', 'l', 'x', 'x', 'x'],
    hints: [
      'Press "3j" to jump directly down to line 4.',
      'Press "8l" (or "w") to navigate to "BUG".',
      'Press "x" three times to delete "B", "U", "G".'
    ],
  },
  {
    day: 3,
    week: 1,
    title: 'Word Motions & Line Boundaries',
    concept: 'w, b, e, ge, 0, ^, $',
    chapterRef: '01-vim-grammar-and-motions/03-movement-mastery.md',
    mission: 'Jump by words! Use "w" to reach WRONG and replace it using "cw" -> "correct" <Esc>.',
    initialText: 'const status = WRONG;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const status = correct;',
    parKeystrokes: 13,
    optimalKeys: ['3', 'w', 'c', 'w', 'c', 'o', 'r', 'r', 'e', 'c', 't', 'Escape'],
    hints: [
      'Type "3w" to jump to the start of "WRONG".',
      'Type "cw" to change the word into Insert mode.',
      'Type "correct" and press <Esc>.'
    ],
  },
  {
    day: 4,
    week: 1,
    title: 'The Grammar of Vim: Verb + Noun',
    concept: 'Operators (d, c, y) + Motions (w, $, 0)',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Delete to the end of the line using "d$" to clean up the trailing comment.',
    initialText: 'const port = 8080; // DELETE_THIS_OBSOLETE_COMMENT',
    cursorStart: { row: 0, col: 19 },
    targetText: 'const port = 8080; ',
    parKeystrokes: 2,
    optimalKeys: ['d', '$'],
    hints: [
      'Position cursor at the start of "//".',
      'Type "d$" to delete from cursor to end of line.'
    ],
  },
  {
    day: 5,
    week: 1,
    title: 'Inline Seeking Precision',
    concept: 'f, F, t, T with ; and ,',
    chapterRef: '01-vim-grammar-and-motions/03-movement-mastery.md',
    mission: 'Find target characters fast! Use "f(" to jump to paren, then "ci(" to replace parameters with "id: string".',
    initialText: 'function fetchUser(old_a, old_b, old_c) {',
    cursorStart: { row: 0, col: 0 },
    targetText: 'function fetchUser(id: string) {',
    parKeystrokes: 16,
    optimalKeys: ['f', '(', 'c', 'i', '(', 'i', 'd', ':', ' ', 's', 't', 'r', 'i', 'n', 'g', 'Escape'],
    hints: [
      'Type "f(" to seek directly to the opening parenthesis.',
      'Type "ci(" to change inside parentheses.',
      'Type "id: string" and exit with <Esc>.'
    ],
  },
  {
    day: 6,
    week: 1,
    title: 'The Superpower of Text Objects',
    concept: 'ci", di", ca(, da{',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Change inside quotes without manually seeking! From anywhere inside the line, type "ci"" and enter "Tokyo Night".',
    initialText: 'const theme = "OLD_THEME_NAME";',
    cursorStart: { row: 0, col: 17 },
    targetText: 'const theme = "Tokyo Night";',
    parKeystrokes: 15,
    optimalKeys: ['c', 'i', '"', 'T', 'o', 'k', 'y', 'o', ' ', 'N', 'i', 'g', 'h', 't', 'Escape'],
    hints: [
      'No need to position cursor on the first quote.',
      'Type "ci\"" to instantly wipe inside quotes.',
      'Type "Tokyo Night" and press <Esc>.'
    ],
  },
  {
    day: 7,
    week: 1,
    title: 'Registers & Clipboard Secrets',
    concept: 'Yanking, Pasting & Repeat (.)',
    chapterRef: '01-vim-grammar-and-motions/05-registers-and-clipboard.md',
    mission: 'Duplicate the header line using "yy" then paste below with "p".',
    initialText: 'export const API_URL = "https://api.domain.com";',
    cursorStart: { row: 0, col: 0 },
    targetText: 'export const API_URL = "https://api.domain.com";\nexport const API_URL = "https://api.domain.com";',
    parKeystrokes: 3,
    optimalKeys: ['y', 'y', 'p'],
    hints: [
      'Type "yy" to yank the entire line.',
      'Type "p" to paste it right below.'
    ],
  },

  // ==========================================
  // WEEK 2: Navigation, Buffers, Windows & Git
  // ==========================================
  {
    day: 8,
    week: 2,
    title: 'Paragraph & File-Wide Jumps',
    concept: 'gg, G, {, } Navigation',
    chapterRef: '02-navigation-and-project-management/01-buffers-windows-tabs.md',
    mission: 'Jump to the bottom of the file with "G", then delete the deprecated footer line with "dd".',
    initialText: 'header line\ncontent line 1\ncontent line 2\nDEPRECATED_FOOTER',
    cursorStart: { row: 0, col: 0 },
    targetText: 'header line\ncontent line 1\ncontent line 2',
    parKeystrokes: 3,
    optimalKeys: ['G', 'd', 'd'],
    hints: [
      'Press "G" to teleport to the last line.',
      'Press "dd" to delete the current line.'
    ],
  },
  {
    day: 9,
    week: 2,
    title: 'Visual Block & Multi-Line Edits',
    concept: 'V line visual and indentation',
    chapterRef: '01-vim-grammar-and-motions/04-visual-and-block-editing.md',
    mission: 'Select both lines in Visual Line mode ("V", "j") and indent them right with ">".',
    initialText: 'const a = 1;\nconst b = 2;',
    cursorStart: { row: 0, col: 0 },
    targetText: '  const a = 1;\n  const b = 2;',
    parKeystrokes: 3,
    optimalKeys: ['V', 'j', '>'],
    hints: [
      'Press "V" to enter Visual Line mode.',
      'Press "j" to extend selection to the second line.',
      'Press ">" to indent the selection by 2 spaces.'
    ],
  },
  {
    day: 10,
    week: 2,
    title: 'Undo Trees & Line Joining',
    concept: 'u, <C-r>, and J',
    chapterRef: '00-getting-started/03-first-day-survival-guide.md',
    mission: 'Accidental delete happened! Press "u" to undo, then press "J" to join the two lines into one.',
    initialText: 'const welcome = ',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const welcome = "Hello World";',
    parKeystrokes: 2,
    // Note: starts after an accidental delete was snapshot
    optimalKeys: ['u', 'J'],
    hints: [
      'Press "u" to undo the accidental deletion.',
      'Press "J" to join line 1 and line 2 with a clean space.'
    ],
    setup(engine) {
      engine.buffer.setText('const welcome =\n"Hello World";');
      engine.saveSnapshot();
      engine.buffer.deleteLine(1);
    }
  },
  {
    day: 11,
    week: 2,
    title: 'Pattern Search & Global Replace',
    concept: ':%s/find/replace/g in Command Mode',
    chapterRef: '06-plugin-mastery-and-ecosystem/04-grug-far-project-search-and-replace.md',
    mission: 'Rename all occurrences of "badVar" to "goodVar" using ":%s/badVar/goodVar/g".',
    initialText: 'let badVar = 10;\nfunction test() { return badVar * 2; }',
    cursorStart: { row: 0, col: 0 },
    targetText: 'let goodVar = 10;\nfunction test() { return goodVar * 2; }',
    parKeystrokes: 23,
    optimalKeys: [':', '%', 's', '/', 'b', 'a', 'd', 'V', 'a', 'r', '/', 'g', 'o', 'o', 'd', 'V', 'a', 'r', '/', 'g', 'Enter'],
    hints: [
      'Press ":" to enter Command mode.',
      'Type "%s/badVar/goodVar/g" and press Enter.'
    ],
  },
  {
    day: 12,
    week: 2,
    title: 'Buffer Navigation & Save Keys',
    concept: '<C-s>, <leader>w, and :bnext',
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
    title: 'Flash.nvim 2-Keystroke Teleportation',
    concept: 's{char1}{char2} + label',
    chapterRef: '06-plugin-mastery-and-ecosystem/03-flash-nvim-teleportation-motions.md',
    mission: 'Teleport across the screen with Flash! Press "s", type "re", then press the label ("a") and delete word with "dw".',
    initialText: 'const alpha = 1;\nconst beta = 2;\nconst removeMe = 3;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const alpha = 1;\nconst beta = 2;\nconst = 3;',
    parKeystrokes: 6,
    optimalKeys: ['s', 'r', 'e', 'a', 'd', 'w'],
    hints: [
      'Press "s" to trigger Flash teleportation.',
      'Type "re" to find "removeMe".',
      'Press the target label "a" to jump instantly, then type "dw".'
    ],
  },
  {
    day: 14,
    week: 2,
    title: 'Dot Repeat Mastery',
    concept: 'The mighty . key',
    chapterRef: '01-vim-grammar-and-motions/02-the-grammar-of-vim.md',
    mission: 'Delete the first obsolete line with "dd", then use "." twice to repeat and delete the other two obsolete lines.',
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

  // ==========================================
  // WEEK 3: Modern IDE Power Tools
  // ==========================================
  {
    day: 15,
    week: 3,
    title: 'Treesitter AST Hopping',
    concept: ']m and [m Function Hopping',
    chapterRef: '02-navigation-and-project-management/04-treesitter-code-navigation.md',
    mission: 'Jump to the next function definition using "]m", then wipe its contents with "ci{".',
    initialText: 'function first() {\n  return 1;\n}\n\nfunction target() {\n  OBSOLETE_BODY\n}',
    cursorStart: { row: 0, col: 0 },
    targetText: 'function first() {\n  return 1;\n}\n\nfunction target() {}',
    parKeystrokes: 6,
    optimalKeys: [']', 'm', 'c', 'i', '{', 'Escape'],
    hints: [
      'Type "]m" to jump cursor to the next function definition.',
      'Type "ci{" to change inside the function braces.',
      'Press <Esc> to finish.'
    ],
  },
  {
    day: 16,
    week: 3,
    title: 'Code Intelligence & Definition Jumps',
    concept: 'gd, gr, and K',
    chapterRef: '03-modern-ide-power-tools/02-code-navigation-and-inspection.md',
    mission: 'Jump to definition using "gd", then change the variable name with "ciw" -> "adminUser".',
    initialText: 'let user = "Eddie";\n// ... miles away ...\nconsole.log(user);',
    cursorStart: { row: 2, col: 13 },
    targetText: 'let adminUser = "Eddie";\n// ... miles away ...\nconsole.log(user);',
    parKeystrokes: 16,
    optimalKeys: ['g', 'g', 'w', 'c', 'i', 'w', 'a', 'd', 'm', 'i', 'n', 'U', 's', 'e', 'r', 'Escape'],
    hints: [
      'Jump to the top definition using "ggw" (or "gd").',
      'Type "ciw" to change inner word.',
      'Type "adminUser" and exit with <Esc>.'
    ],
  },
  {
    day: 17,
    week: 3,
    title: 'Diagnostic Hopping & Trouble',
    concept: ']d and [d Error Navigation',
    chapterRef: '03-modern-ide-power-tools/06-diagnostics-and-trouble.md',
    mission: 'Jump to the syntax error with "]d", delete the error marker with "dd".',
    initialText: 'const valid = true;\n// ERROR: missing semicolon\nconst port = 3000;',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const valid = true;\nconst port = 3000;',
    parKeystrokes: 4,
    optimalKeys: [']', 'd', 'd', 'd'],
    hints: [
      'Type "]d" to jump directly to the diagnostic error line.',
      'Type "dd" to delete the erroneous line.'
    ],
  },
  {
    day: 18,
    week: 3,
    title: 'Code Actions & Quick Refactoring',
    concept: '<leader>ca and ciw',
    chapterRef: '03-modern-ide-power-tools/03-refactoring-and-code-actions.md',
    mission: 'Refactor identifier: use "ciw" on "oldHandler" to rename it to "handleAuth".',
    initialText: 'export function oldHandler(req, res) {}',
    cursorStart: { row: 0, col: 18 },
    targetText: 'export function handleAuth(req, res) {}',
    parKeystrokes: 14,
    optimalKeys: ['c', 'i', 'w', 'h', 'a', 'n', 'd', 'l', 'e', 'A', 'u', 't', 'h', 'Escape'],
    hints: [
      'Type "ciw" to replace the word under cursor.',
      'Type "handleAuth" and press <Esc>.'
    ],
  },
  {
    day: 19,
    week: 3,
    title: 'Mini.ai Text Objects',
    concept: 'dia / daa (Argument Text Objects)',
    chapterRef: '06-plugin-mastery-and-ecosystem/06-micro-productivity-and-editing-plugins.md',
    mission: 'Delete the second parameter "b: number" with "dia" (delete inside argument).',
    initialText: 'function sum(a: number, b: number, c: number) {}',
    cursorStart: { row: 0, col: 25 },
    targetText: 'function sum(a: number, , c: number) {}',
    parKeystrokes: 3,
    optimalKeys: ['d', 'i', 'a'],
    hints: [
      'With cursor on "b: number", type "dia" to delete inside argument.'
    ],
  },
  {
    day: 20,
    week: 3,
    title: 'Enclosure & Surround Operations',
    concept: 'Transforming quotes and delimiters',
    chapterRef: '06-plugin-mastery-and-ecosystem/06-micro-productivity-and-editing-plugins.md',
    mission: 'Change inside single quotes with "ci\'" and enter "production".',
    initialText: 'const env = \'development\';',
    cursorStart: { row: 0, col: 15 },
    targetText: 'const env = \'production\';',
    parKeystrokes: 14,
    optimalKeys: ['c', 'i', '\'', 'p', 'r', 'o', 'd', 'u', 'c', 't', 'i', 'o', 'n', 'Escape'],
    hints: [
      'Type "ci\'" to change inside single quotes.',
      'Type "production" and press <Esc>.'
    ],
  },
  {
    day: 21,
    week: 3,
    title: 'Search Across Project (Grep & Grug-Far)',
    concept: '<leader>/ and :%s',
    chapterRef: '06-plugin-mastery-and-ecosystem/04-grug-far-project-search-and-replace.md',
    mission: 'Perform global substitution on all "http:" to "https:" using ":%s/http:/https:/g".',
    initialText: 'const api = "http://api.com";\nconst cdn = "http://cdn.com";',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const api = "https://api.com";\nconst cdn = "https://cdn.com";',
    parKeystrokes: 22,
    optimalKeys: [':', '%', 's', '/', 'h', 't', 't', 'p', ':', '/', 'h', 't', 't', 'p', 's', ':', '/', 'g', 'Enter'],
    hints: [
      'Type ":%s/http:/https:/g" <Enter>.'
    ],
  },

  // ==========================================
  // WEEK 4: Language-Specific Playbooks
  // ==========================================
  {
    day: 22,
    week: 4,
    title: 'TypeScript / React Playbook',
    concept: 'Refactoring Types & Interfaces',
    chapterRef: '04-language-specific-playbooks/01-typescript-javascript-web.md',
    mission: 'Change the role string "viewer" to "admin" using "ci"".',
    initialText: 'export const currentUser: UserProfile = {\n  role: "viewer",\n};',
    cursorStart: { row: 1, col: 11 },
    targetText: 'export const currentUser: UserProfile = {\n  role: "admin",\n};',
    parKeystrokes: 9,
    optimalKeys: ['c', 'i', '"', 'a', 'd', 'm', 'i', 'n', 'Escape'],
    hints: [
      'Cursor is inside "viewer".',
      'Type "ci\"" -> "admin" -> <Esc>.'
    ],
  },
  {
    day: 23,
    week: 4,
    title: 'Python Development Playbook',
    concept: 'Indentation & Docstrings',
    chapterRef: '04-language-specific-playbooks/02-python-environment-workflow.md',
    mission: 'Indent the function body right using "V" and ">".',
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
    day: 24,
    week: 4,
    title: 'Go Development Powerhouse',
    concept: 'Struct Tags & Error Handling',
    chapterRef: '04-language-specific-playbooks/03-go-development-powerhouse.md',
    mission: 'Change the struct tag inside backticks with "ci`" to `json:"user_id"`.',
    initialText: 'type User struct {\n  ID string `json:"old_id"`\n}',
    cursorStart: { row: 1, col: 15 },
    targetText: 'type User struct {\n  ID string `json:"user_id"`\n}',
    parKeystrokes: 18,
    optimalKeys: ['c', 'i', '`', 'j', 's', 'o', 'n', ':', '"', 'u', 's', 'e', 'r', '_', 'i', 'd', '"', 'Escape'],
    hints: [
      'Type "ci`" to wipe inside backticks.',
      'Type json:"user_id" and exit with <Esc>.'
    ],
  },
  {
    day: 25,
    week: 4,
    title: 'Rust Craftsmanship Playbook',
    concept: 'Match Arms & Option Types',
    chapterRef: '04-language-specific-playbooks/04-rust-craftsmanship.md',
    mission: 'Change the unwrap message inside quotes with "ci"" -> "failed to parse".',
    initialText: 'let val = config.get().expect("PANIC_HERE");',
    cursorStart: { row: 0, col: 33 },
    targetText: 'let val = config.get().expect("failed to parse");',
    parKeystrokes: 19,
    optimalKeys: ['c', 'i', '"', 'f', 'a', 'i', 'l', 'e', 'd', ' ', 't', 'o', ' ', 'p', 'a', 'r', 's', 'e', 'Escape'],
    hints: [
      'Type "ci\"" -> "failed to parse" -> <Esc>.'
    ],
  },
  {
    day: 26,
    week: 4,
    title: 'Flutter & Dart Mobile Powerhouse',
    concept: 'Nested Widget Trees',
    chapterRef: '04-language-specific-playbooks/05-flutter-and-dart-mobile.md',
    mission: 'Change widget child inside parens with "ci(" -> "Text(\'Hello Eddie\')".',
    initialText: 'Center(\n  child: Container(),\n)',
    cursorStart: { row: 1, col: 19 },
    targetText: 'Center(\n  child: Container(Text(\'Hello Eddie\')),\n)',
    parKeystrokes: 21,
    optimalKeys: ['i', 'T', 'e', 'x', 't', '(', '\'', 'H', 'e', 'l', 'l', 'o', ' ', 'E', 'd', 'd', 'i', 'e', '\'', ')', 'Escape'],
    hints: [
      'Cursor starts between the parens of Container().',
      'Press "i" to enter Insert mode.',
      'Type Text(\'Hello Eddie\') and exit with <Esc>.'
    ],
  },
  {
    day: 27,
    week: 4,
    title: 'Markdown & Documentation Speedrun',
    concept: 'Rapid list & table manipulation',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Change unchecked task "[ ]" to checked "[x]" using "f " then "rx".',
    initialText: '- [ ] Complete 30-Day Neovim Mastery',
    cursorStart: { row: 0, col: 0 },
    targetText: '- [x] Complete 30-Day Neovim Mastery',
    parKeystrokes: 4,
    optimalKeys: ['t', ']', 'r', 'x'],
    hints: [
      'Press "t]" to seek till right before the closing bracket (the space).',
      'Type "rx" to replace the space with "x".'
    ],
  },
  {
    day: 28,
    week: 4,
    title: 'Git Workflow & Merge Resolution',
    concept: 'Gitsigns & Hunk Edits',
    chapterRef: '02-navigation-and-project-management/05-git-workflow-and-lazygit.md',
    mission: 'Clean up git conflict: delete the conflict markers on line 1 and line 3 with "dd".',
    initialText: '<<<<<<< HEAD\nconst activeBranch = "feature";\n>>>>>>> main',
    cursorStart: { row: 0, col: 0 },
    targetText: 'const activeBranch = "feature";',
    parKeystrokes: 5,
    optimalKeys: ['d', 'd', 'j', 'd', 'd'],
    hints: [
      'Delete line 1 with "dd".',
      'Move down with "j", then delete line 2 with "dd".'
    ],
  },

  // ==========================================
  // CAPSTONES: Grandmaster Trials
  // ==========================================
  {
    day: 29,
    week: 'Capstone',
    title: 'Vim Golf Par Challenge',
    concept: 'Maximum Efficiency Refactor',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Golf Challenge! Transform "bad1\\nbad2\\nbad3" into "good" in under 7 keystrokes using "V2jcgood<Esc>".',
    initialText: 'bad1\nbad2\nbad3',
    cursorStart: { row: 0, col: 0 },
    targetText: 'good',
    parKeystrokes: 9,
    optimalKeys: ['V', '2', 'j', 'c', 'g', 'o', 'o', 'd', 'Escape'],
    hints: [
      'Press "V" for Visual Line.',
      'Press "2j" to select all 3 lines.',
      'Press "c" to change them into "good" and press <Esc>.'
    ],
  },
  {
    day: 30,
    week: 'Capstone',
    title: 'Neovim Grandmaster Boss Gauntlet',
    concept: 'Full Fluency & Muscle Memory',
    chapterRef: '05-advanced-and-customization/04-30-day-practice-drills.md',
    mission: 'Final Trial: Wipe "BROKEN_PAYLOAD" with "ci"", insert "READY_FOR_DEPLOYMENT", and save with ":w".',
    initialText: 'export const status = "BROKEN_PAYLOAD";',
    cursorStart: { row: 0, col: 25 },
    targetText: 'export const status = "READY_FOR_DEPLOYMENT";',
    requiredAction: 'save',
    parKeystrokes: 27,
    optimalKeys: ['c', 'i', '"', 'R', 'E', 'A', 'D', 'Y', '_', 'F', 'O', 'R', '_', 'D', 'E', 'P', 'L', 'O', 'Y', 'M', 'E', 'N', 'T', 'Escape', ':', 'w', 'Enter'],
    hints: [
      'Type "ci\"" to change inside quotes.',
      'Type "READY_FOR_DEPLOYMENT" and press <Esc>.',
      'Type ":w" <Enter> to save and achieve Graduation!'
    ],
  },
];
