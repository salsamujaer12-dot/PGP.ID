const DragonModeManager = {
  applyExpandingWild(grid) {
    const g = grid.map(col => [...col]);
    for (let c = 0; c < PAYTABLE.REELS; c++) {
      if (g[c].some(s => s === 'WILD')) {
        for (let r = 0; r < PAYTABLE.ROWS; r++) g[c][r] = 'WILD';
      }
    }
    return g;
  },

  applyRandomWildReel(grid) {
    const g = grid.map(col => [...col]);
    const ri = Math.floor(Math.random() * PAYTABLE.REELS);
    for (let r = 0; r < PAYTABLE.ROWS; r++) g[ri][r] = 'WILD';
    return g;
  }
};
