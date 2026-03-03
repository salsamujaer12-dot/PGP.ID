const GoldenTransform = {
  transform(grid, wins) {
    const newGrid = grid.map(col => [...col]);
    const newLocks = [];
    for (const win of wins) {
      for (const [col, row] of win.positions) {
        if (newGrid[col][row] === 'GOLDEN') {
          newGrid[col][row] = 'WILD';
          newLocks.push({ col, row, remainingCascades: 1 });
        }
      }
    }
    return { grid: newGrid, newLocks };
  },

  tickLocks(locks) {
    return locks.map(l => ({ ...l, remainingCascades: l.remainingCascades - 1 }))
                .filter(l => l.remainingCascades > 0);
  }
};
