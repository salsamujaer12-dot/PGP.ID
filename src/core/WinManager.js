const WinManager = {
  applyMultiplier(wins, cascadeRound, globalMultiplier) {
    const cascadeMult = MultiplierManager.getCascadeMultiplier(cascadeRound);
    const total = wins.reduce((sum, w) => sum + w.payout, 0);
    return total * cascadeMult * (globalMultiplier || 1);
  }
};
