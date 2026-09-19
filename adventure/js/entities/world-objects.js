/**
 * Interactive World Entities: NPCs, Chests, Keys, Doors, Gems, and Portals
 */

export class NPC {
  constructor({ id, name, x, y, sprite = 'sage', dialogue = [], avatar = '🧙‍♂️', quest = null }) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.sprite = sprite; // 'sage', 'sailor', 'monk', 'master'
    this.dialogue = dialogue; // Array of strings
    this.avatar = avatar;
    this.quest = quest;
    this.hasTalked = false;
    this.animTimer = 0;
    this.animFrame = 0;
  }

  update(deltaTime) {
    this.animTimer += deltaTime;
    if (this.animTimer > 0.3) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 2;
    }
  }

  getDialogue(gameState) {
    if (this.quest && this.quest.check(gameState)) {
      return this.quest.completedDialogue;
    }
    return this.dialogue;
  }
}

export class Chest {
  constructor({ id, x, y, rewardType, rewardValue, label = '' }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.rewardType = rewardType; // 'ability' | 'key' | 'gem'
    this.rewardValue = rewardValue; // e.g. 'w', 'goldKey', 100
    this.label = label;
    this.isOpen = false;
    this.openAnim = 0; // 0 to 1
  }

  open() {
    if (this.isOpen) return null;
    this.isOpen = true;
    return {
      type: this.rewardType,
      value: this.rewardValue,
      label: this.label,
    };
  }

  update(deltaTime) {
    if (this.isOpen && this.openAnim < 1) {
      this.openAnim = Math.min(1, this.openAnim + deltaTime * 3);
    }
  }
}

export class KeyItem {
  constructor({ id, x, y, keyType, name }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.keyType = keyType; // 'bronzeKey', 'silverKey', 'goldKey', 'skullKey'
    this.name = name || 'Key';
    this.isCollected = false;
    this.bobTimer = Math.random() * Math.PI * 2;
  }

  collect() {
    if (this.isCollected) return false;
    this.isCollected = true;
    return true;
  }

  update(deltaTime) {
    this.bobTimer += deltaTime * 3;
  }
}

export class Door {
  constructor({ id, x, y, keyRequired, orientation = 'horizontal', label = '' }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.keyRequired = keyRequired; // 'bronzeKey', 'silverKey', 'goldKey', 'skullKey'
    this.orientation = orientation;
    this.label = label;
    this.isOpen = false;
    this.openAnim = 0;
  }

  canUnlock(inventory) {
    return (inventory[this.keyRequired] || 0) > 0;
  }

  unlock(inventory) {
    if (this.isOpen) return false;
    if (this.canUnlock(inventory)) {
      inventory[this.keyRequired]--;
      this.isOpen = true;
      return true;
    }
    return false;
  }

  update(deltaTime) {
    if (this.isOpen && this.openAnim < 1) {
      this.openAnim = Math.min(1, this.openAnim + deltaTime * 3);
    }
  }
}

export class Gem {
  constructor({ id, x, y, value = 10, color = '#7dcfff' }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.value = value;
    this.color = color;
    this.isCollected = false;
    this.bobTimer = Math.random() * Math.PI * 2;
  }

  collect() {
    if (this.isCollected) return 0;
    this.isCollected = true;
    return this.value;
  }

  update(deltaTime) {
    this.bobTimer += deltaTime * 4;
  }
}

export class BracketPortal {
  constructor({ id, x, y, char, targetX, targetY, pairId }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.char = char; // '(', ')', '[', ']', '{', '}'
    this.targetX = targetX;
    this.targetY = targetY;
    this.pairId = pairId;
    this.pulseTimer = 0;
  }

  update(deltaTime) {
    this.pulseTimer += deltaTime * 4;
  }
}

export class Obstacle {
  constructor({ id, x, y, char = 'x', type = 'weed', hint = 'Cut with x' }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.char = char;
    this.type = type; // 'weed', 'bug', 'glitch'
    this.hint = hint;
    this.isCleared = false;
  }

  clear() {
    if (this.isCleared) return false;
    this.isCleared = true;
    return true;
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(x, y, count = 10, color = '#7aa2f7', speed = 60, size = 3) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = (Math.random() * 0.7 + 0.3) * speed;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color,
        size: Math.random() * size + 1.5,
        life: 0,
        maxLife: Math.random() * 0.4 + 0.3,
      });
    }
  }

  update(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += deltaTime;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.vy += 40 * deltaTime; // gravity
    }
  }

  render(ctx, tileSize) {
    for (const p of this.particles) {
      const alpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x * tileSize, p.y * tileSize, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
