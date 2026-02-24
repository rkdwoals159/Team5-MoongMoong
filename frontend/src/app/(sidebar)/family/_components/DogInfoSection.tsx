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
import { getPetInfo } from "@/api/server/petApi";
import { BREEDS } from "@/app/onBoarding/_constants/dataTable";
import ServerComponentErrorFallback from "@/components/ui/ErrorBoundary/ServerComponentErrorFallback";
import { safeServerFetch } from "@/api/lib/client";

export default async function DogInfoSection({ size = "compact" }: DogInfoSectionProps) {
  const isLarge = size === "large";

  const petInfo = await safeServerFetch(() => getPetInfo());
  if (petInfo instanceof Error) {
    return <ServerComponentErrorFallback message={petInfo.message} />;
  }

  if (!petInfo) {
    return <DefaultDogInfoSection size={size} />;
  }

  const SexIcon = petInfo.gender === "F" ? FemaleIcon : MaleIcon;

  return (
    <div className="flex items-center gap-500">
      <Image
        src="/images/img_dog_default.svg" // TODO: 이미지 api 연결
        alt={`${petInfo.petName} 프로필`}
        width={isLarge ? LARGE_SIZE : COMPACT_SIZE}
        height={isLarge ? LARGE_SIZE : COMPACT_SIZE}
        className={cn("rounded-400 object-cover", SIZE_VARIANT_CLASSNAMES[size])}
      />
      <div className="flex flex-col">
        <p className={cn("text-base", isLarge ? "typo-title-l-bold" : "typo-title-m-bold")}>
          {petInfo.petName}
        </p>
        <div className="flex items-center gap-200">
          <span className="typo-caption-s-regular text-gray-500">
            {BREEDS[petInfo.breed ?? "ETC"]}
          </span>
          <Dot />
          <span className="typo-caption-s-regular text-gray-500">{petInfo.birthDate}</span>
          <Dot />
          <SexIcon className="size-3" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

// 내장 컴포넌트

function Dot() {
  return <span className="inline-block size-[2px] rounded-full bg-gray-300" />;
}

function DefaultDogInfoSection({ size }: { size: "compact" | "large" }) {
  const isLarge = size === "large";

  return (
    <div className="flex items-center gap-500">
      <div
        className={cn("rounded-400 bg-gray-100", SIZE_VARIANT_CLASSNAMES[size])}
        style={{
          width: isLarge ? LARGE_SIZE : COMPACT_SIZE,
          height: isLarge ? LARGE_SIZE : COMPACT_SIZE,
        }}
      />
      <p className="typo-caption-s-regular text-gray-400">반려동물 정보를 불러올 수 없습니다</p>
    </div>
  );
}
