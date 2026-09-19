/**
 * 2D Retro Canvas Renderer for Vim Adventures
 * Handles animated water, pixel-art tiles, word paths, dynamic lighting,
 * smooth camera tracking, particle effects, and floating HUD notifications.
 */

// Safe fallback for browsers or environments without native CanvasRenderingContext2D.roundRect
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h) {
    this.rect(x, y, w, h);
    return this;
  };
}

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.tileSize = 40; // 40x40 pixel grid for rich detail

    this.camera = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      shake: 0,
    };

    this.floatingTexts = [];
    this.time = 0;

    // Handle high DPI displays
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.displayWidth = rect.width;
    this.displayHeight = rect.height;
  }

  addFloatingText(text, x, y, color = '#ffc777') {
    this.floatingTexts.push({
      text,
      x,
      y,
      color,
      life: 0,
      maxLife: 1.2,
    });
  }

  screenShake(amount = 6) {
    this.camera.shake = amount;
  }

  update(deltaTime) {
    this.time += deltaTime;

    // Camera screen shake decay
    if (this.camera.shake > 0) {
      this.camera.shake = Math.max(0, this.camera.shake - deltaTime * 20);
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life += deltaTime;
      ft.y -= deltaTime * 0.8; // float upward
      if (ft.life >= ft.maxLife) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  render(tilemap, player, entities = {}, particles = null) {
    const ctx = this.ctx;
    const ts = this.tileSize;

    // Smooth camera tracking player
    const targetCamX = player.renderX * ts + ts / 2 - this.displayWidth / 2;
    const targetCamY = player.renderY * ts + ts / 2 - this.displayHeight / 2;
    this.camera.x += (targetCamX - this.camera.x) * 0.15;
    this.camera.y += (targetCamY - this.camera.y) * 0.15;

    let offsetX = -this.camera.x;
    let offsetY = -this.camera.y;

    if (this.camera.shake > 0) {
      offsetX += (Math.random() - 0.5) * this.camera.shake * 2;
      offsetY += (Math.random() - 0.5) * this.camera.shake * 2;
    }

    // Clear background (Deep ocean void)
    ctx.save();
    ctx.fillStyle = '#0f111a';
    ctx.fillRect(0, 0, this.displayWidth, this.displayHeight);

    ctx.translate(Math.round(offsetX), Math.round(offsetY));

    // Render Tilemap
    this.renderTiles(ctx, tilemap);

    // Render Portals / Brackets
    if (entities.portals) {
      this.renderPortals(ctx, entities.portals);
    }

    // Render Obstacles
    if (entities.obstacles) {
      this.renderObstacles(ctx, entities.obstacles);
    }

    // Render Doors
    if (entities.doors) {
      this.renderDoors(ctx, entities.doors);
    }

    // Render Chests
    if (entities.chests) {
      this.renderChests(ctx, entities.chests);
    }

    // Render Keys & Gems
    if (entities.gems) {
      this.renderGems(ctx, entities.gems);
    }
    if (entities.keys) {
      this.renderKeys(ctx, entities.keys);
    }

    // Render NPCs
    if (entities.npcs) {
      this.renderNPCs(ctx, entities.npcs);
    }

    // Render Particles
    if (particles) {
      particles.render(ctx, ts);
    }

    // Render Player
    this.renderPlayer(ctx, player);

    // Render Floating Texts
    this.renderFloatingTexts(ctx);

    ctx.restore();
  }

  renderTiles(ctx, tilemap) {
    const ts = this.tileSize;
    const t = this.time;

    for (let y = 0; y < tilemap.height; y++) {
      for (let x = 0; x < tilemap.width; x++) {
        const char = tilemap.getTile(x, y);
        const px = x * ts;
        const py = y * ts;

        // Skip void
        if (char === ' ') continue;

        if (char === '~') {
          // Animated Water
          ctx.fillStyle = '#1e3a5f';
          ctx.fillRect(px, py, ts, ts);

          // Shimmer wave
          const wave = Math.sin(t * 3 + x * 0.8 + y * 0.5);
          ctx.fillStyle = wave > 0.3 ? '#255085' : '#1b3456';
          ctx.fillRect(px + 4, py + ts / 2 + wave * 4, ts - 8, 3);
          continue;
        }

        if (char === '#') {
          // Wall / Stone brick
          ctx.fillStyle = '#292e42';
          ctx.fillRect(px, py, ts, ts);
          ctx.fillStyle = '#3b4261';
          ctx.fillRect(px, py, ts, 3); // top highlight
          ctx.fillStyle = '#1a1b26';
          ctx.fillRect(px, py + ts - 3, ts, 3); // shadow
          // Brick seam
          ctx.fillStyle = '#16161e';
          ctx.fillRect(px + ts / 2, py + 3, 2, ts - 6);
          continue;
        }

        if (char === '.') {
          // Lush Grass
          ctx.fillStyle = '#1d3b2c';
          ctx.fillRect(px, py, ts, ts);
          // Tiny grass blades
          ctx.fillStyle = '#2d5a44';
          ctx.fillRect(px + 8, py + 12, 3, 6);
          ctx.fillRect(px + 24, py + 20, 3, 6);
          continue;
        }

        if (char === '=') {
          // Cobblestone Path
          ctx.fillStyle = '#363b54';
          ctx.fillRect(px, py, ts, ts);
          ctx.fillStyle = '#414868';
          ctx.strokeRect(px + 2, py + 2, ts - 4, ts - 4);
          continue;
        }

        // Letter / Word Tile on the ground
        // Character tile backdrop (parchment/stone look)
        ctx.fillStyle = '#24283b';
        ctx.beginPath();
        ctx.roundRect(px + 2, py + 2, ts - 4, ts - 4, 6);
        ctx.fill();

        ctx.strokeStyle = '#414868';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Monospace letter
        ctx.font = 'bold 20px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (/[a-zA-Z0-9]/.test(char)) {
          ctx.fillStyle = '#c0caf5';
        } else {
          // Punctuation / Special
          ctx.fillStyle = '#7dcfff';
        }
        ctx.fillText(char, px + ts / 2, py + ts / 2 + 1);
      }
    }
  }

  renderPortals(ctx, portals) {
    const ts = this.tileSize;
    const t = this.time;

    for (const p of portals) {
      const px = p.x * ts;
      const py = p.y * ts;

      // Glowing aura for matching bracket portals
      const glow = Math.sin(t * 5 + p.pulseTimer) * 0.3 + 0.7;
      ctx.save();
      ctx.fillStyle = `rgba(187, 154, 247, ${glow * 0.35})`;
      ctx.beginPath();
      ctx.arc(px + ts / 2, py + ts / 2, ts * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Bracket badge
      ctx.fillStyle = '#1a1b26';
      ctx.beginPath();
      ctx.roundRect(px + 4, py + 4, ts - 8, ts - 8, 8);
      ctx.fill();
      ctx.strokeStyle = '#bb9af7';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = '#bb9af7';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.char, px + ts / 2, py + ts / 2);
      ctx.restore();
    }
  }

  renderObstacles(ctx, obstacles) {
    const ts = this.tileSize;
    for (const obs of obstacles) {
      if (obs.isCleared) continue;
      const px = obs.x * ts;
      const py = obs.y * ts;

      // Weed / glitch tile
      ctx.save();
      ctx.fillStyle = '#742a3a';
      ctx.beginPath();
      ctx.roundRect(px + 4, py + 4, ts - 8, ts - 8, 6);
      ctx.fill();

      ctx.font = '20px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🌿', px + ts / 2, py + ts / 2);
      ctx.restore();
    }
  }

  renderDoors(ctx, doors) {
    const ts = this.tileSize;
    for (const d of doors) {
      const px = d.x * ts;
      const py = d.y * ts;

      if (d.isOpen) {
        // Open door frame
        ctx.fillStyle = '#16161e';
        ctx.fillRect(px + 4, py + 4, ts - 8, ts - 8);
        ctx.strokeStyle = '#7aa2f7';
        ctx.strokeRect(px + 4, py + 4, ts - 8, ts - 8);
      } else {
        // Locked Gate
        ctx.fillStyle = '#414868';
        ctx.fillRect(px + 2, py + 2, ts - 4, ts - 4);

        // Iron bars
        ctx.fillStyle = '#24283b';
        ctx.fillRect(px + 8, py + 4, 4, ts - 8);
        ctx.fillRect(px + 18, py + 4, 4, ts - 8);
        ctx.fillRect(px + 28, py + 4, 4, ts - 8);

        // Padlock icon
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🔒', px + ts / 2, py + ts / 2);
      }
    }
  }

  renderChests(ctx, chests) {
    const ts = this.tileSize;
    for (const c of chests) {
      const px = c.x * ts;
      const py = c.y * ts;

      ctx.save();
      if (c.isOpen) {
        // Open chest with golden ray
        ctx.fillStyle = 'rgba(255, 199, 119, 0.3)';
        ctx.beginPath();
        ctx.moveTo(px + ts / 2, py + ts / 2);
        ctx.lineTo(px - 10, py - 30);
        ctx.lineTo(px + ts + 10, py - 30);
        ctx.closePath();
        ctx.fill();

        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📦', px + ts / 2, py + ts / 2);
      } else {
        // Closed treasure chest
        ctx.font = '26px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🎁', px + ts / 2, py + ts / 2);
      }
      ctx.restore();
    }
  }

  renderKeys(ctx, keys) {
    const ts = this.tileSize;
    for (const k of keys) {
      if (k.isCollected) continue;
      const px = k.x * ts;
      const py = k.y * ts + Math.sin(k.bobTimer) * 4;

      ctx.save();
      // Glow aura
      ctx.fillStyle = 'rgba(255, 199, 119, 0.4)';
      ctx.beginPath();
      ctx.arc(px + ts / 2, py + ts / 2, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '22px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🗝️', px + ts / 2, py + ts / 2);
      ctx.restore();
    }
  }

  renderGems(ctx, gems) {
    const ts = this.tileSize;
    for (const g of gems) {
      if (g.isCollected) continue;
      const px = g.x * ts;
      const py = g.y * ts + Math.sin(g.bobTimer) * 3;

      ctx.save();
      ctx.font = '18px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💎', px + ts / 2, py + ts / 2);
      ctx.restore();
    }
  }

  renderNPCs(ctx, npcs) {
    const ts = this.tileSize;
    for (const npc of npcs) {
      const px = npc.x * ts;
      const py = npc.y * ts;

      ctx.save();
      // NPC sprite
      ctx.font = '26px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(npc.avatar || '🧙‍♂️', px + ts / 2, py + ts / 2);

      // Speech bubble notification if not talked
      if (!npc.hasTalked) {
        ctx.fillStyle = '#ff9e64';
        ctx.beginPath();
        ctx.arc(px + ts - 6, py + 6, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1a1b26';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('!', px + ts - 6, py + 9);
      }
      ctx.restore();
    }
  }

  renderPlayer(ctx, player) {
    const ts = this.tileSize;
    const px = player.renderX * ts;
    const py = player.renderY * ts;

    ctx.save();

    // Vim Block Cursor Aura underneath
    const auraGlow = Math.sin(this.time * 6) * 0.2 + 0.5;
    ctx.fillStyle = `rgba(122, 162, 247, ${auraGlow * 0.5})`;
    ctx.beginPath();
    ctx.roundRect(px + 4, py + 4, ts - 8, ts - 8, 4);
    ctx.fill();

    // Directional facing character
    const isMoving = Math.abs(player.renderX - player.x) > 0.05 || Math.abs(player.renderY - player.y) > 0.05;
    const bounce = isMoving ? Math.sin(this.time * 16) * 3 : Math.sin(this.time * 3) * 1.5;

    // Knight Sprite Body
    ctx.font = '26px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🧙', px + ts / 2, py + ts / 2 + bounce);

    // Direction indicator eye/arrow
    ctx.fillStyle = '#7dcfff';
    ctx.beginPath();
    if (player.direction === 'right') {
      ctx.arc(px + ts / 2 + 10, py + ts / 2, 3, 0, Math.PI * 2);
    } else if (player.direction === 'left') {
      ctx.arc(px + ts / 2 - 10, py + ts / 2, 3, 0, Math.PI * 2);
    } else if (player.direction === 'up') {
      ctx.arc(px + ts / 2, py + ts / 2 - 10, 3, 0, Math.PI * 2);
    } else {
      ctx.arc(px + ts / 2, py + ts / 2 + 12, 3, 0, Math.PI * 2);
    }
    ctx.fill();

    ctx.restore();
  }

  renderFloatingTexts(ctx) {
    const ts = this.tileSize;
    for (const ft of this.floatingTexts) {
      const alpha = Math.max(0, 1 - ft.life / ft.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillStyle = ft.color;
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, ft.x * ts + ts / 2, ft.y * ts);
      ctx.restore();
    }
  }
}
