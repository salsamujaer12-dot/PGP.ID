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
this.reelSpeeds = [0, 0, 0, 0, 0];
this.reelTargetSpeeds = [0, 0, 0, 0, 0];
this.reelAcceleration = 0.5;
this.reelDeceleration = 0.3;
this.reelStates = ['stopped', 'stopped', 'stopped', 'stopped', 'stopped'];
this.reelStopDelays = [0, 100, 200, 300, 400];
this.spinDuration = 2000;
this.spinStartTime = 0;
this.reelContainers = [];

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
// HAPUS method startSpin yang lama dan ganti dengan ini:

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

  // Reset reel states
  scene.reelStates = ['spinning', 'spinning', 'spinning', 'spinning', 'spinning'];
  scene.reelTargetSpeeds = [15, 15, 15, 15, 15];
  scene.spinStartTime = scene.time.now;

  // Hapus semua tiles lama dengan efek blur
  scene.grid.forEach((column, colIndex) => {
    column.forEach(tile => {
      scene.tweens.add({
        targets: tile,
        scaleX: 0.8,
        scaleY: 0.8,
        alpha: 0,
        y: tile.y + 100,
        duration: 300,
        delay: colIndex * 50,
        ease: 'Power2',
        onComplete: () => tile.destroy()
      });
    });
    scene.grid[colIndex] = [];
  });

  // Generate grid baru
  scene.logicGrid = ReelManager.generateGrid(fs.active);

  // Dragon mode features
  if (fs.active && fs.expandingWild) {
    scene.logicGrid = DragonModeManager.applyExpandingWild(scene.logicGrid);
  }
  if (fs.active && fs.randomWildReel) {
    scene.logicGrid = DragonModeManager.applyRandomWildReel(scene.logicGrid);
  }

  // Check scatters
  const scatterCounts = WaysCalculator.countScatters(scene.logicGrid);
  const scatterResult = ScatterSystem.evaluate(scatterCounts);

  if (scatterResult && !fs.active) {
    scene.freeSpinState = FreeSpinManager.activate(scatterResult.tier, scatterResult.freeSpins);
    scene.fsText.setText('🐉 ' + scatterResult.tier.type.toUpperCase() + ' DRAGON — ' + scatterResult.freeSpins + ' FREE SPINS!');
    scene.fsText.setAlpha(1);
    scene.tweens.add({ targets: scene.fsText, scaleX: 1.3, scaleY: 1.3, duration: 200, yoyo: true });
  }

  // Mulai animasi reel spinning
  scene.startReelAnimation();
};

// ============ METHOD BARU: ANIMASI REEL SPINNING ============
this.startReelAnimation = () => {
  // Buat container untuk setiap reel dengan tiles tambahan untuk efek loop
  scene.reelContainers = [];
  
  for (let c = 0; c < scene.cols; c++) {
    const container = scene.add.container(scene.startX + c * scene.spacingX, scene.startY);
    container.setMask(scene.tileMask);
    scene.reelContainers.push(container);
    
    // Buat lebih banyak tiles untuk efek loop yang smooth
    const totalTilesInReel = scene.rows + 6; // 3 di atas, 3 di bawah
    
    for (let i = 0; i < totalTilesInReel; i++) {
      const row = i - 3; // Mulai dari -3 sampai rows+2
      const yPos = row * scene.spacingY;
      
      // Pilih simbol random untuk efek spinning
      const symbols = Object.keys(PAYTABLE.SYMBOLS);
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      
      const tile = scene.createTile(c, row, yPos, randomSymbol);
      tile.setData('isSpinning', true);
      container.add(tile);
    }
  }

  // Update loop untuk animasi reel
  scene.time.addEvent({
    delay: 16, // ~60fps
    callback: scene.updateReelAnimation,
    callbackScope: scene,
    loop: true
  });

  // Set waktu stop untuk setiap reel
  for (let c = 0; c < scene.cols; c++) {
    scene.time.delayedCall(scene.spinDuration + scene.reelStopDelays[c], () => {
      scene.stopReel(c);
    });
  }
};

// ============ METHOD BARU: UPDATE ANIMASI REEL ============
this.updateReelAnimation = () => {
  const now = scene.time.now;
  const elapsed = now - scene.spinStartTime;
  
  for (let c = 0; c < scene.cols; c++) {
    if (scene.reelStates[c] === 'stopped') continue;
    
    // Update kecepatan
    if (scene.reelSpeeds[c] < scene.reelTargetSpeeds[c]) {
      scene.reelSpeeds[c] += scene.reelAcceleration;
    }
    
    // Perlambatan jika akan berhenti
    if (scene.reelStates[c] === 'stopping' && scene.reelSpeeds[c] > 0) {
      scene.reelSpeeds[c] -= scene.reelDeceleration;
      if (scene.reelSpeeds[c] <= 0) {
        scene.reelSpeeds[c] = 0;
        scene.reelStates[c] = 'stopped';
        scene.finalizeReel(c);
        continue;
      }
    }
    
    // Gerakkan tiles dalam container
    const container = scene.reelContainers[c];
    if (!container) continue;
    
    container.y += scene.reelSpeeds[c];
    
    // Efek blur pada tiles yang bergerak cepat
    if (scene.reelSpeeds[c] > 5) {
      container.list.forEach(child => {
        if (child.getData('isSpinning')) {
          child.alpha = 0.7 + Math.sin(now * 0.01 + c) * 0.3;
        }
      });
    }
    
    // Loop tiles yang keluar dari viewport
    if (container.y > scene.startY + scene.spacingY) {
      container.y -= scene.spacingY;
      
      // Ambil tile paling atas, pindahkan ke bawah dengan simbol baru
      const topTile = container.getAt(0);
      if (topTile) {
        container.moveTo(topTile, container.length - 1);
        topTile.y += scene.spacingY * (scene.rows + 6);
        
        // Update simbol untuk efek variasi
        const symbols = Object.keys(PAYTABLE.SYMBOLS);
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        topTile.symbolKey = randomSymbol;
        topTile.list[2].setText(PAYTABLE.SYMBOLS[randomSymbol]?.label || '?');
      }
    }
  }
  
  // Cek apakah semua reel sudah berhenti
  if (scene.reelStates.every(state => state === 'stopped')) {
    scene.onAllReelsStopped();
  }
};

// ============ METHOD BARU: STOP REEL ============
this.stopReel = (reelIndex) => {
  if (scene.reelStates[reelIndex] !== 'spinning') return;
  
  scene.reelStates[reelIndex] = 'stopping';
  scene.reelTargetSpeeds[reelIndex] = 0;
  
  // Efek partikel saat reel berhenti
  const container = scene.reelContainers[reelIndex];
  if (container) {
    for (let i = 0; i < 5; i++) {
      const particle = scene.add.circle(
        container.x,
        container.y + Phaser.Math.Between(-100, 100),
        Phaser.Math.Between(2, 4),
        0x9333ea
      );
      
      scene.tweens.add({
        targets: particle,
        y: particle.y - Phaser.Math.Between(20, 50),
        alpha: 0,
        scale: 0,
        duration: 500,
        onComplete: () => particle.destroy()
      });
    }
  }
};

// ============ METHOD BARU: FINALIZE REEL ============
this.finalizeReel = (reelIndex) => {
  const container = scene.reelContainers[reelIndex];
  if (!container) return;
  
  // Snap ke posisi yang tepat
  const targetY = scene.startY;
  const offset = container.y - targetY;
  const snapOffset = Math.round(offset / scene.spacingY) * scene.spacingY;
  container.y = targetY + snapOffset;
  
  // Update visual tiles dengan simbol yang benar dari logicGrid
  for (let r = 0; r < scene.rows; r++) {
    const tile = container.getAt(r + 3); // +3 karena ada buffer di atas
    if (tile) {
      const symbolKey = scene.logicGrid[reelIndex][r];
      tile.symbolKey = symbolKey;
      tile.list[2].setText(PAYTABLE.SYMBOLS[symbolKey]?.label || '?');
      
      // Reset efek spinning
      tile.setData('isSpinning', false);
      tile.alpha = 1;
      
      // Simpan ke grid untuk win checking
      if (!scene.grid[reelIndex]) scene.grid[reelIndex] = [];
      scene.grid[reelIndex][r] = tile;
      
      // Efek landing
      scene.tweens.add({
        targets: tile,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
        yoyo: true,
        ease: 'Bounce.easeOut'
      });
    }
  }
  
  // Hapus reel container setelah semua selesai
  scene.time.delayedCall(500, () => {
    if (scene.reelContainers[reelIndex]) {
      scene.reelContainers[reelIndex].destroy();
      scene.reelContainers[reelIndex] = null;
    }
  });
};

// ============ METHOD BARU: ON ALL REELS STOPPED ============
this.onAllReelsStopped = () => {
  // Hapus event loop
  scene.time.removeAllEvents();
  
  // Tunggu sebentar lalu check win
  scene.time.delayedCall(500, () => {
    scene.checkWin(1);
  });
};

// ============ UPDATE CASCADE DOWN ============
this.cascadeDown = (nextRound) => {
  // Hapus semua reel containers yang tersisa
  scene.reelContainers?.forEach(container => {
    if (container) container.destroy();
  });
  scene.reelContainers = [];
  
  // Rebuild visual tiles dari logicGrid dengan animasi cascade
  for (let c = 0; c < scene.cols; c++) {
    // Hapus tiles lama
    if (scene.grid[c]) {
      scene.grid[c].forEach(tile => {
        if (tile && tile.active) tile.destroy();
      });
    }
    scene.grid[c] = [];
    
    // Buat tiles baru dengan animasi cascade
    for (let r = 0; r < scene.rows; r++) {
      const symKey = scene.logicGrid[c][r];
      const finalY = scene.startY + r * scene.spacingY;
      const startY = finalY - (scene.rows - r) * 50; // Start dari atas dengan offset berbeda
      
      const tile = scene.createTile(c, r, startY, symKey);
      tile.setAlpha(0);
      scene.grid[c].push(tile);
      
      // Animasi cascade dengan delay per kolom dan baris
      scene.time.delayedCall(c * 100 + r * 50, () => {
        tile.setAlpha(1);
        scene.tweens.add({
          targets: tile,
          y: finalY,
          duration: 400 + r * 50, // Lebih lama untuk tiles di bawah
          ease: 'Bounce.easeOut',
          onComplete: () => {
            // Efek ripple saat mendarat
            const ripple = scene.add.circle(tile.x, tile.y, 5, 0x9333ea, 0.5);
            scene.tweens.add({
              targets: ripple,
              radius: scene.tileW / 2,
              alpha: 0,
              duration: 300,
              onComplete: () => ripple.destroy()
            });
            
            // Cek apakah semua tiles sudah mendarat
            const allLanded = scene.grid.flat().every(t => 
              Math.abs(t.y - (scene.startY + scene.grid[0].indexOf(t) * scene.spacingY)) < 1
            );
            
            if (allLanded) {
              scene.time.delayedCall(300, () => scene.checkWin(nextRound));
            }
          }
        });
      });
    }
  }
};
