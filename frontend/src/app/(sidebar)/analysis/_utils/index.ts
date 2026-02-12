export const formatRatio = (ratio?: number) =>
  ratio == null ? 0 : ratio <= 1 ? Math.round(ratio * 100) : Math.round(ratio);
