import { cn } from "@/utils/style";
import FemaleIcon from "@/assets/icons/family/ic_female.svg";
import MaleIcon from "@/assets/icons/family/ic_male.svg";
import Image from "next/image";
import type { DogInfoSectionProps } from "@/app/(sidebar)/family/_types";
import {
  SIZE_VARIANT_CLASSNAMES,
  LARGE_SIZE,
  COMPACT_SIZE,
} from "@/app/(sidebar)/family/_constants";

export default function DogInfoSection({ dog, size = "compact" }: DogInfoSectionProps) {
  const SexIcon = dog.sex === "female" ? FemaleIcon : MaleIcon;
  const isLarge = size === "large";

  return (
    <div className="flex items-center gap-500">
      <Image
        src={dog.imageUrl}
        alt={`${dog.name} 프로필`}
        width={isLarge ? LARGE_SIZE : COMPACT_SIZE}
        height={isLarge ? LARGE_SIZE : COMPACT_SIZE}
        className={cn("rounded-400 object-cover", SIZE_VARIANT_CLASSNAMES[size])}
      />
      <div className="flex flex-col">
        <p className={cn("text-base", isLarge ? "typo-title-l-bold" : "typo-title-m-bold")}>
          {dog.name}
        </p>
        <div className="flex items-center gap-200">
          <span className="typo-caption-s-regular text-gray-500">{dog.breed}</span>
          <Dot />
          <span className="typo-caption-s-regular text-gray-500">{dog.age}세</span>
          <Dot />
          <SexIcon className="size-3" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function Dot() {
  return <span className="inline-block size-[2px] rounded-full bg-gray-300" />;
}
