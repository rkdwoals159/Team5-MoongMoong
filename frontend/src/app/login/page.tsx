import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/ui/Logo/Logo";
import ImgGoogleLogo from "@/assets/icons/login/img_google_logo.png";
import OnboardingCarousel from "./_components/OnboardingCarousel";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ inviteUrl: string | null; returnTo: string }>;
}) {
  const inviteUrl = (await searchParams).inviteUrl ?? null;
  const returnTo = (await searchParams).returnTo ?? "/dashboard";
  return (
    <div className="min-h-screen bg-white-100">
      <header className="flex h-[64px] items-center px-[50px]">
        <Logo
          href="/dashboard"
          ariaLabel="메인 대시보드 페이지로 이동"
          imageClassName="h-5 w-[90px]"
        />
      </header>
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-900 px-[50px] pb-1100 lg:flex-row lg:items-start lg:justify-between">
        <section className="flex w-full flex-col gap-800 pt-[120px] lg:w-[500px] lg:pt-[252px]">
          <div className="flex flex-col gap-600">
            <h1 className="typo-headline-l-bold text-text-base">반가워요!</h1>
            <p className="typo-headline-s-medium text-text-sub">
              지금 가입하면 우리 강아지
              <br />
              예상 진료명을 바로 확인할 수 있어요
            </p>
          </div>
          <Link
            href={{
              pathname: "/api/auth/google/start",
              query: {
                inviteUrl,
                returnTo,
              },
            }}
            className="flex h-[50px] w-full items-center justify-center gap-200 rounded-[8px] border border-gray-200 bg-white-100"
          >
            <span className="flex size-[36px] items-center justify-center">
              <Image src={ImgGoogleLogo} alt="Google" width={16} height={16} />
            </span>
            <span className="typo-body-m-bold text-gray-800">구글 계정으로 시작하기</span>
          </Link>
          <p className="typo-body-m-medium text-gray-500">
            구글, 애플, 또는 이메일로 계속 진행하여, moongmoong&nbsp;
            {/* todo - 실제 링크로 변경 */}
            <span className="underline">서비스 약관</span> 및&nbsp;
            <span className="underline">개인 정보 보호 정책</span>에 동의하세요.
          </p>
        </section>

        <section className="flex w-full justify-center">
          <OnboardingCarousel />
        </section>
      </main>
    </div>
  );
}
