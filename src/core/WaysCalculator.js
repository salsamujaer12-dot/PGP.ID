const WaysCalculator = {
  calculateWins(grid, bet) {
    const results = [];
    const syms = PAYTABLE.REGULAR_SYMBOLS;

    for (const symId of syms) {
      if (symId === 'WILD') continue;
      const sym = PAYTABLE.SYMBOLS[symId];
      let ways = 1, count = 0;
      const positions = [];
      let broken = false;

      for (let col = 0; col < PAYTABLE.REELS && !broken; col++) {
        let colMatches = 0;
        for (let row = 0; row < PAYTABLE.ROWS; row++) {
          const cell = grid[col][row];
          const cellSym = PAYTABLE.SYMBOLS[cell];
          if (cell === symId || (cellSym && cellSym.isWild)) {
            colMatches++;
            positions.push([col, row]);
          }
        }
        if (colMatches > 0) { ways *= colMatches; count++; }
        else { broken = true; }
      }

      if (count >= 3 && sym.pays) {
        const payIndex = Math.min(count - 1, sym.pays.length - 1);
        results.push({
          symbolId: symId, count, ways,
          payout: sym.pays[payIndex] * ways * (bet / 20),
          positions
        });
      }
    }
    return results;
  },

  countScatters(grid) {
    const counts = {};
    for (let c = 0; c < PAYTABLE.REELS; c++) {
      for (let r = 0; r < PAYTABLE.ROWS; r++) {
        const sym = PAYTABLE.SYMBOLS[grid[c][r]];
        if (sym && sym.isScatter && sym.scatterType) {
          counts[sym.scatterType] = (counts[sym.scatterType] || 0) + 1;
        }
      }
    }
    return counts;
  }
};
