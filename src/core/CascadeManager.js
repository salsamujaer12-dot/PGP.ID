const CascadeManager = {
  removeWinningSymbols(grid, wins) {
    const newGrid = grid.map(col => [...col]);
    const toRemove = new Set();
    for (const win of wins) {
      for (const [col, row] of win.positions) {
        toRemove.add(col + ',' + row);
      }
    }
    for (const key of toRemove) {
      const [c, r] = key.split(',').map(Number);
      newGrid[c][r] = null;
    }
    return newGrid;
  },

  applyGravity(grid) {
    return grid.map(col => {
      const filled = col.filter(s => s !== null);
      const empties = PAYTABLE.ROWS - filled.length;
      return [...Array(empties).fill(null), ...filled];
    });
  },

  getExplodingPositions(wins) {
    const positions = new Set();
    for (const win of wins) {
      for (const [col, row] of win.positions) {
        positions.add(col + ',' + row);
      }
    }
    return positions;
  }
};
