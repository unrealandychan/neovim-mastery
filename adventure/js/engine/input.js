/**
 * Vim Input Parser and Keybinding Engine
 * Supports single-key motions, counts (e.g. 3w), multi-key prefixes (f, F, t, T, r, ge),
 * repeat commands (; and ,), and dialogue / UI controls.
 */

export class InputHandler {
  constructor(game) {
    this.game = game;
    this.countBuffer = '';
    this.pendingPrefix = null; // 'f', 'F', 't', 'T', 'r', 'g'
    this.lastFind = null; // { type: 'f'|'F'|'t'|'T', target: 'x' }

    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Support on-screen retro buttons
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.getAttribute('data-action');
        this.handleAction(action);
      });
    });
  }

  resetBuffer() {
    this.countBuffer = '';
    this.pendingPrefix = null;
    this.updateHUD();
  }

  updateHUD() {
    let display = '';
    if (this.countBuffer) display += this.countBuffer;
    if (this.pendingPrefix) display += this.pendingPrefix;
    this.game.hud.setCommandPending(display || '-- NORMAL --');
  }

  handleAction(action) {
    if (action.startsWith('key:')) {
      const key = action.replace('key:', '');
      this.processVimKey(key);
    } else if (action === 'dialogue-next') {
      if (this.game.dialogue.isOpen) {
        this.game.dialogue.advance();
      }
    } else if (action === 'restart') {
      this.game.restartLevel();
    } else if (action === 'help') {
      this.game.hud.openHelp();
    } else if (action === 'mute') {
      this.game.audio.toggleMute();
    }
  }

  handleKeyDown(e) {
    // Prevent default scrolling on game keys
    const preventKeys = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (preventKeys.includes(e.code)) {
      e.preventDefault();
    }

    // Modal / Dialogue priority handling
    if (this.game.dialogue.isOpen) {
      if (e.key === 'Escape') {
        this.game.dialogue.close();
        return;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        this.game.dialogue.advance();
        return;
      }
      // Ignore other keys while dialogue is active
      return;
    }

    if (e.key === 'Escape') {
      this.resetBuffer();
      this.game.hud.closeHelp();
      this.game.hud.closeHints();
      this.game.hud.closeVictory();
      return;
    }

    // Interacting with adjacent or current NPC using Space or Enter
    if (e.key === ' ' || e.key === 'Enter') {
      const px = this.game.player.x;
      const py = this.game.player.y;
      const npc = this.game.entities.npcs.find(n => Math.abs(n.x - px) + Math.abs(n.y - py) <= 1);
      if (npc) {
        this.game.triggerNPC(npc);
        return;
      }
    }

    if (e.key === '?') {
      this.game.hud.openHelp();
      return;
    }

    if (e.key === 'H' && !this.pendingPrefix) {
      this.game.openHintsModal();
      return;
    }

    if (e.key === 'm' || e.key === 'M') {
      const isMuted = this.game.audio.toggleMute();
      this.game.renderer.addFloatingText(isMuted ? 'Muted 🔇' : 'Sound On 🔊', this.game.player.x, this.game.player.y);
      return;
    }

    if (e.key === 'R' && !this.pendingPrefix) {
      this.game.restartLevel();
      return;
    }

    if (e.key === 'u' && !this.pendingPrefix) {
      this.game.undo();
      return;
    }

    // Ignore modifier keys like Shift, Control, Alt
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
      return;
    }

    this.processVimKey(e.key);
  }

  processVimKey(key) {
    // 1. Handling Pending Prefix (e.g., waiting for target character after f, F, t, T, r)
    if (this.pendingPrefix) {
      const prefix = this.pendingPrefix;
      this.pendingPrefix = null;

      if (prefix === 'g') {
        if (key === 'e') {
          this.executeMotion('ge');
        } else if (key === 'g') {
          this.executeMotion('gg');
        } else {
          this.game.audio.playError();
        }
        this.resetBuffer();
        return;
      }

      if (prefix === 'r') {
        this.executeReplace(key);
        this.resetBuffer();
        return;
      }

      if (['f', 'F', 't', 'T'].includes(prefix)) {
        this.lastFind = { type: prefix, target: key };
        this.executeFind(prefix, key);
        this.resetBuffer();
        return;
      }
    }

    // 2. Handling Counts (1-9, or 0 if countBuffer already has digits)
    if (/[1-9]/.test(key) || (key === '0' && this.countBuffer.length > 0)) {
      this.countBuffer += key;
      this.updateHUD();
      return;
    }

    // 3. Handling '0' (Beginning of line)
    if (key === '0' && this.countBuffer.length === 0) {
      this.executeMotion('0');
      this.resetBuffer();
      return;
    }

    // 4. Handling Multi-key Initiation
    if (['f', 'F', 't', 'T', 'r', 'g'].includes(key)) {
      this.pendingPrefix = key;
      this.updateHUD();
      return;
    }

    // 5. Handling Repeat Find (; and ,)
    if (key === ';') {
      if (!this.game.player.hasAbility(';')) {
        this.game.audio.playError();
        this.game.renderer.addFloatingText("Key ';' is locked!", this.game.player.x, this.game.player.y, '#f7768e');
        this.resetBuffer();
        return;
      }
      if (this.lastFind) {
        this.executeFind(this.lastFind.type, this.lastFind.target);
      } else {
        this.game.audio.playError();
      }
      this.resetBuffer();
      return;
    }

    if (key === ',') {
      if (!this.game.player.hasAbility(',')) {
        this.game.audio.playError();
        this.game.renderer.addFloatingText("Key ',' is locked!", this.game.player.x, this.game.player.y, '#f7768e');
        this.resetBuffer();
        return;
      }
      if (this.lastFind) {
        // Reverse direction
        const revMap = { f: 'F', F: 'f', t: 'T', T: 't' };
        this.executeFind(revMap[this.lastFind.type], this.lastFind.target);
      } else {
        this.game.audio.playError();
      }
      this.resetBuffer();
      return;
    }

    // 6. Handling Single-Key Motions & Operators
    if (key === 'G') {
      this.executeMotion('G');
      this.resetBuffer();
      return;
    }

    if (key === '{' || key === '}') {
      this.executeMotion(key);
      this.resetBuffer();
      return;
    }

    if (key === '~') {
      this.game.handleToggleCase();
      this.resetBuffer();
      return;
    }

    if (key === '*') {
      this.game.handleStarSearch();
      this.resetBuffer();
      return;
    }

    if (key === 'x') {
      const count = this.getCount();
      this.game.handleCutObstacle(count);
      this.resetBuffer();
      return;
    }

    this.executeMotion(key);
    this.resetBuffer();
  }

  getCount() {
    const c = parseInt(this.countBuffer, 10);
    return isNaN(c) || c <= 0 ? 1 : Math.min(c, 99);
  }

  executeMotion(motionKey) {
    const hasCount = this.countBuffer.length > 0;
    const count = this.getCount();
    this.game.handleMotion(motionKey, count, hasCount);
  }

  executeFind(type, targetChar) {
    const count = this.getCount();
    this.game.handleFind(type, targetChar, count);
  }

  executeReplace(char) {
    this.game.handleReplace(char);
  }
}
