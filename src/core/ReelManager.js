const ReelManager = {
  weightedRandom(weights) {
    const entries = Object.entries(weights);
    const total = entries.reduce((s, [, w]) => s + w, 0);
    let r = Math.random() * total;
    for (const [sym, w] of entries) {
      r -= w;
      if (r <= 0) return sym;
    }
    return entries[entries.length - 1][0];
  },

  generateGrid(isFreeSpins) {
    const weights = isFreeSpins ? SYMBOL_WEIGHTS.FREE_SPIN : SYMBOL_WEIGHTS.BASE;
    const grid = [];
    for (let c = 0; c < PAYTABLE.REELS; c++) {
      const reel = [];
      for (let r = 0; r < PAYTABLE.ROWS; r++) {
        reel.push(this.weightedRandom(weights));
      }
      grid.push(reel);
    }
    return grid;
  },

  refillGrid(grid, isFreeSpins) {
    const weights = isFreeSpins ? SYMBOL_WEIGHTS.FREE_SPIN : SYMBOL_WEIGHTS.BASE;
    return grid.map(col => col.map(cell => (cell === null) ? this.weightedRandom(weights) : cell));
  }
};
