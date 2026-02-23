import { redirect } from "next/navigation";

import { postCreatePet } from "@/api/petApi";
import Logo from "@/components/ui/Logo/Logo";
import ErrorBoundary from "@/components/ui/ErrorBoundary/ErrorBoundary";
import OnboardingForm from "./_components/OnboardingForm";
import { mapFormDataToPetPayload } from "@/app/onBoarding/_lib";

/**
 * 온보딩 폼 데이터를 반려견 생성 API로 전송한 뒤 대시보드로 이동한다.
 */
async function createPetAction(formData: FormData) {
  "use server";
  const payload = mapFormDataToPetPayload(formData);
  await postCreatePet(payload);
  redirect("/dashboard");
}

/**
 * 온보딩 페이지를 렌더링한다.
 */
export default function OnBoardingPage() {
  return (
    <div className="min-h-screen bg-white-100">
      <header className="flex h-[64px] items-center px-[50px]">
        <Logo href="/login" ariaLabel="로그인 페이지로 이동" imageClassName="h-5 w-[90px]" />
      </header>
      <main className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-[50px] pb-1100 pt-[120px]">
        <section className="w-full max-w-[500px]">
          <ErrorBoundary>
            <OnboardingForm action={createPetAction} />
          </ErrorBoundary>
        </section>
      </main>
    </div>
  );
}
