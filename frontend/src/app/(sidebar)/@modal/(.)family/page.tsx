import { Suspense } from "react";
import ErrorBoundary from "@/components/ui/ErrorBoundary/ErrorBoundary";
import FamilyModal from "@/app/(sidebar)/family/_components/FamilyModal";
import FamilyManageModalView from "@/app/(sidebar)/family/_components/FamilyManageModalView";
import FamilyManageModalSkeleton from "@/app/(sidebar)/family/_components/FamilyManageModalSkeleton";
import FamilyManageModalErrorFallback from "@/app/(sidebar)/family/_components/FamilyManageModalErrorFallback";

export default function InterceptedFamilyPage() {
  return (
    <FamilyModal>
      <ErrorBoundary FallbackComponent={FamilyManageModalErrorFallback}>
        <Suspense fallback={<FamilyManageModalSkeleton />}>
          <FamilyManageModalView />
        </Suspense>
      </ErrorBoundary>
    </FamilyModal>
  );
}
