// AnimationManager.js - Versi enhanced
class AnimationManager {
    constructor(scene) {
        this.scene = scene;
        this.tweens = scene.tweens;
        this.particles = scene.add.particles('particle');
        
        // Animation presets
        this.presets = {
            reelSpin: {
                duration: 800,
                ease: 'Cubic.easeOut',
                yoyo: false,
                repeat: 0
            },
            symbolLand: {
                duration: 300,
                ease: 'Bounce.easeOut',
                scale: { from: 1.2, to: 1 }
            },
            winHighlight: {
                duration: 500,
                alpha: { from: 0, to: 1 },
                scale: { from: 1, to: 1.3 },
                yoyo: true,
                repeat: 3
            },
            cascadeFall: {
                duration: 400,
                ease: 'Power2',
                y: '+=200'
            }
        };
    }
    
    // Enhanced reel spin with blur effect
    spinReel(reel, speed = 1) {
        const tiles = reel.children;
        
        // Acceleration phase
        this.tweens.add({
            targets: tiles,
            y: `+=${this.scene.spacingY * 3}`,
            duration: 200 / speed,
            ease: 'Power1',
            yoyo: false,
            repeat: 6,
            onUpdate: (tween, target) => {
                // Add motion blur effect
                target.alpha = 0.7 + Math.sin(tween.progress * Math.PI) * 0.3;
            },
            onComplete: () => {
                // Deceleration phase
                this.tweens.add({
                    targets: tiles,
                    y: `+=${this.scene.spacingY}`,
                    duration: 400 / speed,
                    ease: 'Back.easeOut',
                    onComplete: () => this.landSymbols(reel)
                });
            }
        });
    }
    
    // PG Soft-style win animation
    animateWin(symbols, winAmount) {
        // 1. Pulse effect on winning symbols
        symbols.forEach((symbol, index) => {
            this.tweens.add({
                targets: symbol,
                scaleX: 1.3,
                scaleY: 1.3,
                duration: 200,
                delay: index * 50,
                yoyo: true,
                repeat: 2,
                ease: 'Sine.easeInOut'
            });
            
            // 2. Glow effect
            const glow = this.scene.add.graphics();
            glow.fillStyle(0xFFFF00, 0.3);
            glow.fillCircle(symbol.x, symbol.y, 40);
            
            this.tweens.add({
                targets: glow,
                alpha: 0,
                scale: 1.5,
                duration: 600,
                onComplete: () => glow.destroy()
            });
        });
        
        // 3. Particle explosion
        this.createWinParticles(symbols);
        
        // 4. Win text animation
        this.animateWinText(winAmount);
    }
    
    createWinParticles(symbols) {
        symbols.forEach(symbol => {
            for (let i = 0; i < 15; i++) {
                const particle = this.scene.add.circle(
                    symbol.x,
                    symbol.y,
                    Phaser.Math.Between(2, 6),
                    0xFFD700
                );
                
                this.tweens.add({
                    targets: particle,
                    x: symbol.x + Phaser.Math.Between(-100, 100),
                    y: symbol.y - Phaser.Math.Between(50, 150),
                    alpha: 0,
                    scale: 0,
                    duration: Phaser.Math.Between(600, 1000),
                    onComplete: () => particle.destroy()
                });
            }
        });
    }
    
    // More methods for cascade, free spin activation, etc...
}
