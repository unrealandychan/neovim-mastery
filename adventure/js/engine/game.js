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

    const btnHints = document.getElementById('btn-hints');
    if (btnHints) {
      btnHints.addEventListener('click', () => this.openHintsModal());
    }

    const btnCloseHints = document.getElementById('btn-close-hints');
    if (btnCloseHints) {
      btnCloseHints.addEventListener('click', () => this.hud.closeHints());
    }

    const btnDismissHints = document.getElementById('btn-dismiss-hints');
    if (btnDismissHints) {
      btnDismissHints.addEventListener('click', () => this.hud.closeHints());
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
    this.entities.exit = data.exit || null;

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
    const lines = npc.getDialogue({
      inventory: this.player.inventory,
      player: this.player,
      level: this.currentLevel,
      entities: this.entities
    });
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

  handleMotion(motionKey, count = 1, hasExplicitCount = false) {
    // Check if hero has ability unlocked
    if (!this.player.hasAbility(motionKey)) {
      this.audio.playError();
      this.renderer.screenShake(4);
      this.renderer.addFloatingText(`Key '${motionKey}' is locked!`, this.player.x, this.player.y, '#f7768e');
      return;
    }

    this.recordHistory();

    const isJumpMotion = motionKey === 'gg' || motionKey === 'G';
    const iterations = isJumpMotion ? 1 : count;

    for (let c = 0; c < iterations; c++) {
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
        case 'gg': {
          const target = hasExplicitCount ? count : null;
          const pt = this.tilemap.jumpToLine(target, this.player.x, 'top');
          destX = pt.x;
          destY = pt.y;
          motionSound = 'jump';
          break;
        }
        case 'G': {
          const target = hasExplicitCount ? count : null;
          const pt = this.tilemap.jumpToLine(target, this.player.x, 'bottom');
          destX = pt.x;
          destY = pt.y;
          motionSound = 'jump';
          break;
        }
        case '{': {
          const pt = this.tilemap.findParagraphJump(this.player.x, this.player.y, false);
          destX = pt.x;
          destY = pt.y;
          motionSound = 'jump';
          break;
        }
        case '}': {
          const pt = this.tilemap.findParagraphJump(this.player.x, this.player.y, true);
          destX = pt.x;
          destY = pt.y;
          motionSound = 'jump';
          break;
        }
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
    if (!this.player.hasAbility(type)) {
      this.audio.playError();
      this.renderer.addFloatingText(`Key '${type}' is locked!`, this.player.x, this.player.y, '#f7768e');
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

  handleCutObstacle(count = 1) {
    if (!this.player.hasAbility('x')) {
      this.audio.playError();
      this.renderer.addFloatingText("Key 'x' is locked!", this.player.x, this.player.y, '#f7768e');
      return;
    }

    let cutAny = false;
    for (let c = 0; c < count; c++) {
      let targetX = this.player.x;
      let targetY = this.player.y;
      if (this.player.direction === 'right') targetX += (c + 1);
      else if (this.player.direction === 'left') targetX -= (c + 1);
      else if (this.player.direction === 'down') targetY += (c + 1);
      else if (this.player.direction === 'up') targetY -= (c + 1);

      let obstacle = null;
      if (c === 0) {
        obstacle = this.entities.obstacles.find(o => !o.isCleared && o.x === this.player.x && o.y === this.player.y);
      }
      if (!obstacle) {
        obstacle = this.entities.obstacles.find(o => !o.isCleared && o.x === targetX && o.y === targetY);
      }

      if (obstacle) {
        if (!cutAny) this.recordHistory();
        obstacle.clear();
        this.tilemap.setTile(obstacle.x, obstacle.y, '='); // turn into path
        this.audio.playSlash();
        this.particles.emit(obstacle.x, obstacle.y, 14, '#9ece6a', 70, 3);
        cutAny = true;
      } else {
        break;
      }
    }

    if (cutAny) {
      this.renderer.addFloatingText('Cut with x!', this.player.x, this.player.y, '#9ece6a');
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

  handleToggleCase() {
    if (!this.player.hasAbility('~')) {
      this.audio.playError();
      this.renderer.addFloatingText("Key '~' is locked!", this.player.x, this.player.y, '#f7768e');
      return;
    }

    let targetX = this.player.x;
    let targetY = this.player.y;

    // Check if facing a letter tile in front
    let frontX = targetX;
    let frontY = targetY;
    if (this.player.direction === 'right') frontX++;
    else if (this.player.direction === 'left') frontX--;
    else if (this.player.direction === 'down') frontY++;
    else if (this.player.direction === 'up') frontY--;

    const frontTile = this.tilemap.getTile(frontX, frontY);
    if (/[a-zA-Z]/.test(frontTile) && frontTile !== '#') {
      targetX = frontX;
      targetY = frontY;
    }

    const curTile = this.tilemap.getTile(targetX, targetY);
    if (/[a-zA-Z]/.test(curTile) && curTile !== '#') {
      this.recordHistory();
      const flipped = curTile === curTile.toUpperCase() ? curTile.toLowerCase() : curTile.toUpperCase();
      this.tilemap.setTile(targetX, targetY, flipped);
      this.audio.playRepair();
      this.particles.emit(targetX, targetY, 15, '#ff9e64', 60, 3);
      this.renderer.addFloatingText(`Toggled '${curTile}' ➔ '${flipped}' (~)`, targetX, targetY, '#ff9e64');

      // Check if toggling switch triggers door or path
      if (flipped === 'O' || flipped === 'S') {
        const switchDoor = this.entities.doors.find(d => !d.isOpen && (d.keyRequired === 'switch' || d.keyRequired === 'lever'));
        if (switchDoor) {
          switchDoor.isOpen = true;
          this.tilemap.setTile(switchDoor.x, switchDoor.y, '=');
          this.audio.playDoorOpen();
          this.particles.emit(switchDoor.x, switchDoor.y, 20, '#9ece6a', 80, 4);
          this.renderer.addFloatingText(`${switchDoor.label} Opened!`, switchDoor.x, switchDoor.y, '#9ece6a');
        }
      }
      this.checkInteractions();
    } else {
      this.audio.playError();
      this.renderer.addFloatingText("No letter to toggle with ~", this.player.x, this.player.y, '#f7768e');
    }
  }

  handleStarSearch() {
    if (!this.player.hasAbility('*')) {
      this.audio.playError();
      this.renderer.addFloatingText("Key '*' is locked!", this.player.x, this.player.y, '#f7768e');
      return;
    }

    const res = this.tilemap.findMatchingToken(this.player.x, this.player.y);
    if (res.found && this.canMoveTo(res.x, res.y)) {
      this.recordHistory();
      this.player.moveTo(res.x, res.y);
      this.totalMoves++;
      this.audio.playWarp();
      this.particles.emit(res.x, res.y, 20, '#e0af68', 90, 4);
      this.renderer.addFloatingText(`Warped to matching '${res.token}' (*)!`, res.x, res.y, '#e0af68');
      this.checkInteractions();
    } else {
      this.audio.playError();
      this.renderer.addFloatingText(res.token ? `No other '${res.token}' found (*)` : "Stand on a rune word (*)", this.player.x, this.player.y, '#f7768e');
    }
  }

  handleDeleteLineEnd() {
    if (!this.player.hasAbility('D')) {
      this.audio.playError();
      this.renderer.addFloatingText("Key 'D' is locked!", this.player.x, this.player.y, '#f7768e');
      return;
    }

    this.recordHistory();
    let clearedCount = 0;
    const y = this.player.y;

    for (const obs of this.entities.obstacles) {
      if (!obs.isCleared && obs.y === y && obs.x >= this.player.x) {
        obs.clear();
        this.tilemap.setTile(obs.x, obs.y, '=');
        clearedCount++;
      }
    }

    for (let x = this.player.x; x < this.tilemap.width; x++) {
      const tile = this.tilemap.getTile(x, y);
      if (tile === 'x' || tile === 'X') {
        this.tilemap.setTile(x, y, '=');
        clearedCount++;
      }
    }

    if (clearedCount > 0) {
      this.audio.playSlash();
      this.particles.emit(this.player.x, y, 20, '#f7768e', 80, 4);
      this.renderer.addFloatingText(`Demolished line to end (D)!`, this.player.x, y, '#f7768e');
      this.checkInteractions();
    } else {
      this.audio.playError();
      this.renderer.addFloatingText("No obstacles to delete with D", this.player.x, y, '#f7768e');
    }
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
        if (this.currentLevel?.id === 5) {
          this.renderer.addFloatingText("Walk right to (28, 2) to enter Chapter 6! ➜", x + 1, y, '#9ece6a');
          this.updateLevelObjective();
        }
        return true;
      } else {
        this.audio.playError();
        this.renderer.screenShake(3);
        const keyName = door.keyRequired === 'goldKey' ? 'Gold Key' :
                        door.keyRequired === 'silverKey' ? 'Silver Key' :
                        door.keyRequired === 'bronzeKey' ? 'Bronze Key' :
                        door.keyRequired === 'skullKey' ? 'Skull Key' :
                        door.keyRequired === 'rubyKey' ? 'Ruby Key' :
                        door.keyRequired === 'emeraldKey' ? 'Emerald Key' :
                        door.keyRequired === 'diamondKey' ? 'Diamond Key' : door.keyRequired;
        if (this.currentLevel?.id === 5 && door.id === 'd5_spire') {
          this.renderer.addFloatingText("Locked! Need Tower Gold Key from dungeon floor (press 'G' to plunge down)!", x, y, '#f7768e');
        } else {
          this.renderer.addFloatingText(`Need ${keyName}!`, x, y, '#f7768e');
        }
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

  updateLevelObjective() {
    if (!this.currentLevel) return;
    if (this.currentLevel.id === 5) {
      const hasGG = this.player.hasAbility('gg');
      const hasKey = (this.player.inventory.goldKey || 0) > 0;
      const door = this.entities.doors.find(d => d.id === 'd5_spire');
      const isDoorOpen = door?.isOpen;

      let objText = this.currentLevel.objective;
      if (isDoorOpen) {
        objText = "Walk right to (28, 2) to enter the staircase to Chapter 6!";
      } else if (hasKey && hasGG) {
        objText = "Press 'gg' to fly to top Spire (row 2) and unlock Spire Gate at (24, 2)!";
      } else if (hasGG && !hasKey) {
        objText = "Grab Tower Gold Key at dungeon end (26, 17), then press 'gg' to fly to Spire Gate!";
      } else if (!hasGG && hasKey) {
        objText = "Open ability chest at (15, 17) for 'gg' & 'G', then fly to Spire Gate!";
      }
      this.hud.setLevelInfo(this.currentLevel.name, objText);
    }
  }

  openHintsModal() {
    const hints = this.getCurrentHints();
    this.hud.openHints(hints);
  }

  getCurrentHints() {
    if (!this.currentLevel) return {};

    const lvl = this.currentLevel;
    const inv = this.player.inventory;
    const doors = this.entities.doors || [];
    const chests = this.entities.chests || [];
    const keys = this.entities.keys || [];

    // Compute immediate dynamic hint based on game progress
    let immediateHint = "";
    if (lvl.id === 5) {
      const hasGG = this.player.hasAbility('gg');
      const hasKey = (inv.goldKey || 0) > 0;
      const door = doors.find(d => d.id === 'd5_spire');
      const isDoorOpen = door?.isOpen;

      if (isDoorOpen) {
        immediateHint = "Spire Gate is unlocked! Walk right to (28, 2) and step onto the glowing staircase portal to enter Chapter 6! 🪜";
      } else if (hasKey && hasGG) {
        immediateHint = "You have both the Gold Key and 'gg'! Press 'gg' now to fly straight up to the Spire Battlement (row 2), then walk right to unlock the Spire Gate at (24, 2)!";
      } else if (hasGG && !hasKey) {
        immediateHint = "You have 'gg'! Now walk right along the dungeon floor to grab the Tower Gold Key at (26, 17)!";
      } else if (!hasGG && hasKey) {
        immediateHint = "You have the Gold Key! Now open the ancient chest at (15, 17) to unlock 'gg' and 'G' so you can soar to the Spire Gate!";
      } else {
        immediateHint = "Walk right along the dungeon floor to open the ancient chest at (15, 17) and unlock 'gg' and 'G'!";
      }
    } else {
      // General dynamic hint solver for any chapter
      const unopenedChest = chests.find(c => !c.isOpen);
      if (unopenedChest) {
        immediateHint = `Open the chest at (${unopenedChest.x}, ${unopenedChest.y}) to unlock essential Vim ability [${unopenedChest.reward.value}]!`;
      } else {
        const uncollectedKey = keys.find(k => !k.isCollected);
        if (uncollectedKey) {
          immediateHint = `Collect the ${uncollectedKey.name || uncollectedKey.keyType || 'key'} at (${uncollectedKey.x}, ${uncollectedKey.y})!`;
        } else {
          const lockedDoor = doors.find(d => !d.isOpen);
          if (lockedDoor) {
            if (lockedDoor.canUnlock(inv)) {
              immediateHint = `You have the key! Step into the locked gate at (${lockedDoor.x}, ${lockedDoor.y}) to open it.`;
            } else {
              immediateHint = `The gate at (${lockedDoor.x}, ${lockedDoor.y}) requires a ${lockedDoor.keyRequired}. Explore the room to find it!`;
            }
          } else if (this.entities.exit) {
            immediateHint = `Gate is unlocked! Walk to the glowing exit portal at (${this.entities.exit.x}, ${this.entities.exit.y}) to enter Chapter ${this.entities.exit.targetLevel}!`;
          } else {
            immediateHint = lvl.objective;
          }
        }
      }
    }

    const staticHints = lvl.hints || this.getDefaultLevelHints(lvl);

    return {
      title: lvl.name,
      subtitle: lvl.subtitle,
      objective: lvl.objective,
      immediateHint: immediateHint,
      walkthrough: staticHints.walkthrough || [lvl.objective],
      commands: staticHints.commands || [],
      tip: staticHints.tip || "Use Vim motions to navigate. Press '?' for the full cheatsheet."
    };
  }

  getDefaultLevelHints(lvl) {
    const defaultGuides = {
      1: {
        walkthrough: [
          "Follow the sandy path using h (left), j (down), k (up), and l (right).",
          "Talk to Sailor Jack near the pier at (18, 10) for nautical wisdom.",
          "Collect the Bronze Key resting in the cove at (18, 14).",
          "Unlock the Shore Gate at (21, 10) and walk to (26, 10) to advance to Chapter 2!"
        ],
        commands: [
          { key: "h / j / k / l", desc: "Move left / down / up / right along walkable path tiles" }
        ],
        tip: "Keep your right hand on home row: index finger on 'h', middle on 'j', ring on 'k', pinky on 'l'!"
      },
      2: {
        walkthrough: [
          "Talk to Island Hermit at (4, 3) to learn word leaping secrets.",
          "Open the chest at (7, 4) to unlock word leap abilities: w, b, e, and ge.",
          "Leap across water voids between islands using 'w' (word start) or 'e' (word end).",
          "Grab the Silver Key on the eastern atoll at (24, 7).",
          "Unlock the Reef Gate at (23, 10) and step to (24, 10) to enter Chapter 3!"
        ],
        commands: [
          { key: "w", desc: "Leap forward to the beginning of next word/island" },
          { key: "b", desc: "Leap backward to beginning of previous word/island" },
          { key: "e", desc: "Leap forward to the end of current/next word/island" },
          { key: "ge", desc: "Leap backward to the end of previous word/island" }
        ],
        tip: "'w' and 'b' land on the start of words, while 'e' and 'ge' land on ends. Use them to jump straight across ocean gaps!"
      },
      3: {
        walkthrough: [
          "Talk to Cliff Warden at (3, 2).",
          "Open the chest at (4, 4) to unlock line boundaries: 0, $, and ^.",
          "Press '$' to zip across the canyon ledge all the way to the right end.",
          "Collect the Gold Key at (25, 4).",
          "Press '0' or '^' to fly back to the cliff base, unlock Cliff Gate at (23, 8), and exit to Chapter 4!"
        ],
        commands: [
          { key: "$", desc: "Zip straight to the end of the current line" },
          { key: "0", desc: "Warp back to the very first character of the line" },
          { key: "^", desc: "Warp to the first non-blank character of the line" }
        ],
        tip: "Never hold 'l' across a long line! A single '$' takes you to the far end instantly."
      },
      4: {
        walkthrough: [
          "Open ability chest at (3, 4) to master inline seeker motions: f, t, F, and T.",
          "Use 'f{char}' to leap forward to specific letters on stepping stones across the river.",
          "Use 't{char}' to stop one tile before a hazard character.",
          "Collect the Canyon Ruby Key at (24, 6).",
          "Unlock the Canyon Gate at (25, 8) and step to the exit at (27, 8)!"
        ],
        commands: [
          { key: "f{char}", desc: "Find and jump forward to target character" },
          { key: "t{char}", desc: "Till: jump forward stopping just before target character" },
          { key: "F / T", desc: "Find / Till backward in the line" },
          { key: "; / ,", desc: "Repeat last inline find forward / backward" }
        ],
        tip: "Pressing ';' repeats your previous search character so you can hop across identical stones rapidly!"
      },
      5: {
        walkthrough: [
          "Open the ancient chest ahead at (15, 17) to unlock 'gg' (fly to top) and 'G' (plunge to bottom).",
          "Collect the Tower Gold Key at the far right of the dungeon floor at (26, 17).",
          "Type 'gg' to fly directly up to the Spire Battlement at the top of the tower (row 2).",
          "Walk right to unlock the Spire Gate at (24, 2) with your Gold Key.",
          "Step onto the glowing staircase portal at (28, 2) to advance to Chapter 6!"
        ],
        commands: [
          { key: "gg", desc: "Fly directly to topmost floor (Spire Battlement walkway at row 2)" },
          { key: "G", desc: "Plunge directly down to bottom dungeon floor (row 17)" },
          { key: "8G", desc: "Count jump: leap directly to row 8 (Balcony 3) to collect bonus gems" }
        ],
        tip: "Jump motions bypass all vertical walls and stairs in a single instant! Once the gate opens, step onto the glowing portal at (28, 2)."
      },
      6: {
        walkthrough: [
          "Talk to Forest Ranger at (3, 2).",
          "Open chest at (3, 4) to unlock paragraph jump motions: { and }.",
          "Press '}' to leap forward across glades divided by empty lines.",
          "Collect the Forest Emerald Key at (23, 14).",
          "Unlock Forest Gate at (24, 8) and enter the Chapter 7 portal at (26, 8)!"
        ],
        commands: [
          { key: "}", desc: "Leap forward to next empty line / paragraph boundary" },
          { key: "{", desc: "Leap backward to previous empty line / paragraph boundary" }
        ],
        tip: "'}' and '{' let you leap over entire blocks of code in Vim!"
      },
      7: {
        walkthrough: [
          "Open chest to unlock bracket matching '%'.",
          "Stand on any bracket '(', '[', or '{' and press '%' to teleport across deep chasms to its matching pair.",
          "Collect the Crypt Skull Key and unlock the Crypt Gate to advance to Chapter 8!"
        ],
        commands: [
          { key: "%", desc: "Teleport to the matching parenthesis, bracket, or curly brace" }
        ],
        tip: "In Vim, '%' instantly navigates between opening and closing tags, if/else blocks, and parentheses!"
      },
      8: {
        walkthrough: [
          "Prepend motion counts: type numbers before a motion like '4w', '3j', '5l'.",
          "Leap accurately across quicksand tiles with exact counts.",
          "Retrieve the Diamond Key and unlock the Oasis Gate to advance to Chapter 9!"
        ],
        commands: [
          { key: "{count}{motion}", desc: "Execute motion count times, e.g. 4w, 3j, 5l" }
        ],
        tip: "Count motions build speed—instead of pressing 'j' four times, hit '4j'!"
      },
      9: {
        walkthrough: [
          "Open chest to unlock 'x' (delete character / cut obstacle).",
          "Use 'x' to slice down overgrown brambles and weeds blocking narrow paths.",
          "Collect the Bronze Key and unlock the Meadow Gate to enter Chapter 10!"
        ],
        commands: [
          { key: "x", desc: "Cut / delete obstacle or weed tile under cursor" }
        ],
        tip: "'x' in Vim deletes the character under the cursor without entering insert mode."
      },
      10: {
        walkthrough: [
          "Open chest to unlock 'r' (replace character).",
          "Stand before broken path gaps and type 'r=' or 'r.' to repair stone bridge segments.",
          "Cross the repaired bridges to claim the Quarry Key and exit to Chapter 11!"
        ],
        commands: [
          { key: "r{char}", desc: "Replace current tile with specified character (e.g. r=)" }
        ],
        tip: "'r' replaces a single character in Vim instantly without leaving normal mode!"
      },
      11: {
        walkthrough: [
          "Talk to Chronos the Sage at (4, 3) to learn temporal undo mechanics.",
          "Beware the collapsing floor traps: stepping onto false runes triggers temporal dead-ends.",
          "Press 'u' to rewind time and undo accidental steps or trap triggers.",
          "Navigate the true chrono path to retrieve the Silver Key at (27, 8).",
          "Unlock the Chrono Gate at (24, 10) and enter Chapter 12!"
        ],
        commands: [
          { key: "u", desc: "Undo last step or action and rewind time" }
        ],
        tip: "In Vim, 'u' is your ultimate safety net—undo mistakes instantly to restore peace of mind!"
      },
      12: {
        walkthrough: [
          "Open chest to unlock '~' (toggle case).",
          "Step onto lower-case runic floor switches and press '~' to toggle uppercase, opening magnetic gates.",
          "Collect the Ruby Key and reach the exit portal to Chapter 13!"
        ],
        commands: [
          { key: "~", desc: "Toggle case of letter under cursor and advance" }
        ],
        tip: "'~' is the fastest way in Vim to switch between UPPERCASE and lowercase!"
      },
      13: {
        walkthrough: [
          "Open chest to unlock '*' (search word under cursor).",
          "Stand on glowing runic beacon words and press '*' to warp to identical beacons across the valley.",
          "Collect the Golden Beacon Key, unlock Valley Gate, and reach Chapter 14!"
        ],
        commands: [
          { key: "*", desc: "Search forward for word under cursor and warp to next match" },
          { key: "#", desc: "Search backward for word under cursor" }
        ],
        tip: "'*' is a super-power in Vim: place cursor on any variable and press '*' to jump to its next occurrence!"
      },
      14: {
        walkthrough: [
          "Open chest to unlock 'D' (delete to end of line).",
          "Press 'D' to demolish entire horizontal laser barriers in one stroke.",
          "Collect the Master Key and unlock the Vault Gate to enter the final Chapter 15!"
        ],
        commands: [
          { key: "D", desc: "Delete all obstacle characters to the end of the line" }
        ],
        tip: "'D' is equivalent to 'd$'—it vaporizes everything from cursor to line end!"
      },
      15: {
        walkthrough: [
          "The Grand Citadel of the Neovim Grandmaster: synthesize all your skills!",
          "Conquer the 4 elemental trials using gg, G, w, b, %, x, r, ~, *, and D.",
          "Collect all 4 Citadel Keys: Diamond, Ruby, Emerald, and Gold.",
          "Unlock the Grand Citadel Gate and ascend the Golden Throne for the Grandmaster Victory!"
        ],
        commands: [
          { key: "All Motions", desc: "Combine h/j/k/l, w/b/e, 0/$, gg/G, %, x, r, ~, *, D" }
        ],
        tip: "You have trained your muscle memory into a reflex. You are ready for true modal mastery in Neovim!"
      }
    };

    return defaultGuides[lvl.id] || {
      walkthrough: [lvl.objective],
      commands: [{ key: "h, j, k, l", desc: "Navigate the grid" }],
      tip: "Explore paths and collect keys to unlock the gate to the next chapter."
    };
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
        if (this.currentLevel?.id === 5) {
          this.renderer.addFloatingText("Press 'gg' to fly to the Spire Gate! ⬆️", px, py - 1, '#7dcfff');
          this.updateLevelObjective();
        }
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
              if (reward.value === 'gg') {
                this.dialogue.start('Treasure Chest', '🎁', [
                  reward.label,
                  "You can now fly vertically across buffer lines!",
                  "• Press 'gg' to fly directly to the top Spire Battlement.",
                  "• Press 'G' to plunge back down to the dungeon floor.",
                  "• Try counts like '8G' to land on Balcony 3!",
                  "NEXT STEP: Grab the Tower Gold Key at the right end of this dungeon floor (26, 17), then press 'gg' to fly to the Spire Gate!"
                ]);
                this.updateLevelObjective();
              } else {
                this.dialogue.start('Treasure Chest', '🎁', [
                  reward.label,
                  `You have mastered a new Vim motion! Check the ribbon below.`
                ]);
              }
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
      if (!Array.isArray(list)) continue;
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

// Auto bootstrap when DOM is ready or immediately if already interactive
if (typeof window !== 'undefined') {
  const boot = () => {
    if (window.adventureGame) return;
    window.adventureGame = new Game();
  };
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}
