export function formatRatio(ratio?: number) {
  return ratio == null ? 0 : Math.round(ratio);
}
