# I Wanted to Learn Vim So Bad, So I Built a Game for It

*How rage-quitting `:wq!` and mouse fatigue inspired a 2D retro RPG and an interactive 30-Day Neovim Dojo.*

---

Every developer hits the same wall with Vim. 

You watch a senior engineer edit code without touching their trackpad once. They fly across buffers with `ci"`, `d3w`, and `:%s`. It looks like magic. 

So you decide: *Today is the day.* 

You open `vimtutor`. You print a cheatsheet. You install the VS Code Vim extension. 

Forty-eight hours later, you’re trapped in a git commit message, your wrists hurt, you’ve accidentally deleted three lines of production code, and you crawl back to your mouse in defeat.

I did this cycle for three years. Then I realized why:

> **Vim is not a knowledge problem. It’s a muscle-memory problem.**

When you're fixing a bug under pressure, your brain can't pause to remember *"what was the key for jumping forward to a character?"* Cheatsheets fail because your eyes leave the screen. `vimtutor` fails because it has zero dopamine.

So I decided to fix it the fun way: **I turned Vim into a playable retro game.**

---

### The Big Epiphany: Text as a 2D Map

In normal text editors, you drop a cursor and type. 

In Vim, text is **terrain**:
- `h, j, k, l` are your cardinal legs.
- `w, b, e` are stepping stones across empty space.
- `0, $` are cliff edges.
- `f, t` are grappling hooks.
- `gg, G` are elevators between the spire and the dungeon.
- `%` is a bracket wormhole.

Once you see text as a map, the game designs itself.

---

### What I Built: Two Games in One

Instead of a flimsy flashcard app, I built an end-to-end training suite in **zero-dependency vanilla JavaScript**:

#### 1. The 2D Retro Adventure RPG (`adventure/`)
A 16-bit HTML5 Canvas RPG with 8-bit procedural chip music. 

You wake up on a beach with amnesia. You only know `h, j, k, l`. Every other Vim key is locked inside ancient chests behind chasms, gates, and riddles:
- **Chapter 2 (Word Archipelago):** You can't swim. You must leap between islands using `w`, `b`, and `e`.
- **Chapter 4 (River Stepping Stones):** Fast currents. Use inline seeks (`fa`, `t#`) to cross treacherous rivers.
- **Chapter 5 (Tower of Vertical Ascents):** A 20-story fortress. Unlock `gg` to soar to the battlement in one frame, and `G` to plunge back down.
- **Chapter 7 (Crypt of Brackets):** Step onto `{` and press `%` to teleport across bottomless chasms.

#### 2. The 30-Day Neovim Dojo (`game/`)
Once your spatial intuition clicks, you step into the Dojo—a real in-browser terminal buffer:
- 30 daily 10-minute micro-lessons.
- Real operator-pending grammar: verbs (`d`, `c`, `y`) + text objects (`iw`, `i"`, `a(`).
- Par scoring & instant visual diffs against your target goal.

---

### The "Zero Bloat" Rule

No React. No npm packages. No 40MB node_modules.

The entire project runs on:
- **HTML5 Canvas** (60 FPS rendering)
- **Web Audio API** (procedurally synthesized square-wave sound effects)
- **Single-file bundles** that run offline from `file://` in 12ms.

If Vim starts in 10ms, your Vim tutor shouldn't take 5 seconds to load.

---

### What Happened to My Real Coding?

Three weeks in, the muscle memory locked in:
1. **The mouse stayed cold.** My hands never leave the home row.
2. **I think in sentences, not keystrokes.** I don't tap backspace 15 times; I type `ci"` (*change inside quotes*) or `da(` (*delete around parentheses*).
3. **The fear is gone.** Modal editing went from an intimidating hurdle to an instinctive reflex.

---

### Play It Yourself (Free & Open Source)

If cheatsheets never worked for you either, try gamifying it:

👉 **Clone the repo and double-click `index.html`:**  
[github.com/eddiechan/neovim-mastery](https://github.com/eddiechan/neovim-mastery)

Spend 10 minutes a day. Stop fighting modal editing—and turn it into an adventure.

---

*What’s your favorite Vim motion that blew your mind when you first learned it? Drop it in the comments below!*
