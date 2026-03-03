export default class AnimationManager {

  static spinOut(scene, grid) {
    for (let c = 0; c < scene.cols; c++) {
      grid[c].forEach(tile => {
        scene.tweens.add({
          targets: tile,
          y: tile.y + 500,
          alpha: 0,
          duration: 600,
          delay: c * 40,
          ease: 'Power2',
          onComplete: () => tile.destroy()
        });
      });
      grid[c] = [];
    }
  }

  static dropNewTiles(scene, callback) {
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
            targets: tile,
            y: finalY,
            duration: 350,
            ease: 'Power3',
            onComplete: () => {
              tilesLanded++;
              if (tilesLanded === totalTiles && callback) {
                callback();
              }
            }
          });
        });
      }
    }
  }

  static explodeTiles(scene, winTiles, callback) {

    const tilesToDestroy = winTiles.map(wt => wt.tile);

    scene.tweens.add({
      targets: tilesToDestroy,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 300,
      ease: 'Back.easeIn',
      onComplete: () => {

        tilesToDestroy.forEach(t => {

          for (let p = 0; p < 6; p++) {
            const particle = scene.add.circle(
              t.x,
              t.y,
              Phaser.Math.Between(2, 5),
              0xa855f7
            );

            scene.tweens.add({
              targets: particle,
              y: particle.y - 80,
              alpha: 0,
              duration: 600,
              onComplete: () => particle.destroy()
            });
          }

          t.destroy();
        });

        if (callback) callback();
      }
    });
  }

  static cascadeDown(scene, nextRound, callback) {

    for (let c = 0; c < scene.cols; c++) {
      scene.grid[c].forEach(t => t.destroy());
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
            targets: tile,
            y: finalY,
            duration: 450,
            ease: 'Bounce.easeOut',
            onComplete: () => {
              tilesLanded++;
              if (tilesLanded === totalTiles && callback) {
                callback(nextRound);
              }
            }
          });
        });
      }
    }
  }
}