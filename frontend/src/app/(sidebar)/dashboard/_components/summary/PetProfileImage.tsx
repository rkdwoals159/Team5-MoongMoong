"use client";

import { PetProfileImageProps } from "@/app/(sidebar)/dashboard/_types";
import Image from "@/components/common/Image/Image";

const PetProfileImage = ({ petImageUrl }: PetProfileImageProps) => {
  // TODO: 이미지 변경 기능 구현
  const handleImageChange = () => {};

  return (
    <div className="size-[210px] shrink-0 overflow-hidden">
      <Image
        src={petImageUrl}
        alt="강아지 이미지"
        width={210}
        height={210}
        isHoverable={true}
        onImageChange={handleImageChange}
        overlayText="강아지 이미지 변경"
      />
    </div>
  );
};

export default PetProfileImage;
