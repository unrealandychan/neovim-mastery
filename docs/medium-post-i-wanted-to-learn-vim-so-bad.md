# I Wanted to Learn Vim So Bad, So I Built a Game for It

*How obsessing over modal editing, rage-quitting `:wq!`, and missing home-row flow led to building a full 2D retro RPG and an interactive 30-Day Neovim Dojo in pure JavaScript.*

---

Every software engineer goes through the five stages of Vim grief:

1. **Denial:** *"VS Code is fine. VS Code with 47 extensions is great. I love touching my mouse every four seconds."*
2. **Anger:** *"Why is it typing `:` at the end of every line?! How do I exit this nightmare? Why did pressing `u` undo half my life choices?!"*
3. **Bargaining:** *"Maybe I’ll just install the Vim extension for VS Code and use the arrow keys when nobody’s watching."*
4. **Depression:** *"I've watched six 40-minute YouTube videos on Lua configs, treesitter, and LSP, and I still can't change inside quotes without accidentally deleting my home directory."*
5. **Acceptance:** *"I want to learn Vim. I want to learn it so bad it hurts. But cheatsheets are useless, and `vimtutor` feels like reading a tax form from 1988."*

A few months ago, I hit stage 5 with maximum velocity. 

I saw senior engineers flying through codebases at the speed of thought. No trackpads. No mouse clicks. Just hypnotic bursts of keystrokes—`ci"`, `f,`, `yap`, `:%s/foo/bar/g`—manipulating text like Neo altering the matrix.

I wanted that power. But every time I tried to adopt Vim or Neovim cold-turkey on actual work projects, my productivity fell off a cliff. My typing speed dropped from 90 WPM to 4 WPM. Deadlines loomed, panic set in, and I scurried back to the warm, bloated safety of GUI editors.

That’s when the realization struck:

> **Vim is not a knowledge problem. It is a muscle-memory problem.**

When you're writing code under pressure, your prefrontal cortex is occupied with business logic, edge cases, and API contracts. It has zero capacity left to mentally look up *"what was the key to jump to line 42 again?"*

Cheatsheets fail because your eyes have to leave the screen. `vimtutor` fails because it doesn't give you dopamine. 

So I decided to do what any reasonable, sleep-deprived programmer would do: **I built a full-blown retro RPG and a 30-Day interactive Dojo to force my nervous system into mastering Vim.**

---

## The Philosophy: Text Editing as Spatial Traversal

Think about what Vim really is. 

In traditional editors, you are in a continuous **Insert Mode**. You think of text as an endless stream of characters where you point-and-click to drop an anchor.

Vim flips the paradigm. In Vim, text is a **topological grid**. Lines are coordinates. Words are islands. Parentheses are portals. Quotes are bounded rooms.

Once you realize that, the metaphor for a video game becomes blindingly obvious:

```
+-------------------------------------------------------------+
|   VIM CONCEPT                  |   VIDEO GAME EQUIVALENT    |
+--------------------------------+----------------------------+
|   h, j, k, l                   |   Cardinal movement        |
|   w, b, e, ge                  |   Island hopping / voids   |
|   0, $, ^                      |   Cliff ledges / bounds    |
|   f, t, F, T                   |   River stepping-stones    |
|   gg, G, 8G                    |   Spire ascents & plunges  |
|   {, }                         |   Glade & paragraph bounds |
|   %                            |   Bracket wormhole portals |
|   x, r, ~, D                   |   Physical interactions    |
+--------------------------------+----------------------------+
```

If you treat text as terrain, then learning Vim is no longer dry rote memorization—**it's an adventure**.

---

## The Creation: Two Worlds, One Goal

I didn't want a toy that only taught three keys and stopped. I wanted a comprehensive training machine that takes someone from *"how do I exit"* all the way to *"I configure headless Neovim in my sleep."*

So I designed the game with a dual-engine architecture:

### 1. The 2D Retro Adventure (`adventure/`)
A vibrant 16-bit RPG rendered on HTML5 Canvas in the gorgeous **Tokyo Night** palette, accompanied by procedural 8-bit chip tunes crafted with the Web Audio API.

You start on a desolate beach with amnesia. Your cardinal keys (`h`, `j`, `k`, `l`) are your legs. Every other Vim key is locked away in ancient runic chests guarded behind locked gates, chasms, and riddles.

Across 15 handcrafted chapters, you explore:
- **Chapter 2: The Word Archipelago (`w`, `b`, `e`, `ge`):** You can't walk on water. The only way across the ocean is to leap across word-islands. Tap `w` to hit the head of the next word, or `e` to stick the landing on the trailing edge.
- **Chapter 3: The Canyon Ledges (`0`, `$`, `^`):** Holding `l` to cross a 40-tile narrow bridge will bore you to tears. Tap `$` to zip to the ledge end instantly.
- **Chapter 4: The River Stepping Stones (`f`, `t`, `F`, `T`, `;`, `,`):** Rivers with hazardous currents. Use inline seeker motions (`fa` to jump to stone `'a'`, `t#` to halt right before a spike).
- **Chapter 5: The Tower of Vertical Ascents (`gg`, `G`, `8G`):** Climbing a 20-story fortress row by row is torture. Unlock `gg` to blast straight to the Spire Battlement in a single frame, and `G` to plunge back to the dungeon vault.
- **Chapter 7: The Crypt of Matching Brackets (`%`):** Stand on an opening curly brace `{` and press `%` to teleport across bottomless chasms to its closing mate.
- **Chapter 9–14: Verbs & Mutations (`x`, `r`, `~`, `*`, `D`):** Cut down thorny brambles with `x`, repair bridge tiles with `r=`, flip magical runic switches with `~`, and obliterate laser barriers with `D`.

### 2. The 30-Day Neovim Dojo (`game/`)
Once your spatial intuition is locked in, you step out of the dungeon and into the terminal.

The Dojo is a pixel-perfect in-browser Neovim buffer simulation equipped with:
- A full modal state machine (**NORMAL**, **INSERT**, **VISUAL**, **VISUAL BLOCK**, and **COMMAND-LINE** modes).
- A 30-day structured curriculum calibrated for 10 minutes of daily deliberate practice.
- Authentic hybrid line numbers, relative numbering, statusline, and command buffer.
- Real operator-pending grammar: verbs (`d`, `c`, `y`) combined with text objects (`iw`, `i"`, `a(`, `it`).
- Modern Neovim superpowers like `flash.nvim` 2-character jump teleportation (`s`).
- A 3-star scoring engine that evaluates both completion accuracy and keystroke par count.

---

## Engineering the Fun: Solving the "Stage 5 Trap"

Game design is ruthlessly honest. If a mechanic feels clunky in code, players don't read the manual—they close the tab.

During early playtesting, **Chapter 5 (The Tower of Vertical Ascents)** exposed a fascinating design challenge.

In Vim, `gg` jumps to the first line of the buffer, and `G` jumps to the last. But in a 2D RPG grid, jumping vertically isn't just setting `cursor.row = 0`. What if row 0 is solid stone wall? What if the player is standing at X=15, and the top battlement only has a walkable path at X=24?

In early builds, pressing `gg` would either freeze the player inside a brick wall or silently fail. Even worse: once players unlocked the Spire Gate, they were left wandering the upper terrace asking, *"Where do I go now?!"*

Here is how I re-engineered Stage 5 to make it feel buttery smooth:

### 1. Smart Row Scanning & Snapping
Instead of naive coordinate teleportation, I implemented an intelligent vertical search algorithm:

```javascript
// Scan for walkable terrain along the target vertical destination
getTopWalkableRow(preferredCol) {
  for (let r = 0; r < this.height; r++) {
    if (this.hasWalkableTile(r)) return r;
  }
  return 0;
}

findNearestWalkableRow(targetRow, preferredCol) {
  if (this.isWalkable(preferredCol, targetRow)) {
    return { x: preferredCol, y: targetRow };
  }
  // Find the closest walkable tile on that line or neighboring lines
  // so the player never lands in void or stone!
  ...
}
```

Now, pressing `gg` whisks you to row 2 (the Spire Battlement), while `G` plunges you straight down to row 17 (the Dungeon Vault). If you type `8G`, you nail the landing on Balcony 3 to snatch hidden gems.

### 2. Glowing Exit Portals
To ensure the transition between stages felt cinematic, I replaced static exit tiles with an animated beacon renderer:

```javascript
// Pulsing concentric energy rings + hovering level badge
renderExit(ctx, exit) {
  const pulse = Math.sin(Date.now() / 250) * 0.2 + 0.8;
  ctx.strokeStyle = `rgba(122, 162, 247, ${0.5 * pulse})`;
  ctx.lineWidth = 3;
  ctx.strokeRect(screenX, screenY, tileSize, tileSize);
  
  // Glowing staircase beacon
  ctx.fillText('🪜', screenX + 16, screenY + 18);
  ctx.fillText(`CH ${exit.targetLevel} ➜`, screenX + 16, screenY - 6);
}
```

### 3. The "Never Stuck" Hint Engine (`H`)
We’ve all experienced that horrifying moment in an adventure game where you have no idea what pixel you forgot to click.

I built a real-time dynamic hint solver into the HUD. Pressing uppercase **`H`** (or tapping the glowing 💡 **Hints** button) inspects the world state:
- If there's an unopened chest: *"Open chest at (15, 17) to unlock [gg] and [G]!"*
- If you have the key: *"You hold the Gold Key! Press `gg` to soar to the battlement, then unlock the Spire Gate at (24, 2)!"*
- If the gate is open: *"Path is clear! Step into the glowing portal at (28, 2) to advance to Chapter 6!"*

No guesswork. No frustration. Just pure, addictive flow.

---

## Why Pure Vanilla JS? (No Frameworks, No Build Bloat)

In 2026, the default reflex for any web project is `npm install react nextjs tailwind lucide-react threejs redux`.

I chose the exact opposite path: **zero dependencies**.

- **HTML5 Canvas:** 60fps tile rendering, floating damage text, particle emitters, and dynamic camera scrolling.
- **Web Audio API:** Real-time synthesized chiptune square waves, noise bursts for footsteps, and harmonic chords for unlocking gates—all generated mathematically on the fly in ~150 lines of audio code.
- **Pure JavaScript ES6 Modules:** Bundled via a clean Node script into a single self-contained file.
- **Works Offline:** Double-click `index.html` from Finder or File Explorer on `file://`, and it boots instantly in 12 milliseconds.

When you're building a tool to master a lightweight, 50-year-old text editor that starts in 10ms, your training app shouldn't take 4 seconds to hydrate a virtual DOM.

---

## What Happened to My Real Coding?

The true test of any gamified learning experiment is simple: **Did it actually work when I went back to writing code?**

Three weeks after finishing the game, here is what changed:

### 1. The Home Row Epiphany
I no longer touch my mouse while editing code. I haven't looked at the arrow keys in months. My right hand stays glued to `j` and `k`. The physical relief on my wrists alone was worth the entire effort.

### 2. Thinking in Verbs, Counts, and Nouns
Instead of hammering backspace 24 times:
- `ci"` (Change inside quotes)
- `da(` (Delete around parentheses)
- `d3w` (Delete next three words)
- `yyp` (Duplicate line)
- `vap` (Select entire paragraph)

Your thoughts no longer bottleneck on your fingers. You don't think *"delete letter, delete letter, delete letter"*; you think *"replace parameter"*, and the buffer reflects it before you finish the thought.

### 3. The Fear is Gone
The mystique around Neovim evaporated. Modal editing isn't arcane wizardry reserved for kernel developers who wear fingerless gloves; it’s just a language. And like any language, once you speak it fluently, you can never imagine going back.

---

## Play It Yourself (It’s Open Source!)

If you’ve been putting off learning Vim because `vimtutor` bored you to tears, or if you keep relapsing to your mouse:

1. **Fire up the 2D Adventure:** Walk the paths, jump the word islands, unlock your keys, and let the muscle memory seep into your fingers.
2. **Hit the 30-Day Dojo:** Spend 5 to 10 minutes a day completing one daily exercise before opening your morning standup.
3. **Graduate to Neovim:** Take your new reflexes and watch your editor disappear between your thoughts and the screen.

Stop fighting the editor. Turn it into a game.

---

*Found this helpful or built your own custom configs? Drop a star on the repo, share your fastest Chapter 5 speedrun time, and remember: whenever in doubt, press `<Esc>` and `:wq!`.*
