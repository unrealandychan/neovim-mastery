/**
 * Retro RPG Dialogue System with Typewriter Effect and Audio Blips
 */

export class DialogueSystem {
  constructor(audio) {
    this.audio = audio;
    this.container = document.getElementById('dialog-box');
    this.avatarEl = document.getElementById('dialog-avatar');
    this.speakerEl = document.getElementById('dialog-speaker');
    this.textEl = document.getElementById('dialog-text');

    this.isOpen = false;
    this.lines = [];
    this.currentLineIdx = 0;
    this.currentSpeaker = '';
    this.currentAvatar = '🧙‍♂️';
    this.onCompleteCallback = null;

    this.typewriterTimer = null;
    this.isTyping = false;
    this.targetText = '';
  }

  start(speaker, avatar, lines, onComplete = null) {
    if (!this.container) return;
    this.isOpen = true;
    this.speaker = speaker;
    this.avatar = avatar;
    this.lines = Array.isArray(lines) ? lines : [lines];
    this.currentLineIdx = 0;
    this.onCompleteCallback = onComplete;

    this.speakerEl.textContent = speaker;
    this.avatarEl.textContent = avatar;
    this.container.classList.add('active');

    this.showCurrentLine();
  }

  showCurrentLine() {
    if (this.currentLineIdx >= this.lines.length) {
      this.close();
      return;
    }

    this.targetText = this.lines[this.currentLineIdx];
    this.textEl.textContent = '';
    this.isTyping = true;
    let charIdx = 0;

    if (this.typewriterTimer) clearInterval(this.typewriterTimer);

    this.typewriterTimer = setInterval(() => {
      if (charIdx < this.targetText.length) {
        this.textEl.textContent += this.targetText[charIdx];
        if (charIdx % 2 === 0 && this.audio) {
          this.audio.playDialogueBeep();
        }
        charIdx++;
      } else {
        clearInterval(this.typewriterTimer);
        this.typewriterTimer = null;
        this.isTyping = false;
      }
    }, 22);
  }

  advance() {
    if (!this.isOpen) return;

    if (this.isTyping) {
      // Instantly finish typing current line
      if (this.typewriterTimer) {
        clearInterval(this.typewriterTimer);
        this.typewriterTimer = null;
      }
      this.textEl.textContent = this.targetText;
      this.isTyping = false;
    } else {
      // Advance to next line
      this.currentLineIdx++;
      if (this.currentLineIdx < this.lines.length) {
        this.showCurrentLine();
      } else {
        this.close();
      }
    }
  }

  close() {
    if (!this.isOpen) return;
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
    }
    this.isOpen = false;
    if (this.container) {
      this.container.classList.remove('active');
    }
    if (this.onCompleteCallback) {
      const cb = this.onCompleteCallback;
      this.onCompleteCallback = null;
      cb();
    }
  }
}
