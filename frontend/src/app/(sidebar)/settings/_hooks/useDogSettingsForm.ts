"use client";

import { useState } from "react";
import { DOG_BREEDS, DISEASE_TAB_ORDER } from "@/constants";
import { updatePetInfo } from "@/api/server/settingsApiActions";
import type { PetUpdateRequest } from "@/api/types/settingsApi.type";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import type { DogBreedCode } from "@/constants";
import type { DiseaseCode } from "@/api/types/forecastApi.type";
import type { GetPetInfoResponse } from "@/api/types/perInfoApi.type";
import type { DogFormValues } from "@/app/(sidebar)/settings/types";
import { getErrorMessage } from "@/lib/api/errorMessage";

export default function useDogSettingsForm(dog: GetPetInfoResponse) {
  const { showToast } = useToast();
  const [original, setOriginal] = useState<DogFormValues>(() => toInitialValues(dog));
  const [petName, setPetName] = useState(original.petName);
  const [breed, setBreed] = useState<DogBreedCode>(original.breed);
  const [gender, setGender] = useState<"M" | "F">(original.gender);
  const [birthDate, setBirthDate] = useState(original.birthDate);
  const [district, setDistrict] = useState(original.district);
  const [diseases, setDiseases] = useState<DiseaseCode[]>(original.diseases);

  const breedKoName = DOG_BREEDS.find((b) => b.code === breed)?.koName ?? "기타";

  const isDiseasesChanged = [...diseases].sort().join() !== [...original.diseases].sort().join();

  const isChanged =
    petName !== original.petName ||
    breed !== original.breed ||
    gender !== original.gender ||
    birthDate !== original.birthDate ||
    district !== original.district ||
    isDiseasesChanged;

  const isSaveDisabled = !isChanged || !petName.trim() || !birthDate || !district;

  function handlePetNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPetName(e.target.value);
  }

  function handleBreedChange(koName: string) {
    const code = DOG_BREEDS.find((b) => b.koName === koName)?.code;
    if (code) setBreed(code);
  }

  function handleGenderSelect(code: string) {
    if (code === "M" || code === "F") setGender(code);
  }

  function handleBirthDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    const formatted = digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits;
    setBirthDate(formatted);
  }

  function handleDistrictChange(value: string) {
    setDistrict(value);
  }

  function handleDiseaseSelect(code: string) {
    const diseaseCode = DISEASE_TAB_ORDER.find((d) => d === code);
    if (!diseaseCode) return;
    setDiseases((prev) =>
      prev.includes(diseaseCode) ? prev.filter((d) => d !== diseaseCode) : [...prev, diseaseCode],
    );
  }

  async function handleSaveClick() {
    const body: PetUpdateRequest = {
      petName,
      breed,
      gender,
      birthDate,
      city: dog.city ?? "서울특별시",
      district,
      diseases,
    };

    try {
      await updatePetInfo(body);
      setOriginal({ petName, breed, gender, birthDate, district, diseases: [...diseases] });
      showToast({ variant: "success", message: "반려견 정보가 저장됐어요." });
    } catch (error) {
      showToast({
        variant: "error",
        message: getErrorMessage(error, "반려견 정보 수정에 실패했어요."),
      });
    }
  }

  return {
    // 상태값
    petName,
    breed: breedKoName,
    gender,
    birthDate,
    district,
    diseases,
    isSaveDisabled,
    // 핸들러
    handlePetNameChange,
    handleBreedChange,
    handleGenderSelect,
    handleBirthDateChange,
    handleDistrictChange,
    handleDiseaseSelect,
    handleSaveClick,
  };
}

// 내장 함수
function toInitialValues(dog: GetPetInfoResponse): DogFormValues {
  return {
    petName: dog.petName ?? "",
    breed: (dog.breed ?? "ETC") as DogBreedCode,
    gender: dog.gender === "F" ? "F" : "M",
    birthDate: dog.birthDate ?? "",
    district: dog.district ?? "",
    diseases: (dog.diseases ?? []).filter((d): d is DiseaseCode => DISEASE_TAB_ORDER.includes(d)),
  };
}
