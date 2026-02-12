export function formatRatio(ratio?: number) {
  return ratio == null ? 0 : ratio <= 1 ? Math.round(ratio * 100) : Math.round(ratio);
}
