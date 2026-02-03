export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt;
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const calcProgress = (total: number, target: number): number =>
  target === 0 ? 0 : Math.min((total / target) * 100, 100);
