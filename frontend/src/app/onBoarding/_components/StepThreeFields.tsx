"use client";

import type { StepThreeFieldsProps } from "@/app/onBoarding/_types";
import {
  DISEASE_CHOICE_HELP_TEXT,
  DISEASE_SELECTION_LABEL,
  DISEASE_SELECTION_LABEL_OPTIONAL,
} from "@/app/onBoarding/_constants";
import { DISEASE_OPTIONS, getToggledDiseaseCodes } from "@/app/onBoarding/_lib";
import InfoIcon from "@/assets/icons/forecast/ic_info.svg";
import SelectChip from "@/components/common/SelectChip/SelectChip";

import FormField from "./FormField";

/**
 * 온보딩 3단계(질병 선택) 필드를 렌더링한다.
 */
export default function StepThreeFields({ data, onChange }: StepThreeFieldsProps) {
  return (
    <div className="flex flex-col gap-300">
      <FormField
        label={
          <span>
            {DISEASE_SELECTION_LABEL}{" "}
            <span className="typo-title-m-medium text-gray-500">
              {DISEASE_SELECTION_LABEL_OPTIONAL}
            </span>
          </span>
        }
      >
        <div className="grid grid-cols-3 gap-400">
          {DISEASE_OPTIONS.map((option) => (
            <SelectChip
              key={option.value}
              label={option.label}
              code={option.value}
              data-selected={data.diseases.includes(option.value)}
              className="w-full"
              onSelect={() =>
                onChange({
                  diseases: getToggledDiseaseCodes(data.diseases, option.value),
                })
              }
            />
          ))}
        </div>
      </FormField>
      <div className="flex items-center gap-200 text-text-sub">
        <InfoIcon className="size-4" aria-hidden="true" />
        <p className="typo-body-m-medium">{DISEASE_CHOICE_HELP_TEXT}</p>
      </div>
    </div>
  );
}
