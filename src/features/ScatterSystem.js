const ScatterSystem = {
  evaluate(scatterCounts) {
    for (const type of ['golden', 'black', 'red']) {
      const count = scatterCounts[type] || 0;
      if (count >= 3) {
        const tier = SCATTER_CONFIG[type];
        const clamped = Math.min(count, 5);
        return { tier, count: clamped, freeSpins: tier.freeSpins[clamped] || 0 };
      }
    }
    return null;
  }
};
