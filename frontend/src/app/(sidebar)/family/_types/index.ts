export type DogInfoSectionProps = {
  size?: "compact" | "large";
};

export type FamilyErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export type ParticipateGroupResult<T> = {
  data: T | null;
  error: string | null;
};

export type FamilyMemberListProps = {
  members: string[];
};

export type InviteUrlFormProps = {
  isAlone?: boolean;
};

export type GroupInviteUrlCardProps = {
  inviteUrl: string | undefined;
  size?: "compact" | "large";
};
