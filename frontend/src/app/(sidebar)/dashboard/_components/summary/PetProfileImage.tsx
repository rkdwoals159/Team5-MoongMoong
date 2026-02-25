"use client";

import { useState } from "react";
import type { PetProfileImageProps } from "@/app/(sidebar)/dashboard/_types";
import Image from "@/components/common/Image/Image";
import PetImageChangeModal from "@/app/(sidebar)/dashboard/_components/image-modal/PetImageChangeModal";
import { IMAGE_SIZE, IMAGE_OVERLAY_TEXT } from "@/app/(sidebar)/dashboard/_constants";

const PetProfileImage = ({ petImageUrl }: PetProfileImageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(petImageUrl);

  const handleImageChange = () => {
    setIsModalOpen(true);
  };

  if (!imageUrl)
    return (
      <div className="size-[210px] shrink-0 overflow-hidden border bg-gray-500 border-border-light rounded-700"></div>
    );
  return (
    <>
      <div className="size-[210px] shrink-0 overflow-hidden border border-border-light rounded-700">
        <Image
          src={imageUrl}
          alt="강아지 이미지"
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          isHoverable={true}
          onImageChange={handleImageChange}
          overlayText={IMAGE_OVERLAY_TEXT}
        />
      </div>
      <PetImageChangeModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageChange={setImageUrl}
        currentImageUrl={imageUrl}
      />
    </>
  );
};

export default PetProfileImage;
