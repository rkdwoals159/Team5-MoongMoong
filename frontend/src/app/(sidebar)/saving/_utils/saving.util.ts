export const clamp = (value: number, min: number, max: number) => {
  if (min > max) [min, max] = [max, min];
  return Math.min(Math.max(value, min), max);
};

export const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt;
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const calcProgress = (total: number, target: number): number => {
  if (total < 0 || target < 0) return 0;
  return target === 0 ? 0 : Math.min((total / target) * 100, 100);
};
