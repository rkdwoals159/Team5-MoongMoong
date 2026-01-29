"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DiseaseCode,
  DiseaseCostResponse,
  MedicalExpenseProps,
} from "@/app/(sidebar)/forecast/forecast.type";
import { mockCosts } from "@/app/(sidebar)/forecast/_components/medical-expense/mockCosts";
import MedicalExpenseHeader from "@/app/(sidebar)/forecast/_components/medical-expense/MedicalExpenseHeader";
import MedicalExpenseTabs from "@/app/(sidebar)/forecast/_components/medical-expense/MedicalExpenseTabs";
import MedicalExpenseTreatments from "@/app/(sidebar)/forecast/_components/medical-expense/MedicalExpenseTreatments";

const PAGE_SIZE = 3;

const getDiseaseCost = async (
  _memberId: string,
  disease: DiseaseCode,
): Promise<DiseaseCostResponse> => {
  // mock 데이터 반환 (300~600ms 지연)
  const delay = Math.random() * 300 + 300;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCosts[disease]);
    }, delay);
  });
};

const MedicalExpense = ({ memberId = "", diseaseList }: MedicalExpenseProps) => {
  const [selectedDisease, setSelectedDisease] = useState<DiseaseCode>(diseaseList[0] ?? "DER");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<DiseaseCostResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(
    async (disease: DiseaseCode) => {
      setIsLoading(true);
      setData(null);

      try {
        const result = await getDiseaseCost(memberId, disease);
        setData(result);
      } finally {
        setIsLoading(false);
      }
    },
    [memberId],
  );

  useEffect(() => {
    fetchData(selectedDisease);
  }, [selectedDisease, fetchData]);

  const handleTabChange = (disease: DiseaseCode) => {
    if (disease === selectedDisease) return;
    setSelectedDisease(disease);
    setPage(0);
  };

  const treatments = data?.treatments ?? [];
  const totalPages = Math.ceil(treatments.length / PAGE_SIZE);
  const visibleTreatments = treatments.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const canGoPrev = page > 0;
  const canGoNext = page < totalPages - 1;

  return (
    <section>
      <div className={containerClasses}>
        <MedicalExpenseHeader />
        <MedicalExpenseTabs
          diseaseList={diseaseList}
          selectedDisease={selectedDisease}
          onSelect={handleTabChange}
        />
        <MedicalExpenseTreatments
          isLoading={isLoading}
          visibleTreatments={visibleTreatments}
          skeletonCount={PAGE_SIZE}
          totalPages={totalPages}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
        />
      </div>
    </section>
  );
};

export default MedicalExpense;

// Tailwind CSS classes
const containerClasses =
  "flex flex-col gap-600 rounded-500 border border-gray-100 bg-white-100 p-600 overflow-hidden w-full mb-[150px]";
