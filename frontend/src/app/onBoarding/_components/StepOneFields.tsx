"use client";

import WarningIcon from "@/assets/icons/components/warning.svg";
import { MAX_PET_NAME_LENGTH } from "@/app/onBoarding/_constants";
import type { StepOneFieldsProps } from "@/app/onBoarding/_types";
import { BREED_LABEL_OPTIONS } from "@/app/onBoarding/_lib";
import TextInput from "@/components/common/Input/TextInput";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import SelectChip from "@/components/common/SelectChip/SelectChip";
import FormField from "./FormField";

/**
 * 온보딩 1단계(기본 정보 입력) 필드를 렌더링한다.
 */
export default function StepOneFields({
  data,
  errors,
  onChange,
  showErrors = false,
}: StepOneFieldsProps) {
  const hasPetNameError = showErrors && Boolean(errors?.petName);
  const hasBreedError = showErrors && Boolean(errors?.breed);
  const hasGenderError = showErrors && Boolean(errors?.gender);

  return (
    <div className="flex flex-col gap-1100">
      <div className="flex flex-col gap-850">
        <FormField label="강아지 이름">
          <TextInput
            placeholder="강아지 이름을 입력해주세요"
            maxLength={MAX_PET_NAME_LENGTH}
            showCounter={true}
            value={data.petName}
            touched={showErrors}
            showError={hasPetNameError}
            errorMessage={errors?.petName}
            onChange={(event) => onChange({ petName: event.target.value })}
          />
        </FormField>
        <FormField label="견종">
          <Dropdown
            options={BREED_LABEL_OPTIONS}
            value={data.breed}
            placeholder="견종을 선택해주세요"
            errorMessage={hasBreedError ? errors?.breed : undefined}
            onChange={(breed) => onChange({ breed })}
          />
        </FormField>
      </div>
      <FormField label="강아지 성별">
        <div className="grid grid-cols-2 gap-300">
          <SelectChip
            label="남아"
            code="M"
            data-selected={data.gender === "M"}
            className="w-full"
            onSelect={() => onChange({ gender: "M" })}
          />
          <SelectChip
            label="여아"
            code="F"
            data-selected={data.gender === "F"}
            className="w-full"
            onSelect={() => onChange({ gender: "F" })}
          />
        </div>
        {hasGenderError ? (
          <div className="flex items-center gap-200 px-300 typo-body-s-medium text-red-500">
            <WarningIcon className="w-4 h-4" aria-hidden="true" />
            <span>{errors?.gender}</span>
          </div>
        ) : null}
      </FormField>
    </div>
  );
}
