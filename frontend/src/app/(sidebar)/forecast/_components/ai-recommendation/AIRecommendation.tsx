import MedicalIcon from "@/assets/icons/forecast/medical_icon.svg";
import InfoTooltip from "@/components/common/InfoTooltip/InfoTooltip";
import { AIRecommendationProps } from "@/app/(sidebar)/forecast/forecast.type";
import { TITLE_TEXT, TOOLTIP_DESCRIPTION } from "@/app/(sidebar)/forecast/forecast.constants";

/**
 * AIRecommendation 컴포넌트
 * @param predictionDetails - 예측 결과 상세 설명
 * @param predictionAmount - 예측 결과 금액
 * @returns AIRecommendation 컴포넌트
 */
const AIRecommendation = ({ predictionDetails, predictionAmount }: AIRecommendationProps) => {
  const currentYear = new Date().getFullYear();
  return (
    <section>
      <div className={containerClasses}>
        <MedicalIcon width={48} height={48} className={iconClasses} />
        <div className={contentClasses}>
          <div>
            <div className={titleRowClasses}>
              <span className={titleClasses}>{TITLE_TEXT}</span>
              <InfoTooltip description={TOOLTIP_DESCRIPTION} iconSize={20} />
            </div>
            <div className={descriptionClasses}>{predictionDetails}</div>
          </div>
          <div>
            <span className={highlightClasses}>
              {currentYear}년 예상 의료비 : {predictionAmount.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIRecommendation;

const containerClasses = "flex gap-500 p-600 rounded-500 bg-yellow-100";
const iconClasses = "shrink-0";
const contentClasses = "flex flex-col gap-500 flex-1";
const titleRowClasses = "flex items-center gap-300";
const titleClasses = "typo-title-m-bold text-text-base";
const descriptionClasses = "typo-body-l-regular text-text-base";
const highlightClasses =
  "typo-body-l-medium text-text-base bg-yellow-150 py-300 px-400 rounded-250";
