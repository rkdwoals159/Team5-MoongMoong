"use client";

import Button from "@/components/common/Button/Button";
import TextInput from "@/components/common/Input/TextInput";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import SelectChip from "@/components/common/SelectChip/SelectChip";
import type { DogSettingsSectionProps } from "@/app/(sidebar)/settings/types";
import { DISEASE_CODE_SHORT_NAMES, DISEASE_TAB_ORDER, DOG_BREED_LABELS } from "@/constants";
import {
  CITY_VALUE,
  CITY_OPTIONS,
  CITY_DISTRICT_OPTIONS,
} from "@/app/(sidebar)/settings/constants";
import useDogSettingsForm from "@/app/(sidebar)/settings/_hooks/useDogSettingsForm";

export default function DogSettingsSection({ dog, onClose }: DogSettingsSectionProps) {
  const {
    petName,
    breed,
    gender,
    birthDate,
    district,
    diseases,
    isSaveDisabled,
    handlePetNameChange,
    handleBreedChange,
    handleGenderSelect,
    handleBirthDateChange,
    handleDistrictChange,
    handleDiseaseSelect,
    handleSaveClick,
  } = useDogSettingsForm(dog);

  return (
    <section
      aria-labelledby="dog-settings-title"
      className="flex w-full max-w-[515px] flex-col gap-600 pb-600"
    >
      <div className="flex flex-col gap-600">
        <FieldWrapper label="강아지 이름">
          <TextInput value={petName} maxLength={10} showCounter onChange={handlePetNameChange} />
        </FieldWrapper>

        <FieldWrapper label="견종">
          <Dropdown options={DOG_BREED_LABELS} value={breed} onChange={handleBreedChange} />
        </FieldWrapper>

        <FieldWrapper label="강아지 성별">
          <div className="flex gap-300">
            <SelectChip
              label="남아"
              code="M"
              onSelect={handleGenderSelect}
              className={gender === "M" ? selectedChipClasses : ""}
            />
            <SelectChip
              label="여아"
              code="F"
              onSelect={handleGenderSelect}
              className={gender === "F" ? selectedChipClasses : ""}
            />
          </div>
        </FieldWrapper>

        <FieldWrapper label="생년월">
          <TextInput
            value={birthDate}
            maxLength={7}
            showCounter={false}
            placeholder="YYYY-MM"
            onChange={handleBirthDateChange}
          />
        </FieldWrapper>

        <FieldWrapper label="거주지">
          <div className="flex gap-350">
            <div className="w-[206px]">
              <Dropdown options={CITY_OPTIONS} value={CITY_VALUE} disabled fullWidth />
            </div>
            <div className="flex-1">
              <Dropdown
                options={CITY_DISTRICT_OPTIONS}
                value={district}
                onChange={handleDistrictChange}
              />
            </div>
          </div>
        </FieldWrapper>

        <FieldWrapper label="걱정되는 질병">
          <div className="grid grid-cols-3 gap-350">
            {DISEASE_TAB_ORDER.map((diseaseCode) => (
              <SelectChip
                key={diseaseCode}
                label={DISEASE_CODE_SHORT_NAMES[diseaseCode]}
                code={diseaseCode}
                onSelect={handleDiseaseSelect}
                className={diseases.includes(diseaseCode) ? selectedChipClasses : ""}
              />
            ))}
          </div>
        </FieldWrapper>
      </div>
      <div className="mt-600 flex w-[32rem] gap-200">
        {onClose && (
          <Button variant="secondary" size="medium" fullWidth={true} onClick={onClose}>
            닫기
          </Button>
        )}
        <Button
          variant="primary"
          size="medium"
          fullWidth={true}
          onClick={handleSaveClick}
          isDisabled={isSaveDisabled}
        >
          저장하기
        </Button>
      </div>
    </section>
  );
}

// 내장 함수
function FieldWrapper({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-200">
      <span className="typo-caption-s-bold text-gray-500">{label}</span>
      {children}
    </div>
  );
}

const selectedChipClasses = "bg-yellow-100 border border-yellow-200 text-gray-800";
