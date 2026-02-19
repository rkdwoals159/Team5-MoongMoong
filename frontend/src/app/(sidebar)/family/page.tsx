import { Suspense } from "react";
import PageHeader from "@/components/layout/Header/PageHeader";
import FamilyManagePageView from "./_components/FamilyManagePageView";
import FamilyManageSkeleton from "./_components/FamilyManageSkeleton";

export default function FamilyPage() {
  return (
    <article className="flex flex-col gap-850 px-850">
      <PageHeader title="가족 관리" />
      <Suspense fallback={<FamilyManageSkeleton />}>
        <FamilyManagePageView />
      </Suspense>
    </article>
  );
}
