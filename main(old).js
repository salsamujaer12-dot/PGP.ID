import Phaser from 'phaser';



const config = {

    type: Phaser.AUTO,

    width: 360,

    height: 640,

    backgroundColor: '#0a2d16',

    parent: 'app',

    scale: {

        mode: Phaser.Scale.FIT,

        autoCenter: Phaser.Scale.CENTER_BOTH

    },

    scene: { preload, create, update }

};



const game = new Phaser.Game(config);



function preload() {

    this.load.image('frame_mahal', 'public/frame.png'); 

}



function create() {

    const screenW = this.cameras.main.width;

    const screenH = this.cameras.main.height;



    // --- STATE & DATA ---

    this.isSpinning = false;

    this.totalWin = 0;

    this.multipliers = [1, 2, 3, 5];

    this.currentMultiIdx = 0;

    this.reelStatus = ['idle', 'idle', 'idle', 'idle', 'idle'];

    this.spinSpeed = [0, 0, 0, 0, 0];



    // --- BACKGROUND & FRAME ---

    this.add.rectangle(screenW/2, screenH/2, screenW, screenH, 0x0a2d16);

    

    // Masking 5 Kolom x 4 Baris (Disesuaikan agar pas di tengah frame)

    const maskShape = this.make.graphics().fillStyle(0xffffff).fillRect(28, 145, 305, 305);

    const mask = maskShape.createGeometryMask();



    // --- REEL SETUP (SISTEM LOOP 10 TILE) ---

    this.reels = [];

    for (let i = 0; i < 5; i++) {

        const reelContainer = this.add.container(60 + (i * 61), 0);

        reelContainer.setMask(mask);

        

        const tiles = [];

        for (let j = 0; j < 10; j++) {

            const tileY = 180 + (j * 75); 

            const tile = createTile(this, 0, tileY);

            reelContainer.add(tile);

            tiles.push(tile);

        }

        this.reels.push({ container: reelContainer, tiles: tiles });

    }



    // --- UI OVERLAY (FRAME DI ATAS) ---

    const frameImg = this.add.image(screenW/2, 320, 'frame_mahal');

    frameImg.setDisplaySize(360, 480);



    // Styling Teks biar lebih "Game"

    const textStyle = { font: 'bold 24px Arial Black', fill: '#fff', stroke: '#000', strokeThickness: 4 };

    const winStyle = { font: 'bold 28px Arial Black', fill: '#ffcc00', stroke: '#632b00', strokeThickness: 5 };



    this.uiMulti = this.add.text(screenW/2, 125, 'x1', textStyle).setOrigin(0.5);

    this.uiWin = this.add.text(screenW/2, 515, 'WIN: 0', winStyle).setOrigin(0.5);

    this.add.text(screenW/2, 100, 'MAHJONG WAYS', { font: 'bold 20px Arial', fill: '#d4af37' }).setOrigin(0.5);



    // --- HELPER: CREATE TILE ---

    function createTile(scene, x, y) {

        const container = scene.add.container(x, y);

        const bg = scene.add.rectangle(0, 0, 56, 70, 0xf6f6f6).setStrokeStyle(3, 0xd4af37);

        // Tambah variasi angka/simbol

        const sym = Phaser.Math.Between(1, 9);

        const txt = scene.add.text(0, 0, sym, { 

            color: sym > 5 ? '#b22222' : '#228b22', 

            fontSize: '28px', 

            fontStyle: 'bold' 

        }).setOrigin(0.5);

        

        container.add([bg, txt]);

        container.symbol = sym;

        return container;

    }



    // --- CORE LOGIC: SPIN & STOP ---

    this.startSpin = () => {

        if (this.isSpinning) return;

        this.isSpinning = true;

        this.currentMultiIdx = 0;

        this.totalWin = 0;

        this.uiWin.setText('WIN: 0');

        this.uiMulti.setText('x1');



        this.reels.forEach((reel, i) => {

            this.reelStatus[i] = 'spinning';

            // Anticipation (Tarik ke atas dikit sebelum meluncur)

            this.tweens.add({

                targets: reel.container,

                y: -15,

                duration: 100,

                onComplete: () => {

                    this.tweens.add({

                        targets: { val: 0 },

                        val: 55, // Speed

                        duration: 300,

                        delay: i * 80,

                        onUpdate: (t) => { this.spinSpeed[i] = t.getValue(); },

                        onComplete: () => {

                            if (i === 4) this.time.delayedCall(1200, () => this.stopReel(0));

                        }

                    });

                }

            });

        });

    };



    this.stopReel = (idx) => {

        if (idx >= 5) return;

        this.reelStatus[idx] = 'stopping';

        this.spinSpeed[idx] = 0;



        this.reels[idx].tiles.forEach(tile => {

            // Kalkulasi Snap yang presisi ke grid 4 baris

            const targetY = Math.round((tile.y - 180) / 75) * 75 + 180;

            this.tweens.add({

                targets: tile,

                y: targetY,

                duration: 600,

                ease: 'Back.easeOut', 

                easeParams: [1.8], // Bounce yang mantap

                onComplete: () => {

                    if (idx === 4) this.time.delayedCall(200, () => this.checkWinMatch());

                }

            });

        });

        this.time.delayedCall(120, () => this.stopReel(idx + 1));

    };



    // --- CASCADE & MATCH LOGIC ---

    this.checkWinMatch = () => {

        let winTiles = [];

        let visibleGrid = [];



        // Ambil ubin yang tampil di lubang frame (4 baris)

        for (let i = 0; i < 5; i++) {

            let col = this.reels[i].tiles.filter(t => t.y >= 150 && t.y <= 460);

            visibleGrid.push(col);

        }



        // Logic sederhana: cek simbol yang sama dari Reel 1

        let reel1Syms = [...new Set(visibleGrid[0].map(t => t.symbol))];

        reel1Syms.forEach(sym => {

            let matchColCount = 1;

            let currentMatchGroup = [visibleGrid[0].filter(t => t.symbol === sym)];



            for (let c = 1; c < 5; c++) {

                let matches = visibleGrid[c].filter(t => t.symbol === sym);

                if (matches.length > 0) {

                    matchColCount++;

                    currentMatchGroup.push(matches);

                } else break;

            }



            if (matchColCount >= 3) {

                currentMatchGroup.forEach(group => winTiles.push(...group));

                this.totalWin += (matchColCount * 1000 * this.multipliers[this.currentMultiIdx]);

            }

        });



        if (winTiles.length > 0) {

            this.uiWin.setText('WIN: ' + this.totalWin);

            // Animasi Pecah (Scale down + Alpha)

            this.tweens.add({

                targets: winTiles,

                scale: 0.3,

                alpha: 0,

                duration: 400,

                onComplete: () => this.handleCascade(winTiles)

            });

        } else {

            this.isSpinning = false;

        }

    };



    this.handleCascade = (exploded) => {

        exploded.forEach(tile => {

            // Reset ubin yang pecah ke atas layar untuk loop berikutnya

            tile.symbol = Phaser.Math.Between(1, 9);

            tile.list[1].setText(tile.symbol); 

            tile.setScale(1).setAlpha(1);

            tile.y -= 750; 

        });



        // Susun ulang posisi Y biar ubin "runtuh"

        this.reels.forEach(reel => {

            reel.tiles.sort((a, b) => b.y - a.y);

            reel.tiles.forEach((t, i) => {

                let targetY = 180 + ((9 - i) * 75);

                this.tweens.add({

                    targets: t,

                    y: targetY,

                    duration: 500,

                    ease: 'Bounce.easeOut'

                });

            });

        });



        // Multiplier naik

        if (this.currentMultiIdx < 3) this.currentMultiIdx++;

        this.uiMulti.setText('x' + this.multipliers[this.currentMultiIdx]);



        this.time.delayedCall(600, () => this.checkWinMatch());

    };



    // Tombol Spin

    const spinBtn = this.add.circle(screenW/2, 580, 40, 0xff0000).setInteractive().setStrokeStyle(4, 0xffffff);

    this.add.text(screenW/2, 580, 'SPIN', { font: 'bold 18px Arial', fill: '#fff' }).setOrigin(0.5);

    spinBtn.on('pointerdown', () => this.startSpin());

}



function update() {

    this.reels.forEach((reel, i) => {

        const speed = this.spinSpeed[i];

        if (this.reelStatus[i] === 'spinning' && speed > 0) {

            reel.tiles.forEach(tile => {

                tile.y += speed;

                // Loop ubin yang keluar bawah ke atas lagi (Endless Loop)

                if (tile.y > 600) {

                    tile.y -= 750;

                    tile.symbol = Phaser.Math.Between(1, 9);

                    tile.list[1].setText(tile.symbol);

                }

            });

        }

    });

}