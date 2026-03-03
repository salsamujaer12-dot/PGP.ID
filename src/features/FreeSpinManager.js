const FreeSpinManager = {
  create() {
    return { active: false, spinsRemaining: 0, totalSpins: 0, tier: null, globalMultiplier: 1, expandingWild: false, randomWildReel: false };
  },

  activate(tier, freeSpins) {
    return {
      active: true, spinsRemaining: freeSpins, totalSpins: freeSpins, tier,
      globalMultiplier: tier.permanentMultiplier,
      expandingWild: tier.expandingWild,
      randomWildReel: tier.randomWildReel
    };
  },

  tick(state) {
    const remaining = state.spinsRemaining - 1;
    return { ...state, spinsRemaining: remaining, active: remaining > 0 };
  }
};
