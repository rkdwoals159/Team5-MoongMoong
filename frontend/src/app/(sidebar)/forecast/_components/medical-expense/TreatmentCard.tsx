import type { TreatmentResponse } from "@/app/(sidebar)/forecast/_types/medicalExpense";
export default function TreatmentCard({ treatment }: { treatment: TreatmentResponse }) {
  const { name, description, minPrice, maxPrice, averagePrice } = treatment;

  return (
    <div className={cardClasses}>
      <div className={contentClasses}>
        <h1 className={(name?.length ?? 0) > 12 ? nameLongClasses : nameClasses} title={name}>
          {name}
        </h1>
        <p className={descriptionClasses}>{description}</p>
      </div>
      <div className={priceContainerClasses}>
        {minPrice === undefined || maxPrice === undefined || averagePrice === undefined ? (
          <span className={priceLabelClasses}>치료비 데이터가 존재하지 않습니다</span>
        ) : (
          <>
            <span
              className={priceLabelClasses}
            >{`최소 ${minPrice.toLocaleString("ko-KR")}원~최대 ${maxPrice.toLocaleString("ko-KR")}원`}</span>
            <span
              className={averageLabelClasses}
            >{`평균 ${averagePrice.toLocaleString("ko-KR")}원`}</span>
          </>
        )}
      </div>
    </div>
  );
}

// Tailwind CSS classes
const cardClasses =
  "flex flex-col justify-between h-[220px] py-700 px-600 rounded-250 border border-gray-100 bg-gray-10";

const contentClasses = "flex flex-col gap-200";
const nameClasses = "typo-headline-s-bold text-gray-800 line-clamp-1";
const nameLongClasses = "typo-title-s-bold text-gray-800 line-clamp-1";
const descriptionClasses = "typo-body-l-bold text-gray-500 line-clamp-2";

const priceContainerClasses = "flex items-start flex-col";
const priceLabelClasses = "typo-body-l-medium text-gray-300";
const averageLabelClasses = "typo-headline-m-bold text-gray-800";
