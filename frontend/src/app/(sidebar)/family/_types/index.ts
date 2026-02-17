export type DogSex = "female" | "male";

export type DogInfo = {
  imageUrl: string;
  name: string;
  breed: string;
  age: number;
  sex: DogSex;
};

export type FamilyMember = {
  id: number;
  nickname: string;
  joinedAt: string;
  isMe: boolean;
};

export type FamilyInfo = {
  dog: DogInfo;
  code: string;
  members: FamilyMember[];
  maxMembers: number;
};

export type DogInfoSectionProps = {
  dog: DogInfo;
  size?: "compact" | "large";
};

export type FamilyManageModalViewProps = {
  familyInfo: FamilyInfo;
};

export type FamilyManagePageViewProps = {
  familyInfo: FamilyInfo;
};

export type FamilyMemberListProps = {
  members: FamilyMember[];
  maxMembers: number;
};

export type InviteCodeFormProps = {
  isAlone?: boolean;
};

export type ParentingCodeCardProps = {
  code: string;
};
