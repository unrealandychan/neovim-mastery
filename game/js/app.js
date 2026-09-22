import { TextBuffer } from './editor/buffer.js';
import { VimEngine } from './editor/vim-engine.js';
import { STAGES } from './stages/curriculum.js';
import { evaluateStage } from './stages/evaluator.js';
import { renderBuffer, renderCmdline } from './ui/renderer.js';
import { renderStatusline } from './ui/statusline.js';
import { renderHUD } from './ui/hud.js';
import { renderDiffViewer } from './ui/diff-viewer.js';
import { toggleWhichKey } from './ui/which-key.js';
import { SoundFX } from './ui/audio.js';
import { renderStageSelectModal, renderVictoryModal } from './ui/modal.js';
import { GameState } from './state.js';
import { FzfModal } from './ui/fzf-modal.js';
import { NeoTreeSidebar } from './ui/neo-tree.js';
import { TroubleDrawer } from './ui/trouble.js';
import { LspPopups } from './ui/lsp-popups.js';
import { LazyGitModal } from './ui/lazygit-modal.js';

export class App {
  constructor() {
    this.state = new GameState();
    this.sound = new SoundFX();
    this.sound.setMuted(this.state.isMuted);

    this.currentStage = null;
    this.buffer = null;
    this.engine = null;
    this.keystrokes = [];
    this.stageCompleted = false;
    this.lastFeedback = '';
    this.activeHintIndex = 0;

    // DOM cache
    this.dom = {
      editorViewport: document.getElementById('editor-viewport'),
      statusline: document.getElementById('statusline'),
      cmdlineBar: document.getElementById('cmdline-bar'),
      hud: document.getElementById('keystroke-hud'),
      diffBox: document.getElementById('diff-box'),
      whichKeyDrawer: document.getElementById('which-key-drawer'),
      modalOverlay: document.getElementById('modal-overlay'),
      missionBadge: document.getElementById('mission-badge'),
      missionTitle: document.getElementById('mission-title'),
      missionConcept: document.getElementById('mission-concept'),
      missionDesc: document.getElementById('mission-desc'),
      statPar: document.getElementById('stat-par'),
      statStrokes: document.getElementById('stat-strokes'),
      statStars: document.getElementById('stat-stars'),
      btnHint: document.getElementById('btn-hint'),
      btnReset: document.getElementById('btn-reset'),
      btnMap: document.getElementById('btn-map'),
      btnWhichKey: document.getElementById('btn-which-key'),
      btnAudio: document.getElementById('btn-audio'),
      btnSandbox: document.getElementById('btn-sandbox'),
    };

    this.fzfModal = null;
    this.neoTree = null;
    this.troubleDrawer = null;
    this.lspPopups = null;
    this.lazygitModal = null;
  }

  init() {
    this.initPlugins();
    this.bindEvents();
    this.loadStage(this.state.currentDay);
    this.updateAudioButton();
  }

  initPlugins() {
    if (typeof document === 'undefined') return;

    this.fzfModal = new FzfModal({
      containerEl: document.body,
      onSelectFile: (file) => {
        if (this.buffer && this.engine) {
          this.buffer.setText(file.content);
          this.buffer.setCursor(0, 0);
          this.engine.actionsExecuted.add('fzf');
          this.lastFeedback = `Fzf: Opened ${file.path}`;
          const tabEl = document.getElementById('tab-filename');
          if (tabEl) tabEl.textContent = file.path.split('/').pop();
          this.render();
        }
      },
      onClose: () => {
        this.render();
      },
    });

    this.neoTree = new NeoTreeSidebar({
      containerEl: document.querySelector('.main-workspace') || document.body,
      onSelectFile: (file) => {
        if (this.buffer && this.engine) {
          this.buffer.setText(file.content);
          this.buffer.setCursor(0, 0);
          this.engine.actionsExecuted.add('neotree');
          this.lastFeedback = `Neo-tree: Opened ${file.path}`;
          const tabEl = document.getElementById('tab-filename');
          if (tabEl) tabEl.textContent = file.name;
          this.render();
        }
      },
      onToggle: () => {
        this.render();
      },
    });

    this.troubleDrawer = new TroubleDrawer({
      containerEl: document.querySelector('.editor-pane') || document.body,
      onSelectDiagnostic: (diag) => {
        if (this.buffer && this.engine) {
          this.engine.actionsExecuted.add('trouble');
          this.buffer.setCursor(Math.max(0, diag.line - 1), diag.col);
          this.lastFeedback = `Trouble: Jumped to ${diag.file}:${diag.line}`;
          this.render();
        }
      },
      onToggle: () => {
        this.render();
      },
    });

    this.lspPopups = new LspPopups({
      containerEl: document.body,
      onApplyCodeAction: (actionId) => {
        if (this.engine) {
          this.engine.actionsExecuted.add('lsp_code_action');
          this.lastFeedback = `LSP: Applied code action (${actionId})`;
          this.render();
        }
      },
      onApplyRename: (newName) => {
        if (this.buffer && this.engine) {
          const curWord = this.engine.getWordUnderCursor();
          if (curWord) {
            const lines = this.buffer.getLines();
            const regex = new RegExp(`\\b${curWord}\\b`, 'g');
            const newLines = lines.map(l => l.replace(regex, newName));
            this.buffer.setText(newLines.join('\n'));
          }
          this.engine.actionsExecuted.add('lsp_rename');
          this.lastFeedback = `LSP: Renamed to '${newName}'`;
          this.render();
        }
      },
    });

    this.lazygitModal = new LazyGitModal({
      containerEl: document.body,
      onClose: () => {
        this.render();
      },
    });
  }

  setupEngineHooks() {
    if (!this.engine) return;

    this.engine.onLeaderState = (prefix, active) => {
      toggleWhichKey(this.dom.whichKeyDrawer, active, prefix);
    };

    this.engine.onPluginAction = (action) => {
      if (action === 'fzf_files' && this.fzfModal) {
        this.fzfModal.open('files');
      } else if (action === 'fzf_grep' && this.fzfModal) {
        this.fzfModal.open('grep');
      } else if (action === 'fzf_buffers' && this.fzfModal) {
        this.fzfModal.open('buffers');
      } else if (action === 'neotree' && this.neoTree) {
        this.neoTree.toggle();
      } else if (action === 'trouble' && this.troubleDrawer) {
        this.troubleDrawer.toggle();
      } else if (action === 'lsp_hover' && this.lspPopups) {
        const word = this.engine.getWordUnderCursor();
        this.lspPopups.showHover(word, `(symbol) ${word || 'element'}: unknown`, `LSP documentation for '${word || 'symbol'}'.`);
      } else if (action === 'lsp_code_action' && this.lspPopups) {
        this.lspPopups.showAction();
      } else if (action === 'lsp_rename' && this.lspPopups) {
        const word = this.engine.getWordUnderCursor();
        this.lspPopups.showRename(word);
      } else if (action === 'lazygit' && this.lazygitModal) {
        this.lazygitModal.open();
      }
    };
  }

  loadStage(dayNumber) {
    const stage = STAGES.find(s => s.day === dayNumber) || STAGES[0];
    this.currentStage = stage;
    this.state.currentDay = stage.day;
    this.state.save();

    this.keystrokes = [];
    this.stageCompleted = false;
    this.lastFeedback = '';
    this.activeHintIndex = 0;

    this.buffer = new TextBuffer(stage.initialText);
    this.engine = new VimEngine(this.buffer);
    this.setupEngineHooks();

    if (stage.setup) {
      stage.setup(this.engine);
    } else if (stage.cursorStart) {
      this.buffer.setCursor(stage.cursorStart.row, stage.cursorStart.col);
    }

    this.updateMissionUI();
    this.render();
  }

  loadSandbox() {
    this.currentStage = {
      day: null,
      week: 'Free Play',
      title: 'Free Sandbox Mode',
      concept: 'Open Workspace for Experimentation',
      mission: 'Test any Vim motions, operators, text objects, search patterns, or counts freely.',
      initialText: '// Neovim Dojo Sandbox\n// Practice any commands:\nconst message = "Hello from Tokyo Night!";\nfunction demo(a, b) {\n  return a + b;\n}',
      parKeystrokes: 999,
      targetText: '',
      hints: ['Type "i" for Insert mode, <Esc> for Normal mode, ":" for commands.'],
      chapterRef: 'README.md',
    };
    this.keystrokes = [];
    this.stageCompleted = false;
    this.buffer = new TextBuffer(this.currentStage.initialText);
    this.engine = new VimEngine(this.buffer);
    this.setupEngineHooks();
    this.updateMissionUI();
    this.render();
  }

  updateMissionUI() {
    const s = this.currentStage;
    if (this.dom.missionBadge) {
      this.dom.missionBadge.textContent = s.day ? `Day ${s.day} • Week ${s.week}` : 'Sandbox';
    }
    if (this.dom.missionTitle) this.dom.missionTitle.textContent = s.title;
    if (this.dom.missionConcept) this.dom.missionConcept.textContent = `🎯 ${s.concept}`;
    if (this.dom.missionDesc) this.dom.missionDesc.textContent = s.mission;
    if (this.dom.statPar) this.dom.statPar.textContent = s.parKeystrokes || '-';
    if (this.dom.statStrokes) this.dom.statStrokes.textContent = '0';

    const stars = this.state.getStageStars(s.day);
    if (this.dom.statStars) {
      this.dom.statStars.textContent = stars > 0 ? '⭐'.repeat(stars) : '☆☆☆';
    }
  }

  bindEvents() {
    window.addEventListener('keydown', e => this.handleKeydown(e));

    this.dom.btnHint?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      this.showHint();
    });
    this.dom.btnReset?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      this.loadStage(this.currentStage.day || 1);
    });
    this.dom.btnMap?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      renderStageSelectModal(
        this.dom.modalOverlay,
        STAGES,
        this.state,
        day => this.loadStage(day)
      );
    });
    this.dom.btnWhichKey?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      toggleWhichKey(this.dom.whichKeyDrawer);
    });
    this.dom.btnAudio?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      const muted = this.sound.toggleMute();
      this.state.isMuted = muted;
      this.state.save();
      this.updateAudioButton();
    });
    this.dom.btnSandbox?.addEventListener('click', (e) => {
      e.currentTarget?.blur();
      if (this.currentStage.day) {
        this.loadSandbox();
        this.dom.btnSandbox.textContent = 'Exit Sandbox';
      } else {
        this.loadStage(this.state.currentDay);
        this.dom.btnSandbox.textContent = 'Sandbox';
      }
    });
  }

  updateAudioButton() {
    if (this.dom.btnAudio) {
      this.dom.btnAudio.innerHTML = this.sound.isMuted() ? '🔇 Unmute' : '🔊 Sound: ON';
    }
  }

  showHint() {
    if (!this.currentStage.hints || this.currentStage.hints.length === 0) return;
    const hint = this.currentStage.hints[this.activeHintIndex % this.currentStage.hints.length];
    this.lastFeedback = `💡 Hint (${(this.activeHintIndex % this.currentStage.hints.length) + 1}/${this.currentStage.hints.length}): ${hint}`;
    this.activeHintIndex++;
    this.render();
  }

  handleKeydown(e) {
    // If modal is open, handle modal keyboard controls
    if (this.dom.modalOverlay?.classList.contains('open')) {
      if (e.key === 'Escape') {
        this.dom.modalOverlay.classList.remove('open');
      } else if (e.key === 'Enter') {
        const nextBtn = this.dom.modalOverlay.querySelector('#victory-next-btn') ||
                        this.dom.modalOverlay.querySelector('.btn-primary');
        if (nextBtn) {
          nextBtn.click();
        } else {
          this.dom.modalOverlay.classList.remove('open');
        }
      } else if (e.key === 'r' || e.key === 'R') {
        const replayBtn = this.dom.modalOverlay.querySelector('#victory-replay-btn');
        if (replayBtn) replayBtn.click();
      }
      return;
    }

    // Ignore standalone modifier keys to avoid false error beeps
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'NumLock', 'ScrollLock'].includes(e.key)) {
      return;
    }

    // Pass through browser devtools and standard Mac system shortcuts
    if (e.key === 'F12' || (e.metaKey && ['r', 'R', 'l', 'w', 'q', 'c', 'v', 'a', 'x', 'z'].includes(e.key))) {
      return;
    }

    // Advance to next day on Enter if current stage was completed and dismissed
    if (this.stageCompleted && e.key === 'Enter' && this.engine.getMode() === 'NORMAL') {
      if (this.currentStage.day && this.currentStage.day < STAGES.length) {
        this.loadStage(this.currentStage.day + 1);
      } else {
        renderStageSelectModal(
          this.dom.modalOverlay,
          STAGES,
          this.state,
          day => this.loadStage(day)
        );
      }
      return;
    }

    // Intercept common browser hotkeys that collide with Vim
    const blocked = ['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (blocked.includes(e.key) || (e.ctrlKey && ['s', 'r', 'd', 'u', 'w', 'b', 'f'].includes(e.key.toLowerCase()))) {
      e.preventDefault();
    }

    let vimKey = e.key;
    if (e.ctrlKey) {
      vimKey = `<C-${e.key.toLowerCase()}>`;
    }

    const result = this.engine.handleKey(vimKey);

    if (result.handled) {
      this.sound.playKeypress();
      this.keystrokes.push(vimKey);
      if (result.feedback) {
        this.lastFeedback = result.feedback;
      }
    } else {
      this.sound.playError();
    }

    this.render();

    // Check completion if in stage mode
    if (this.currentStage.day && !this.stageCompleted) {
      const evaluation = evaluateStage(this.currentStage, this.engine, this.keystrokes);
      if (evaluation.completed) {
        this.stageCompleted = true;
        this.sound.playLevelComplete();
        this.state.recordStageResult(this.currentStage.day, evaluation.stars, evaluation.strokes);

        setTimeout(() => {
          renderVictoryModal(
            this.dom.modalOverlay,
            this.currentStage,
            evaluation,
            () => {
              if (this.currentStage.day < STAGES.length) {
                this.loadStage(this.currentStage.day + 1);
              } else {
                renderStageSelectModal(
                  this.dom.modalOverlay,
                  STAGES,
                  this.state,
                  day => this.loadStage(day)
                );
              }
            },
            () => this.loadStage(this.currentStage.day)
          );
        }, 300);
      }
    }
  }

  render() {
    renderBuffer(this.dom.editorViewport, this.engine, this.buffer);
    renderStatusline(this.dom.statusline, this.engine, this.currentStage);
    renderCmdline(this.dom.cmdlineBar, this.engine, this.lastFeedback);
    renderHUD(this.dom.hud, this.keystrokes, this.currentStage.parKeystrokes, this.lastFeedback);

    if (this.currentStage.targetText) {
      renderDiffViewer(this.dom.diffBox, this.buffer.getText(), this.currentStage.targetText);
    } else if (this.dom.diffBox) {
      this.dom.diffBox.innerHTML = '<div style="color: var(--tn-comment)">Sandbox: free typing area</div>';
    }

    if (this.dom.statStrokes) {
      this.dom.statStrokes.textContent = `${this.keystrokes.length}`;
    }
  }
}

// Auto-boot if running in browser
if (typeof window !== 'undefined') {
  const boot = () => {
    if (window.__vim_app) return;
    const app = new App();
    app.init();
    window.__vim_app = app;
  };
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}
