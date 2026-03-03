const MultiplierManager = {
  getCascadeMultiplier(round) {
    if (round <= 0) return 1;
    const mults = RTP_CONFIG.cascadeMultipliers;
    if (round - 1 < mults.length) return mults[round - 1];
    return RTP_CONFIG.maxCascadeMultiplier;
  }
};
