import FilterChip from "@/components/common/FilterChip/FilterChip";
import Button from "@/components/common/Button/Button";

type AnnualDiseaseRiskSelectProps = {
  selectedDiseases: string[];
  unselectedDiseases: string[];
  onReset: () => void;
  onCancel: (label: string) => void;
  onSelect: (label: string) => void;
};

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
      {selectedDiseases.map((label, index) => (
        <FilterChip
          key={label}
          label={label}
          number={index + 1}
          hasCancelIcon
          colorIndicator
          onCancel={() => onCancel(label)}
        />
      ))}
    </div>
    <div className="w-full border-t border-dashed border-gray-100 my-500" />
    <div className="flex flex-wrap gap-300">
      {unselectedDiseases.map((label) => (
        <FilterChip key={label} label={label} onSelect={() => onSelect(label)} />
      ))}
    </div>
  </div>
);

export default AnnualDiseaseRiskSelect;
