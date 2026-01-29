import { DiseaseCode } from "@/app/(sidebar)/forecast/forecast.type";
import { DISEASE_CODE_SHORT_NAMES } from "@/app/(sidebar)/forecast/forecast.constants";

type MedicalExpenseTabsProps = {
  diseaseList: DiseaseCode[];
  selectedDisease: DiseaseCode;
  onSelect: (disease: DiseaseCode) => void;
};

const MedicalExpenseTabs = ({
  diseaseList,
  selectedDisease,
  onSelect,
}: MedicalExpenseTabsProps) => {
  return (
    <div className={tabScrollContainerClasses}>
      <div className={tabScrollClasses}>
        {diseaseList.map((diseaseCode, index) => {
          const label = DISEASE_CODE_SHORT_NAMES[diseaseCode];
          const isSelected = diseaseCode === selectedDisease;
          return (
            <div key={diseaseCode} className="flex items-center">
              <button
                type="button"
                onClick={() => onSelect(diseaseCode)}
                className={`${tabBaseClasses} ${isSelected ? tabSelectedClasses : tabUnselectedClasses}`}
              >
                {index < 3 && <RankingTag rank={index + 1} />}
                {label ?? diseaseCode}
              </button>
              <div className="border-r border-gray-100 h-full" />
            </div>
          );
        })}
      </div>
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-[48px] bg-linear-to-l from-white-100/90 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
};

export default MedicalExpenseTabs;

const RankingTag = ({ rank }: { rank: number }) => {
  return <div className={rankingTagClasses}>{rank}위</div>;
};

const tabScrollContainerClasses = "relative w-full overflow-x-auto no-scrollbar";
const tabScrollClasses = "flex w-full max-w-[1300px] overflow-x-auto no-scrollbar";
const tabBaseClasses =
  "shrink-0 px-500 py-300 w-[150px] flex gap-300 items-center justify-center transition-colors whitespace-nowrap cursor-pointer";
const tabSelectedClasses = "typo-title-s-bold text-gray-900 border-b-2 border-yellow-400";
const tabUnselectedClasses =
  " hover:text-gray-800 text-gray-600 typo-title-s-medium border-b border-gray-100 ";
const rankingTagClasses =
  "flex items-center justify-center bg-gray-100 text-gray-800 typo-caption-s-bold rounded-250 px-300 py-200 w-[30px] h-[24px]";
