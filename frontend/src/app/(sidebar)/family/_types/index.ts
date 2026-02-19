export type DogInfoSectionProps = {
  size?: "compact" | "large";
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
