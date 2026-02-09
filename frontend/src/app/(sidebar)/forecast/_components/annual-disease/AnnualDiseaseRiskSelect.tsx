import FilterChip from "@/components/common/FilterChip/FilterChip";
import Button from "@/components/common/Button/Button";
import { DISEASE_CODE_FULL_NAMES } from "../../_constants";
import { AnnualDiseaseRiskSelectProps } from "@/app/(sidebar)/forecast/_types/annualDiseaseRisk";

const AnnualDiseaseRiskSelect = ({
  selectedDiseases,
  unselectedDiseases,
  onReset,
  onCancel,
  onSelect,
}: AnnualDiseaseRiskSelectProps) => (
  <div className="flex flex-col gap-300 pt-1200">
    <div className="px-300 flex justify-end">
      <Button
        variant="secondary"
        className="w-[100px] typo-body-m-bold"
        size="small"
        onClick={onReset}
      >
        초기화
      </Button>
    </div>
    <div className="flex flex-wrap gap-300">
      {selectedDiseases.map((disease) => (
        <FilterChip
          key={disease.code}
          label={DISEASE_CODE_FULL_NAMES[disease.code]}
          color={disease.color}
          hasCancelIcon
          colorIndicator
          onCancel={() => onCancel(disease.code)}
        />
      ))}
    </div>
    <div className="w-full border-t border-dashed border-gray-100 my-500" />
    <div className="flex flex-wrap gap-300">
      {unselectedDiseases.map((code) => (
        <FilterChip
          key={code}
          label={DISEASE_CODE_FULL_NAMES[code]}
          onSelect={() => onSelect(code)}
        />
      ))}
    </div>
  </div>
);

export default AnnualDiseaseRiskSelect;
