//test
const config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  backgroundColor: '#0a0014',
  parent: 'app',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: { preload, create }
};

const game = new Phaser.Game(config);

const TILE_COLORS = {
  WILD: 0x8B0000, DRAGON_RED: 0x6B1010, DRAGON_BLACK: 0x1a1a2e,
  BAMBOO: 0x0a3d0a, CIRCLE: 0x2d1060, CHARACTER: 0x5a3a0a,
  WIND_N: 0x0a3a5a, WIND_S: 0x0a4a4a, FLOWER: 0x5a0a3a,
  SEASON: 0x5a3a0a, GOLDEN: 0x5a5a0a,
  SCATTER_RED: 0x8B0000, SCATTER_BLACK: 0x1a1a1a, SCATTER_GOLDEN: 0x8B8B00
};

function preload() {}

function create() {
  const W = this.cameras.main.width;
  const H = this.cameras.main.height;
  const scene = this;

  // ============ BACKGROUND ============
  const bgGfx = this.add.graphics();
  bgGfx.fillGradientStyle(0x0a0014, 0x0a0014, 0x1a0030, 0x1a0030, 1);
  bgGfx.fillRect(0, 0, W, H);

  // Lightning glow center
  const glowGfx = this.add.graphics();
  glowGfx.fillStyle(0x6b21a8, 0.08);
  glowGfx.fillCircle(W / 2, H / 2 - 60, 200);
  glowGfx.fillStyle(0x9333ea, 0.05);
  glowGfx.fillCircle(W / 2, H / 2 - 60, 300);

  // Pattern
  const patternGfx = this.add.graphics();
  patternGfx.lineStyle(1, 0x2d0050, 0.2);
  for (let i = -H; i < W + H; i += 30) {
    patternGfx.lineBetween(i, 0, i + H, H);
    patternGfx.lineBetween(i + H, 0, i, H);
  }

  // ============ TITLE ============
  this.add.text(W / 2, 18, '🐉 MAHJONG WINZ 4 🐉', {
    fontSize: '18px', fontStyle: 'bold', fontFamily: 'serif',
    color: '#c084fc',
    stroke: '#581c87', strokeThickness: 2,
    shadow: { offsetX: 0, offsetY: 0, color: '#a855f7', blur: 15, fill: true }
  }).setOrigin(0.5);

  this.add.text(W / 2, 36, 'TWIN SHADOW DRAGONS', {
    fontSize: '8px', color: '#7c3aed', letterSpacing: 6
  }).setOrigin(0.5);

  const decoGfx = this.add.graphics();
  decoGfx.lineStyle(2, 0x9333ea, 0.6);
  decoGfx.lineBetween(50, 46, W - 50, 46);
  decoGfx.fillStyle(0xa855f7, 0.8);
  decoGfx.fillCircle(50, 46, 3);
  decoGfx.fillCircle(W - 50, 46, 3);
  decoGfx.fillCircle(W / 2, 46, 4);

  // ============ MULTIPLIER TEXT ============
  this.multiplierText = this.add.text(W / 2, 58, '', {
    fontSize: '14px', fontStyle: 'bold', color: '#fbbf24',
    shadow: { offsetX: 0, offsetY: 0, color: '#fbbf24', blur: 10, fill: true }
  }).setOrigin(0.5).setAlpha(0);

  this.currentMultiplierIndex = 0;

  // ============ GRID CONFIG ============
  this.cols = PAYTABLE.REELS;
  this.rows = PAYTABLE.ROWS;
  this.tileW = 54;
  this.tileH = 64;
  this.spacingX = 56;
  this.spacingY = 68;
  const gridW = this.cols * this.spacingX;
  const gridH = this.rows * this.spacingY;
  this.startX = (W - gridW) / 2 + this.spacingX / 2;
  this.startY = 100;

  // ============ REEL BG ============
  const reelBg = this.add.graphics();
  for (let c = 0; c < this.cols; c++) {
    const x = this.startX + c * this.spacingX - this.tileW / 2 - 2;
    const y = this.startY - this.tileH / 2 - 4;
    const stripH = this.rows * this.spacingY + 8;
    reelBg.fillStyle(0x0f0020, 0.8);
    reelBg.fillRoundedRect(x, y, this.tileW + 4, stripH, 4);
    reelBg.lineStyle(1, 0x4c1d95, 0.5);
    reelBg.strokeRoundedRect(x, y, this.tileW + 4, stripH, 4);
  }

  // ============ MASK ============
  const maskShape = this.make.graphics();
  maskShape.fillStyle(0xffffff);
  maskShape.fillRect(this.startX - this.tileW / 2 - 6, this.startY - this.tileH / 2 - 6, gridW + 12, gridH + 12);
  this.tileMask = maskShape.createGeometryMask();

  // ============ FRAME ============
  const frameGfx = this.add.graphics();
  const fx = this.startX - this.tileW / 2 - 18;
  const fy = this.startY - this.tileH / 2 - 18;
  const fw = gridW + 36;
  const fh = gridH + 36;

  frameGfx.lineStyle(4, 0x9333ea, 1);
  frameGfx.strokeRoundedRect(fx, fy, fw, fh, 8);
  frameGfx.lineStyle(2, 0x6b21a8, 0.7);
  frameGfx.strokeRoundedRect(fx + 6, fy + 6, fw - 12, fh - 12, 5);

  const corners = [[fx,fy],[fx+fw,fy],[fx,fy+fh],[fx+fw,fy+fh]];
  corners.forEach(([cx, cy]) => {
    frameGfx.fillStyle(0x9333ea, 1); frameGfx.fillCircle(cx, cy, 7);
    frameGfx.fillStyle(0x581c87, 1); frameGfx.fillCircle(cx, cy, 4);
    frameGfx.fillStyle(0xc084fc, 1); frameGfx.fillCircle(cx, cy, 2);
  });

  frameGfx.fillStyle(0x9333ea, 0.8);
  frameGfx.fillCircle(fx + fw/2, fy, 5);
  frameGfx.fillCircle(fx + fw/2, fy + fh, 5);
  frameGfx.fillCircle(fx, fy + fh/2, 5);
  frameGfx.fillCircle(fx + fw, fy + fh/2, 5);

  // Separators
  const sepGfx = this.add.graphics();
  sepGfx.lineStyle(1, 0x9333ea, 0.12);
  for (let c = 1; c < this.cols; c++) {
    const sx = this.startX + (c - 0.5) * this.spacingX;
    sepGfx.lineBetween(sx, this.startY - this.tileH/2, sx, this.startY + (this.rows-1)*this.spacingY + this.tileH/2);
  }

  // ============ STATE ============
this.logicGrid = ReelManager.generateGrid(false);
this.grid = [[],[],[],[],[]];
this.isSpinning = false;
this.totalWin = 0;
this.balance = 1000000;
this.betAmount = 400;
this.lockedWilds = [];
this.freeSpinState = FreeSpinManager.create();

// BUFFER UNTUK LOOP SEAMLESS
this.bufferSize = 3; // Jumlah tiles di atas dan bawah untuk seamless loop
this.totalVisibleRows = this.rows + (this.bufferSize * 2);

// ============ CREATE TILE ============
this.createTile = (col, row, yPos, symbolKey) => {
 const container = scene.add.container(scene.startX + col * scene.spacingX, yPos);
 container.setMask(scene.tileMask);
 
 const bgColor = TILE_COLORS[symbolKey] || 0x1a1a2e;
 const bg = scene.add.rectangle(0, 0, scene.tileW, scene.tileH, bgColor);
 bg.setStrokeStyle(1.5, 0x9333ea);
 
 const highlight = scene.add.rectangle(0, -scene.tileH/4, scene.tileW-6, scene.tileH/2-2, 0xffffff, 0.04);
 
 const sym = PAYTABLE.SYMBOLS[symbolKey];
 const label = sym ? sym.label : '?';
 const txt = scene.add.text(0, 0, label, { fontSize
: '30px' }).setOrigin(0.5);
    container.add([bg, highlight, txt]);
    container.symbolKey = symbolKey;

    if (sym && sym.isScatter) {
      const scLabel = scene.add.text(0, scene.tileH/2 - 8, 'SCATTER', { fontSize: '7px', color: '#fff', backgroundColor: '#00000099' }).setOrigin(0.5);
      container.add(scLabel);
    }
    return container;
  };

  // ============ INIT TILES ============
  for (let c = 0; c < this.cols; c++) {
    for (let r = 0; r < this.rows; r++) {
      const targetY = this.startY + r * this.spacingY;
      const tile = this.createTile(c, r, targetY, this.logicGrid[c][r]);
      this.grid[c].push(tile);
    }
  }

  // ============ WIN TEXT ============
  this.winText = this.add.text(W / 2, 380, '', {
    fontSize: '16px', fontStyle: 'bold', color: '#c084fc',
    shadow: { offsetX: 0, offsetY: 0, color: '#a855f7', blur: 10, fill: true }
  }).setOrigin(0.5).setAlpha(0);

  // ============ FREE SPIN TEXT ============
  this.fsText = this.add.text(W / 2, 395, '', {
    fontSize: '12px', fontStyle: 'bold', color: '#fbbf24',
    shadow: { offsetX: 0, offsetY: 0, color: '#fbbf24', blur: 8, fill: true }
  }).setOrigin(0.5).setAlpha(0);

  // ============ BOTTOM UI ============
  const panelY = 420;
  const panelGfx = this.add.graphics();
  panelGfx.fillGradientStyle(0x0a0014, 0x0a0014, 0x1a0030, 0x1a0030, 0.95);
  panelGfx.fillRoundedRect(10, panelY, W - 20, 210, 12);
  panelGfx.lineStyle(2, 0x9333ea, 0.4);
  panelGfx.strokeRoundedRect(10, panelY, W - 20, 210, 12);

  this.add.text(50, panelY + 20, 'BALANCE', { fontSize: '10px', color: '#7c3aed', fontStyle: 'bold', letterSpacing: 3 }).setOrigin(0.5);
  this.balanceText = this.add.text(50, panelY + 40, '1,000,000', { fontSize: '14px', fontStyle: 'bold', color: '#c084fc' }).setOrigin(0.5);

  this.add.text(W / 2, panelY + 20, 'BET', { fontSize: '10px', color: '#7c3aed', fontStyle: 'bold', letterSpacing: 3 }).setOrigin(0.5);
  this.betText = this.add.text(W / 2, panelY + 40, '400', { fontSize: '14px', fontStyle: 'bold', color: '#c084fc' }).setOrigin(0.5);

  const btnMinus = this.add.circle(W/2 - 45, panelY + 38, 14, 0x1a0030).setStrokeStyle(1.5, 0x9333ea).setInteractive({ useHandCursor: true });
  this.add.text(W/2 - 45, panelY + 38, '−', { fontSize: '18px', color: '#c084fc', fontStyle: 'bold' }).setOrigin(0.5);
  const btnPlus = this.add.circle(W/2 + 45, panelY + 38, 14, 0x1a0030).setStrokeStyle(1.5, 0x9333ea).setInteractive({ useHandCursor: true });
  this.add.text(W/2 + 45, panelY + 38, '+', { fontSize: '18px', color: '#c084fc', fontStyle: 'bold' }).setOrigin(0.5);

  const BET_OPTIONS = [400, 600, 800, 1000, 2000, 5000];
  let betIndex = 0;
  btnMinus.on('pointerdown', () => { if (scene.isSpinning) return; betIndex = Math.max(0, betIndex-1); scene.betAmount = BET_OPTIONS[betIndex]; scene.betText.setText(scene.betAmount.toString()); });
  btnPlus.on('pointerdown', () => { if (scene.isSpinning) return; betIndex = Math.min(BET_OPTIONS.length-1, betIndex+1); scene.betAmount = BET_OPTIONS[betIndex]; scene.betText.setText(scene.betAmount.toString()); });

  this.add.text(W - 50, panelY + 20, 'WIN', { fontSize: '10px', color: '#7c3aed', fontStyle: 'bold', letterSpacing: 3 }).setOrigin(0.5);
  this.winAmountText = this.add.text(W - 50, panelY + 40, '0', { fontSize: '14px', fontStyle: 'bold', color: '#c084fc' }).setOrigin(0.5);

  // ============ SPIN BUTTON ============
  const spinY = panelY + 120;
  const spinBtnGfx = this.add.graphics();
  spinBtnGfx.lineStyle(4, 0x9333ea, 1); spinBtnGfx.strokeCircle(W/2, spinY, 42);
  spinBtnGfx.lineStyle(2, 0x6b21a8, 0.5); spinBtnGfx.strokeCircle(W/2, spinY, 46);
  spinBtnGfx.fillStyle(0x9333ea, 1); spinBtnGfx.fillCircle(W/2, spinY, 38);
  spinBtnGfx.fillStyle(0xc084fc, 0.5); spinBtnGfx.fillCircle(W/2, spinY - 5, 30);
  spinBtnGfx.fillStyle(0x0a0014, 1); spinBtnGfx.fillCircle(W/2, spinY, 28);

  const spinHitArea = this.add.circle(W/2, spinY, 42, 0x000000, 0).setInteractive({ useHandCursor: true });
  this.spinBtnText = this.add.text(W/2, spinY, 'SPIN', {
    fontSize: '18px', fontStyle: 'bold', color: '#c084fc',
    shadow: { offsetX: 0, offsetY: 0, color: '#a855f7', blur: 8, fill: true }
  }).setOrigin(0.5);

  this.spinContainer = this.add.container(0, 0, [spinBtnGfx, spinHitArea, this.spinBtnText]);

  // ============ WAYS TEXT ============
  this.add.text(W/2, panelY + 170, '2,048 WAYS TO WIN', { fontSize: '9px', color: '#6b21a8', letterSpacing: 4 }).setOrigin(0.5);

  spinHitArea.on('pointerdown', () => { if (scene.isSpinning) return; scene.spinContainer.setScale(0.92); scene.startSpin(); });
  spinHitArea.on('pointerup', () => scene.spinContainer.setScale(1));
  spinHitArea.on('pointerout', () => scene.spinContainer.setScale(1));

  // ============ SPIN LOGIC ============
  this.startSpin = () => {
    if (scene.isSpinning) return;
    const fs = scene.freeSpinState;

    if (!fs.active) {
      if (scene.balance < scene.betAmount) return;
      scene.balance -= scene.betAmount;
      scene.balanceText.setText(scene.balance.toLocaleString());
    }

    scene.isSpinning = true;
    scene.totalWin = 0;
    scene.winAmountText.setText('0');
    scene.winText.setAlpha(0);
    scene.currentMultiplierIndex = 0;
    scene.multiplierText.setAlpha(0);
    scene.spinBtnText.setText('...');

    // Spin out old tiles
    for (let c = 0; c < scene.cols; c++) {
      scene.grid[c].forEach(tile => {
        scene.tweens.add({
          targets: tile, y: tile.y + 500, alpha: 0, duration: 600, delay: c * 40, ease: 'Power2',
          onComplete: () => tile.destroy()
        });
      });
      scene.grid[c] = [];
    }

    // Generate new grid
    scene.logicGrid = ReelManager.generateGrid(fs.active);

    // Dragon mode features
    if (fs.active && fs.expandingWild) {
      scene.logicGrid = DragonModeManager.applyExpandingWild(scene.logicGrid);
    }
    if (fs.active && fs.randomWildReel) {
      scene.logicGrid = DragonModeManager.applyRandomWildReel(scene.logicGrid);
    }

    // Check scatters before dropping
    const scatterCounts = WaysCalculator.countScatters(scene.logicGrid);
    const scatterResult = ScatterSystem.evaluate(scatterCounts);

    if (scatterResult && !fs.active) {
      scene.freeSpinState = FreeSpinManager.activate(scatterResult.tier, scatterResult.freeSpins);
      scene.fsText.setText('🐉 ' + scatterResult.tier.type.toUpperCase() + ' DRAGON — ' + scatterResult.freeSpins + ' FREE SPINS!');
      scene.fsText.setAlpha(1);
      scene.tweens.add({ targets: scene.fsText, scaleX: 1.3, scaleY: 1.3, duration: 200, yoyo: true });
    }

    // Drop new tiles
    scene.time.delayedCall(350, () => {
      let tilesLanded = 0;
      const totalTiles = scene.cols * scene.rows;

      for (let c = 0; c < scene.cols; c++) {
        for (let r = 0; r < scene.rows; r++) {
          const symKey = scene.logicGrid[c][r];
          const finalY = scene.startY + r * scene.spacingY;
          const tile = scene.createTile(c, r, finalY - 450, symKey);
          tile.setAlpha(0);
          scene.grid[c].push(tile);

          scene.time.delayedCall(c * 80 + r * 25, () => {
            tile.setAlpha(1);
            scene.tweens.add({
              targets: tile, y: finalY + 12, duration: 280, ease: 'Power3',
              onComplete: () => {
                scene.tweens.add({
                  targets: tile, y: finalY - 4, duration: 100,
                  onComplete: () => {
                    scene.tweens.add({
                      targets: tile, y: finalY, duration: 60,
                      onComplete: () => {
                        const flash = scene.add.rectangle(tile.x, tile.y, scene.tileW, scene.tileH, 0xffffff, 0.2);
                        scene.tweens.add({ targets: flash, alpha: 0, duration: 150, onComplete: () => flash.destroy() });
                        tilesLanded++;
                        if (tilesLanded === totalTiles) {
                          scene.time.delayedCall(200, () => scene.checkWin(1));
                        }
                      }
                    });
                  }
                });
              }
            });
          });
        }
      }
    });
  };

  // ============ WIN CHECK ============
  this.checkWin = (cascadeRound) => {
    const wins = WaysCalculator.calculateWins(scene.logicGrid, scene.betAmount);

    if (wins.length === 0) {
      scene.lockedWilds = GoldenTransform.tickLocks(scene.lockedWilds);

      if (scene.totalWin > 0) {
        scene.balance += scene.totalWin;
        scene.balanceText.setText(scene.balance.toLocaleString());
        scene.winText.setText('🏆 TOTAL WIN: ' + scene.totalWin.toLocaleString() + ' 🏆');
        scene.winText.setAlpha(1);
        scene.tweens.add({ targets: scene.winText, scaleX: 1.2, scaleY: 1.2, duration: 200, yoyo: true });
      }

      // Tick free spins
      if (scene.freeSpinState.active) {
        scene.freeSpinState = FreeSpinManager.tick(scene.freeSpinState);
        if (scene.freeSpinState.active) {
          scene.fsText.setText('FREE SPINS: ' + scene.freeSpinState.spinsRemaining + ' left');
          scene.fsText.setAlpha(1);
          // Auto spin next free spin
          scene.time.delayedCall(1500, () => {
            scene.isSpinning = false;
            scene.spinBtnText.setText('SPIN');
            scene.startSpin();
          });
          return;
        } else {
          scene.fsText.setText('🐉 DRAGON MODE COMPLETE!');
          scene.tweens.add({ targets: scene.fsText, alpha: 0, duration: 3000, delay: 1500 });
        }
      }

      scene.isSpinning = false;
      scene.spinBtnText.setText('SPIN');
      return;
    }

    // Golden transform
    const transformed = GoldenTransform.transform(scene.logicGrid, wins);
    scene.logicGrid = transformed.grid;
    scene.lockedWilds = [...scene.lockedWilds, ...transformed.newLocks];

    // Calculate win
    const roundWin = WinManager.applyMultiplier(wins, cascadeRound, scene.freeSpinState.globalMultiplier);
    const mult = MultiplierManager.getCascadeMultiplier(cascadeRound);
    scene.totalWin += roundWin;
    scene.winAmountText.setText(scene.totalWin.toLocaleString());

    scene.multiplierText.setText('⚡ CASCADE x' + mult + ' ⚡');
    scene.multiplierText.setAlpha(1);
    scene.tweens.add({ targets: scene.multiplierText, scaleX: 1.3, scaleY: 1.3, duration: 150, yoyo: true });

    scene.winText.setText('+' + roundWin.toLocaleString());
    scene.winText.setAlpha(1);
    scene.tweens.add({ targets: scene.winText, scaleX: 1.2, scaleY: 1.2, duration: 200, yoyo: true });

    // Animate exploding tiles
    const exploding = CascadeManager.getExplodingPositions(wins);
    const winTiles = [];
    for (const key of exploding) {
      const [c, r] = key.split(',').map(Number);
      if (scene.grid[c] && scene.grid[c][r]) winTiles.push({ tile: scene.grid[c][r], col: c, row: r });
    }

    // Glow
    winTiles.forEach((wt, i) => {
      const glow = scene.add.rectangle(wt.tile.x, wt.tile.y, scene.tileW + 10, scene.tileH + 10, 0x9333ea, 0.5);
      scene.tweens.add({ targets: glow, alpha: 0, scaleX: 1.5, scaleY: 1.5, duration: 400, delay: i * 30, onComplete: () => glow.destroy() });
    });

    // Destroy + particles
    scene.time.delayedCall(500, () => {
      const tilesToDestroy = winTiles.map(wt => wt.tile);
      scene.tweens.add({
        targets: tilesToDestroy, scaleX: 0, scaleY: 0, alpha: 0, duration: 300, ease: 'Back.easeIn',
        onComplete: () => {
          tilesToDestroy.forEach(t => {
            for (let p = 0; p < 6; p++) {
              const particle = scene.add.circle(
                t.x + Phaser.Math.Between(-20, 20), t.y + Phaser.Math.Between(-20, 20),
                Phaser.Math.Between(2, 5), 0xa855f7
              );
              scene.tweens.add({
                targets: particle, y: particle.y - Phaser.Math.Between(40, 100),
                x: particle.x + Phaser.Math.Between(-50, 50), alpha: 0,
                duration: Phaser.Math.Between(400, 800), onComplete: () => particle.destroy()
              });
            }
            t.destroy();
          });

          // Update logic grid: remove, gravity, refill
          scene.logicGrid = CascadeManager.removeWinningSymbols(scene.logicGrid, wins);
          scene.logicGrid = CascadeManager.applyGravity(scene.logicGrid);
          scene.logicGrid = ReelManager.refillGrid(scene.logicGrid, scene.freeSpinState.active);

          // Dragon mode on refill
          if (scene.freeSpinState.active && scene.freeSpinState.expandingWild) {
            scene.logicGrid = DragonModeManager.applyExpandingWild(scene.logicGrid);
          }

          scene.cascadeDown(cascadeRound + 1);
        }
      });
    });
  };

  // ============ CASCADE DOWN ============
  this.cascadeDown = (nextRound) => {
    // Rebuild all visual tiles from logicGrid
    for (let c = 0; c < scene.cols; c++) {
      scene.grid[c].forEach(t => { if (t && t.active) t.destroy(); });
      scene.grid[c] = [];
    }

    let tilesLanded = 0;
    const totalTiles = scene.cols * scene.rows;

    for (let c = 0; c < scene.cols; c++) {
      for (let r = 0; r < scene.rows; r++) {
        const symKey = scene.logicGrid[c][r];
        const finalY = scene.startY + r * scene.spacingY;
        const tile = scene.createTile(c, r, finalY - 200, symKey);
        tile.setAlpha(0);
        scene.grid[c].push(tile);

        scene.time.delayedCall(c * 40 + r * 20, () => {
          tile.setAlpha(1);
          scene.tweens.add({
            targets: tile, y: finalY, duration: 450, ease: 'Bounce.easeOut',
            onComplete: () => {
              tilesLanded++;
              if (tilesLanded === totalTiles) {
                scene.time.delayedCall(300, () => scene.checkWin(nextRound));
              }
            }
          });
        });
      }
    }
  };
}
