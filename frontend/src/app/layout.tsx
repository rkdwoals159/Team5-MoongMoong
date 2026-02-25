import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import ToastProvider from "@/components/ui/Toast/ToastProvider";
import DataDogInit from "@/app/_components/DataDogInit";

const SITE_NAME = "Moong";
const SITE_DESCRIPTION = "노령 반려견 보호자를 위한 가계부 서비스, 뭉(Moong)";

const getMetadataBase = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://moongmoong.site";
  const normalizedSiteUrl =
    siteUrl.startsWith("http://") || siteUrl.startsWith("https://")
      ? siteUrl
      : `https://${siteUrl}`;

  try {
    return new URL(normalizedSiteUrl);
  } catch {
    return new URL(siteUrl);
  }
};

const pretendard = localFont({
  src: [
    {
      path: "../../public/fonts/PretendardVariable.400-700.3713.woff2",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [
      {
        url: "/images/kakao1200x630.png",
        width: 1200,
        height: 630,
        alt: "Moong logo image",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/images/kakao1200x630.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} antialiased`}>
        <ToastProvider>{children}</ToastProvider>
        <DataDogInit />
      </body>
    </html>
  );
}
