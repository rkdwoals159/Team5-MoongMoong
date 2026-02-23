import { Suspense } from "react";
import FamilyModal from "@/app/(sidebar)/family/_components/FamilyModal";
import FamilyManageModalView from "@/app/(sidebar)/family/_components/FamilyManageModalView";
import FamilyManageModalSkeleton from "@/app/(sidebar)/family/_components/FamilyManageModalSkeleton";

export default function InterceptedFamilyPage() {
  return (
    <FamilyModal>
      <Suspense fallback={<FamilyManageModalSkeleton />}>
        <FamilyManageModalView />
      </Suspense>
    </FamilyModal>
  );
}
