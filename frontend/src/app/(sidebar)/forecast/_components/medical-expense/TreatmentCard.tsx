import { TreatmentCardProps } from "@/app/(sidebar)/forecast/forecast.type";

const TreatmentCard = ({ treatment }: TreatmentCardProps) => {
  const { name, description, minPrice, maxPrice, averagePrice } = treatment;

  return (
    <div className={cardClasses}>
      <div className={contentClasses}>
        <h1 className={nameClasses}>{name}</h1>
        <p className={descriptionClasses}>{description}</p>
      </div>
      <div className={priceContainerClasses}>
        <span
          className={priceLabelClasses}
        >{`최소 ${minPrice.toLocaleString("ko-KR")}원~최대 ${maxPrice.toLocaleString("ko-KR")}원`}</span>
        <span
          className={averageLabelClasses}
        >{`평균 ${averagePrice.toLocaleString("ko-KR")}원`}</span>
      </div>
    </div>
  );
};

export default TreatmentCard;

// Tailwind CSS classes
const cardClasses =
  "flex flex-col gap-900 py-700 px-600 rounded-250 border border-gray-100 bg-gray-10";

const contentClasses = "flex flex-col gap-200";
const nameClasses = "typo-headline-s-bold text-gray-800";
const descriptionClasses = "typo-body-l-bold text-gray-500 line-clamp-2";

const priceContainerClasses = "flex items-end flex-col";
const priceLabelClasses = "typo-body-l-medium text-gray-300";
const averageLabelClasses = "typo-headline-m-bold text-gray-800";
