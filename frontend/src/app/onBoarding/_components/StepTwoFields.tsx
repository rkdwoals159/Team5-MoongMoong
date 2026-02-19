"use client";
import {
  BIRTH_DATE_MAX_LENGTH,
  BIRTH_DATE_PLACEHOLDER,
  CITY_PLACEHOLDER,
  DISTRICT_PLACEHOLDER,
} from "@/app/onBoarding/_constants";
import type { StepTwoFieldsProps } from "@/app/onBoarding/_types";
import { CITY_OPTIONS, getDistrictOptions } from "@/app/onBoarding/_lib";
import { normalizeBirthDate } from "@/app/onBoarding/_utils";
import TextInput from "@/components/common/Input/TextInput";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import FormField from "./FormField";

/**
 * 온보딩 2단계(나이/지역 입력) 필드를 렌더링한다.
 */
export default function StepTwoFields({
  data,
  errors,
  onChange,
  showErrors = false,
}: StepTwoFieldsProps) {
  const districtOptions = getDistrictOptions(data.city);

  const hasBirthDateError = showErrors && Boolean(errors?.birthDate);
  const hasCityError = showErrors && Boolean(errors?.city);
  const hasDistrictError = showErrors && Boolean(errors?.district);

  return (
    <div className="flex flex-col gap-850">
      <FormField label="생년월">
        <TextInput
          placeholder={BIRTH_DATE_PLACEHOLDER}
          maxLength={BIRTH_DATE_MAX_LENGTH}
          showCounter={false}
          value={data.birthDate}
          touched={showErrors}
          inputMode="numeric"
          showError={hasBirthDateError}
          errorMessage={errors?.birthDate}
          onChange={(event) => onChange({ birthDate: normalizeBirthDate(event.target.value) })}
        />
      </FormField>
      <FormField label="거주지">
        <div className="grid grid-cols-2 gap-300">
          <Dropdown
            options={CITY_OPTIONS}
            value={data.city}
            placeholder={CITY_PLACEHOLDER}
            errorMessage={hasCityError ? errors?.city : undefined}
            onChange={(city) => onChange({ city, district: "" })}
          />
          <Dropdown
            options={districtOptions}
            value={data.district}
            placeholder={DISTRICT_PLACEHOLDER}
            disabled={!data.city}
            errorMessage={hasDistrictError ? errors?.district : undefined}
            onChange={(district) => onChange({ district })}
          />
        </div>
      </FormField>
    </div>
  );
}
