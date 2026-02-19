export default function SkeletonCard() {
  return (
    <div className={cardClasses}>
      <div className={contentClasses}>
        <div className={skeletonNameClasses} />
        <div className={skeletonDescClasses} />
      </div>
      <div className={priceContainerClasses}>
        <div className={priceRowClasses}>
          <div className={skeletonLabelClasses} />
          <div className={skeletonValueClasses} />
        </div>
        <div className={priceRowClasses}>
          <div className={skeletonLabelClasses} />
          <div className={skeletonValueClasses} />
        </div>
        <div className={averagePriceRowClasses}>
          <div className={skeletonLabelClasses} />
          <div className={skeletonAverageValueClasses} />
        </div>
      </div>
    </div>
  );
}

// Tailwind CSS classes
const cardClasses =
  "flex flex-col gap-400 p-500 rounded-400 border border-gray-100 bg-gray-30 animate-pulse";

const contentClasses = "flex flex-col gap-200";
const skeletonNameClasses = "h-[24px] w-[120px] bg-gray-200 rounded-200";
const skeletonDescClasses = "h-[16px] w-full bg-gray-100 rounded-200";

const priceContainerClasses = "flex flex-col gap-100";
const priceRowClasses = "flex items-center justify-between";
const skeletonLabelClasses = "h-[16px] w-[32px] bg-gray-100 rounded-200";
const skeletonValueClasses = "h-[16px] w-[80px] bg-gray-100 rounded-200";

const averagePriceRowClasses = "flex items-center justify-between pt-200 border-t border-gray-100";
const skeletonAverageValueClasses = "h-[20px] w-[100px] bg-gray-200 rounded-200";
