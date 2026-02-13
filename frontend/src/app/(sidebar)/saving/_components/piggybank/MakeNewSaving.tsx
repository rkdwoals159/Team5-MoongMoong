"use client";

import { useState } from "react";
import NewSavingEmptyState from "@/app/(sidebar)/saving/_components/piggybank/NewSavingEmptyState";
import NewSavingForm from "@/app/(sidebar)/saving/_components/piggybank/NewSavingForm";
import { useCreateSaving } from "@/app/(sidebar)/saving/_hooks/useCreateSaving";

export default function MakeNewSaving() {
  const [showInput, setShowInput] = useState(false);
  const { createSaving, isSubmitting } = useCreateSaving();

  if (!showInput) {
    return <NewSavingEmptyState onCreateClick={() => setShowInput(true)} />;
  }

  return (
    <NewSavingForm
      onSubmit={createSaving}
      onCancel={() => setShowInput(false)}
      isSubmitting={isSubmitting}
    />
  );
}
