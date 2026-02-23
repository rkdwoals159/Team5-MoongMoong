import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PC 전용 안내 | Moong",
  description: "Moong는 현재 PC 환경에서만 이용할 수 있습니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnsupportedDevicePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
      <section className="w-full max-w-xl rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-900">PC 전용 서비스 안내</h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">
          Moong는 현재 모바일 웹을 지원하지 않습니다.
          <br />
          원활한 이용을 위해 PC 브라우저로 접속해 주세요.
        </p>
        <p className="mt-4 text-sm leading-6 text-neutral-500">
          카카오톡/모바일 앱 내 브라우저에서는 차단될 수 있습니다.
          <br />
          PC에서 링크를 열어 이용해 주세요.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-neutral-900 px-5 text-sm font-medium text-white"
        >
          홈으로 이동
        </Link>
      </section>
    </main>
  );
}
