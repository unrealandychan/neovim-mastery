/**
 * Player Entity (The Modal Hero)
 * Follows Vim cursor semantics with smooth sprite interpolation and column stickiness.
 */
export class Player {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.renderX = x;
    this.renderY = y;
    this.targetCol = x; // Sticky column for j/k
    this.direction = 'down'; // 'up', 'down', 'left', 'right'
    this.animFrame = 0;
    this.animTimer = 0;

    // Inventory
    this.inventory = {
      bronzeKey: 0,
      silverKey: 0,
      goldKey: 0,
      skullKey: 0,
      rubyKey: 0,
      emeraldKey: 0,
      diamondKey: 0,
      gems: 0,
    };

    // Unlocked Vim Keystrokes
    this.unlockedAbilities = new Set(['h', 'j', 'k', 'l']);
  }

  hasAbility(key) {
    return this.unlockedAbilities.has(key);
  }

  unlockAbility(key) {
    this.unlockedAbilities.add(key);
    if (key === 'b') {
      this.unlockedAbilities.add('ge');
    }
    if (key === '$') {
      this.unlockedAbilities.add('0');
      this.unlockedAbilities.add('^');
    }
    if (key === 'f') {
      this.unlockedAbilities.add('F');
      this.unlockedAbilities.add('t');
      this.unlockedAbilities.add('T');
      this.unlockedAbilities.add(';');
      this.unlockedAbilities.add(',');
    }
    if (key === 't') {
      this.unlockedAbilities.add('T');
      this.unlockedAbilities.add(';');
      this.unlockedAbilities.add(',');
    }
    if (key === 'F') {
      this.unlockedAbilities.add(';');
      this.unlockedAbilities.add(',');
    }
    if (key === 'gg') {
      this.unlockedAbilities.add('G');
    }
    if (key === 'G') {
      this.unlockedAbilities.add('gg');
    }
    if (key === '{') {
      this.unlockedAbilities.add('}');
    }
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.renderX = x;
    this.renderY = y;
    this.targetCol = x;
  }

  moveTo(newX, newY, updateTargetCol = true) {
    if (newX > this.x) this.direction = 'right';
    else if (newX < this.x) this.direction = 'left';
    else if (newY > this.y) this.direction = 'down';
    else if (newY < this.y) this.direction = 'up';

    this.x = newX;
    this.y = newY;
    if (updateTargetCol) {
      this.targetCol = newX;
    }
  }

  update(deltaTime) {
    // Smooth visual interpolation towards logical grid tile
    const speed = 18; // interpolation rate
    this.renderX += (this.x - this.renderX) * Math.min(1, speed * deltaTime);
    this.renderY += (this.y - this.renderY) * Math.min(1, speed * deltaTime);

    // Idle breathing / walk animation
    this.animTimer += deltaTime;
    if (this.animTimer > 0.15) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 4;
    }
  }
}
