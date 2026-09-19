/**
 * Core Vim Adventures Game Controller
 * Manages game loop, levels, entities, physics, audio, and state machine.
 */

import { Tilemap } from './tilemap.js';
import { Player } from '../entities/player.js';
import { SoundFX } from './audio.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';
import { DialogueSystem } from '../ui/dialogue.js';
import { HUD } from '../ui/hud.js';
import {
  NPC,
  Chest,
  KeyItem,
  Door,
  Gem,
  BracketPortal,
  Obstacle,
  ParticleSystem
} from '../entities/world-objects.js';
import { LEVELS } from '../levels/level-data.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.audio = new SoundFX();
    this.renderer = new Renderer(this.canvas);
    this.hud = new HUD();
    this.dialogue = new DialogueSystem(this.audio);
    this.particles = new ParticleSystem();
    this.input = new InputHandler(this);

    this.currentLevelIndex = 0;
    this.currentLevel = null;
    this.tilemap = null;
    this.player = null;

    this.entities = {
      npcs: [],
      chests: [],
      keys: [],
      doors: [],
      gems: [],
      portals: [],
      obstacles: [],
    };

    this.historyStack = [];
    this.totalMoves = 0;
    this.startTime = Date.now();
    this.lastFrameTime = performance.now();

    this.setupUI();
    this.loadLevel(0);
    this.startLoop();
  }

  setupUI() {
    const levelSelect = document.getElementById('level-select');
    if (levelSelect) {
      levelSelect.innerHTML = '';
      LEVELS.forEach((lvl, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = lvl.name;
        levelSelect.appendChild(opt);
      });
      levelSelect.addEventListener('change', (e) => {
        this.loadLevel(parseInt(e.target.value, 10));
      });
    }

    const btnRestart = document.getElementById('btn-restart');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => this.restartLevel());
    }

    const btnHelp = document.getElementById('btn-help');
    if (btnHelp) {
      btnHelp.addEventListener('click', () => this.hud.openHelp());
    }

    const btnCloseHelp = document.getElementById('btn-close-help');
    if (btnCloseHelp) {
      btnCloseHelp.addEventListener('click', () => this.hud.closeHelp());
    }

    const btnCloseVictory = document.getElementById('btn-close-victory');
    if (btnCloseVictory) {
      btnCloseVictory.addEventListener('click', () => {
        this.hud.closeVictory();
        this.loadLevel(0);
      });
    }

    const btnAudio = document.getElementById('btn-audio');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        const muted = this.audio.toggleMute();
        btnAudio.textContent = muted ? '🔇 Sound' : '🔊 Sound';
      });
    }

    // Touch / Click D-Pad bindings
    document.querySelectorAll('[data-key]').forEach(el => {
      el.addEventListener('click', () => {
        const key = el.getAttribute('data-key');
        if (key) {
          this.input.processVimKey(key);
        }
      });
    });
  }

  loadLevel(index) {
    if (index < 0 || index >= LEVELS.length) return;
    this.currentLevelIndex = index;
    const data = LEVELS[index];
    this.currentLevel = data;

    // Build Tilemap
    this.tilemap = new Tilemap(data.width, data.height, data.map);

    // Build Player
    this.player = new Player(data.playerStart.x, data.playerStart.y);
    if (data.initialAbilities) {
      data.initialAbilities.forEach(ab => this.player.unlockAbility(ab));
    }

    // Build World Entities
    this.entities.npcs = (data.npcs || []).map(d => new NPC(d));
    this.entities.chests = (data.chests || []).map(d => new Chest(d));
    this.entities.keys = (data.keys || []).map(d => new KeyItem(d));
    this.entities.doors = (data.doors || []).map(d => new Door(d));
    this.entities.gems = (data.gems || []).map(d => new Gem(d));
    this.entities.portals = (data.portals || []).map(d => new BracketPortal(d));
    this.entities.obstacles = (data.obstacles || []).map(d => new Obstacle(d));

    this.historyStack = [];

    // Sync HUD
    this.hud.setLevelInfo(data.name, data.objective);
    this.hud.updateInventory(this.player.inventory);
    this.hud.updateAbilities(this.player.unlockedAbilities);

    const levelSelect = document.getElementById('level-select');
    if (levelSelect) {
      levelSelect.value = index;
    }

    // Play warp sound on level start
    this.audio.playWarp();
    this.renderer.addFloatingText(`Entered ${data.name}!`, this.player.x, this.player.y, '#7aa2f7');

    // Auto-trigger first NPC if adjacent
    this.checkNPCAutoTrigger();
  }

  restartLevel() {
    this.loadLevel(this.currentLevelIndex);
  }

  checkNPCAutoTrigger() {
    for (const npc of this.entities.npcs) {
      const dist = Math.abs(npc.x - this.player.x) + Math.abs(npc.y - this.player.y);
      if (dist <= 1 && !npc.hasTalked) {
        setTimeout(() => {
          this.triggerNPC(npc);
        }, 300);
        break;
      }
    }
  }

  triggerNPC(npc) {
    npc.hasTalked = true;
    const lines = npc.getDialogue({ inventory: this.player.inventory });
    this.dialogue.start(npc.name, npc.avatar, lines);
  }

  recordHistory() {
    this.historyStack.push({
      player: { x: this.player.x, y: this.player.y, direction: this.player.direction },
      inventory: { ...this.player.inventory },
      abilities: new Set(this.player.unlockedAbilities),
      tilemap: this.tilemap.grid.map(row => [...row]),
      obstacles: this.entities.obstacles.map(o => ({ id: o.id, isCleared: o.isCleared }))
    });
    if (this.historyStack.length > 50) {
      this.historyStack.shift();
    }
  }

  undo() {
    if (this.historyStack.length === 0) {
      this.audio.playError();
      this.renderer.addFloatingText('Already at oldest change', this.player.x, this.player.y);
      return;
    }

    const state = this.historyStack.pop();
    this.player.setPosition(state.player.x, state.player.y);
    this.player.direction = state.player.direction;
    this.player.inventory = { ...state.inventory };
    this.player.unlockedAbilities = new Set(state.abilities);

    if (state.tilemap) {
      this.tilemap.grid = state.tilemap.map(row => [...row]);
    }
    if (state.obstacles) {
      state.obstacles.forEach(saved => {
        const obs = this.entities.obstacles.find(o => o.id === saved.id);
        if (obs) obs.isCleared = saved.isCleared;
      });
    }

    this.hud.updateInventory(this.player.inventory);
    this.hud.updateAbilities(this.player.unlockedAbilities);
    this.audio.playBump();
    this.renderer.addFloatingText('Undo (u)', this.player.x, this.player.y, '#e0af68');
  }

  handleMotion(motionKey, count = 1) {
    // Check if hero has ability unlocked
    if (!this.player.hasAbility(motionKey)) {
      this.audio.playError();
      this.renderer.screenShake(4);
      this.renderer.addFloatingText(`Key '${motionKey}' is locked!`, this.player.x, this.player.y, '#f7768e');
      return;
    }

    this.recordHistory();

    for (let c = 0; c < count; c++) {
      let destX = this.player.x;
      let destY = this.player.y;
      let motionSound = 'step';

      switch (motionKey) {
        case 'h':
          destX -= 1;
          break;
        case 'l':
          destX += 1;
          break;
        case 'k':
          destY -= 1;
          break;
        case 'j':
          destY += 1;
          break;
        case 'w': {
          const pt = this.tilemap.findNextWord(this.player.x, this.player.y);
          destX = pt.x;
          destY = pt.y;
          motionSound = 'jump';
          break;
        }
        case 'b': {
          const pt = this.tilemap.findPrevWord(this.player.x, this.player.y);
          destX = pt.x;
          destY = pt.y;
          motionSound = 'jump';
          break;
        }
        case 'e': {
          const pt = this.tilemap.findWordEnd(this.player.x, this.player.y);
          destX = pt.x;
          destY = pt.y;
          motionSound = 'jump';
          break;
        }
        case 'ge': {
          const pt = this.tilemap.findPrevWordEnd(this.player.x, this.player.y);
          destX = pt.x;
          destY = pt.y;
          motionSound = 'jump';
          break;
        }
        case '0':
          destX = this.tilemap.getLineStart(this.player.y, false);
          motionSound = 'jump';
          break;
        case '^':
          destX = this.tilemap.getLineStart(this.player.y, true);
          motionSound = 'jump';
          break;
        case '$':
          destX = this.tilemap.getLineEnd(this.player.y);
          motionSound = 'jump';
          break;
        case '%':
          this.handleBracketJump();
          return;
        case 'x':
          this.handleCutObstacle();
          return;
        default:
          return;
      }

      // Check collision
      if (!this.canMoveTo(destX, destY)) {
        this.audio.playBump();
        this.renderer.screenShake(4);
        this.renderer.addFloatingText('Bump!', destX, destY, '#f7768e');
        break;
      } else {
        this.player.moveTo(destX, destY);
        this.totalMoves++;

        if (motionSound === 'jump') {
          this.audio.playJump();
          this.particles.emit(this.player.x, this.player.y, 6, '#7dcfff', 40, 2);
        } else {
          this.audio.playStep();
        }

        this.checkInteractions();
      }
    }
  }

  handleFind(type, targetChar, count = 1) {
    if (!this.player.hasAbility('f')) {
      this.audio.playError();
      this.renderer.addFloatingText("Key 'f' is locked!", this.player.x, this.player.y, '#f7768e');
      return;
    }

    this.recordHistory();
    const forward = type === 'f' || type === 't';
    const till = type === 't' || type === 'T';

    let currX = this.player.x;
    let found = false;

    for (let c = 0; c < count; c++) {
      const res = this.tilemap.findCharInRow(this.player.y, currX, targetChar, forward, till);
      if (res.found && this.canMoveTo(res.x, res.y)) {
        currX = res.x;
        found = true;
      } else {
        break;
      }
    }

    if (found) {
      this.player.moveTo(currX, this.player.y);
      this.totalMoves++;
      this.audio.playJump();
      this.particles.emit(this.player.x, this.player.y, 8, '#ff9e64', 50, 3);
      this.renderer.addFloatingText(`Jumped to '${targetChar}'`, this.player.x, this.player.y);
      this.checkInteractions();
    } else {
      this.audio.playError();
      this.renderer.screenShake(3);
      this.renderer.addFloatingText(`'${targetChar}' not found`, this.player.x, this.player.y, '#f7768e');
    }
  }

  handleBracketJump() {
    // Check if player is on a portal bracket
    const portal = this.entities.portals.find(p => p.x === this.player.x && p.y === this.player.y);
    if (portal) {
      this.player.setPosition(portal.targetX, portal.targetY);
      this.audio.playWarp();
      this.particles.emit(this.player.x, this.player.y, 16, '#bb9af7', 80, 4);
      this.renderer.addFloatingText(`Warped to '${portal.char}' pair!`, this.player.x, this.player.y, '#bb9af7');
      this.checkInteractions();
      return;
    }

    // Check if standing on a bracket character on the tilemap
    const char = this.tilemap.getTile(this.player.x, this.player.y);
    const pairs = { '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{' };
    const matchingChar = pairs[char];

    if (!matchingChar) {
      this.audio.playError();
      this.renderer.addFloatingText("Stand on a bracket: ( ) [ ] { }", this.player.x, this.player.y, '#f7768e');
      return;
    }

    // Search on current line for matching bracket
    const forward = ['(', '[', '{'].includes(char);
    const res = this.tilemap.findCharInRow(this.player.y, this.player.x, matchingChar, forward, false);

    if (res.found && this.canMoveTo(res.x, res.y)) {
      this.player.moveTo(res.x, res.y);
      this.audio.playWarp();
      this.particles.emit(this.player.x, this.player.y, 16, '#bb9af7', 80, 4);
      this.renderer.addFloatingText(`Matched ${char} ➔ ${matchingChar}`, this.player.x, this.player.y, '#bb9af7');
      this.checkInteractions();
    } else {
      this.audio.playError();
      this.renderer.addFloatingText("No matching bracket in line", this.player.x, this.player.y, '#f7768e');
    }
  }

  handleCutObstacle() {
    if (!this.player.hasAbility('x')) {
      this.audio.playError();
      this.renderer.addFloatingText("Key 'x' is locked!", this.player.x, this.player.y, '#f7768e');
      return;
    }

    // Check if standing on or facing obstacle
    const obstacle = this.entities.obstacles.find(o => !o.isCleared && (
      (o.x === this.player.x && o.y === this.player.y) ||
      (this.player.direction === 'right' && o.x === this.player.x + 1 && o.y === this.player.y) ||
      (this.player.direction === 'left' && o.x === this.player.x - 1 && o.y === this.player.y) ||
      (this.player.direction === 'down' && o.x === this.player.x && o.y === this.player.y + 1) ||
      (this.player.direction === 'up' && o.x === this.player.x && o.y === this.player.y - 1)
    ));

    if (obstacle) {
      this.recordHistory();
      obstacle.clear();
      this.tilemap.setTile(obstacle.x, obstacle.y, '='); // turn into path
      this.audio.playSlash();
      this.particles.emit(obstacle.x, obstacle.y, 14, '#9ece6a', 70, 3);
      this.renderer.addFloatingText('Cut with x!', obstacle.x, obstacle.y, '#9ece6a');
      this.checkInteractions();
    } else {
      this.audio.playError();
      this.renderer.addFloatingText('Nothing to cut with x here', this.player.x, this.player.y, '#f7768e');
    }
  }

  handleReplace(char) {
    if (!this.player.hasAbility('r')) {
      this.audio.playError();
      this.renderer.addFloatingText("Key 'r' is locked!", this.player.x, this.player.y, '#f7768e');
      return;
    }

    let targetX = this.player.x;
    let targetY = this.player.y;

    // Check if player is facing a gap or water in front, or standing on a replaceable tile
    const currentTile = this.tilemap.getTile(targetX, targetY);
    if (currentTile === '=' || currentTile === char) {
      let frontX = targetX;
      let frontY = targetY;
      if (this.player.direction === 'right') frontX++;
      else if (this.player.direction === 'left') frontX--;
      else if (this.player.direction === 'down') frontY++;
      else if (this.player.direction === 'up') frontY--;

      if (this.tilemap.inBounds(frontX, frontY) && this.tilemap.getTile(frontX, frontY) !== '#') {
        targetX = frontX;
        targetY = frontY;
      }
    }

    if (this.tilemap.getTile(targetX, targetY) === '#') {
      this.audio.playError();
      this.renderer.addFloatingText("Stone walls cannot be replaced", targetX, targetY, '#f7768e');
      return;
    }

    this.recordHistory();
    this.tilemap.setTile(targetX, targetY, char);
    this.audio.playRepair();
    this.particles.emit(targetX, targetY, 15, '#7dcfff', 60, 3);
    this.renderer.addFloatingText(`Replaced with '${char}'!`, targetX, targetY, '#7dcfff');
  }

  canMoveTo(x, y) {
    // 1. Check closed doors first
    const door = this.entities.doors.find(d => d.x === x && d.y === y && !d.isOpen);
    if (door) {
      if (door.canUnlock(this.player.inventory)) {
        door.unlock(this.player.inventory);
        this.tilemap.setTile(x, y, '=');
        this.audio.playDoorOpen();
        this.particles.emit(x, y, 16, '#ffc777', 60, 4);
        this.renderer.addFloatingText(`${door.label} Unlocked!`, x, y, '#ffc777');
        this.hud.updateInventory(this.player.inventory);
        return true;
      } else {
        this.audio.playError();
        this.renderer.screenShake(3);
        this.renderer.addFloatingText(`Need ${door.keyRequired}!`, x, y, '#f7768e');
        return false;
      }
    }

    // 2. Check general tile walkability
    if (!this.tilemap.isWalkable(x, y)) {
      return false;
    }

    // 3. Check obstacles
    const obs = this.entities.obstacles.find(o => o.x === x && o.y === y && !o.isCleared);
    if (obs) {
      return false;
    }

    return true;
  }

  checkInteractions() {
    const px = this.player.x;
    const py = this.player.y;

    // 1. Keys Pickup
    for (const key of this.entities.keys) {
      if (!key.isCollected && key.x === px && key.y === py) {
        key.collect();
        this.player.inventory[key.keyType] = (this.player.inventory[key.keyType] || 0) + 1;
        this.audio.playKeyPickup();
        this.particles.emit(px, py, 15, '#ffc777', 60, 4);
        this.renderer.addFloatingText(`Found ${key.name}! 🗝️`, px, py, '#ffc777');
        this.hud.updateInventory(this.player.inventory);
      }
    }

    // 2. Gems Pickup
    for (const gem of this.entities.gems) {
      if (!gem.isCollected && gem.x === px && gem.y === py) {
        const val = gem.collect();
        this.player.inventory.gems += val;
        this.audio.playKeyPickup();
        this.particles.emit(px, py, 10, gem.color, 50, 3);
        this.renderer.addFloatingText(`+${val} Gems 💎`, px, py, gem.color);
        this.hud.updateInventory(this.player.inventory);
      }
    }

    // 3. Chests (Trigger if standing on or adjacent)
    for (const chest of this.entities.chests) {
      if (!chest.isOpen) {
        const dist = Math.abs(chest.x - px) + Math.abs(chest.y - py);
        if (dist === 0 || dist === 1) {
          const reward = chest.open();
          if (reward) {
            this.audio.playChestOpen();
            this.particles.emit(chest.x, chest.y, 25, '#ffc777', 90, 5);
            if (reward.type === 'ability') {
              this.player.unlockAbility(reward.value);
              this.hud.updateAbilities(this.player.unlockedAbilities, reward.value);
              this.renderer.addFloatingText(reward.label, chest.x, chest.y - 1, '#7dcfff');
              this.dialogue.start('Treasure Chest', '🎁', [
                reward.label,
                `You have mastered a new Vim motion! Check the ribbon below.`
              ]);
            } else if (reward.type === 'gem') {
              this.player.inventory.gems += reward.value;
              this.hud.updateInventory(this.player.inventory);
              this.renderer.addFloatingText(reward.label, chest.x, chest.y - 1, '#ffc777');
            }
          }
        }
      }
    }

    // 4. NPCs (Speak if adjacent or on same tile)
    for (const npc of this.entities.npcs) {
      const dist = Math.abs(npc.x - px) + Math.abs(npc.y - py);
      if (dist <= 1 && !npc.hasTalked) {
        this.triggerNPC(npc);
      }
    }

    // 5. Level Exit
    const exit = this.currentLevel.exit;
    if (exit && exit.x === px && exit.y === py) {
      if (exit.isVictory) {
        this.triggerVictory();
      } else if (exit.targetLevel) {
        this.loadLevel(exit.targetLevel - 1);
      }
    }
  }

  triggerVictory() {
    this.audio.playChestOpen();
    this.particles.emit(this.player.x, this.player.y, 40, '#ffd700', 120, 6);

    const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = (elapsedSeconds % 60).toString().padStart(2, '0');

    this.hud.openVictory({
      moves: this.totalMoves,
      gems: this.player.inventory.gems,
      time: `${mins}:${secs}`,
    });
  }

  startLoop() {
    const loop = (now) => {
      const deltaTime = Math.min(0.1, (now - this.lastFrameTime) / 1000);
      this.lastFrameTime = now;

      this.update(deltaTime);
      this.render();

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update(deltaTime) {
    if (this.player) {
      this.player.update(deltaTime);
    }
    this.renderer.update(deltaTime);
    this.particles.update(deltaTime);

    // Update entity animations
    for (const list of Object.values(this.entities)) {
      for (const item of list) {
        if (item && typeof item.update === 'function') {
          item.update(deltaTime);
        }
      }
    }
  }

  render() {
    if (!this.tilemap || !this.player) return;
    this.renderer.render(this.tilemap, this.player, this.entities, this.particles);
  }
}

// Auto bootstrap when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.adventureGame = new Game();
});
