import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import ToastProvider from "@/components/ui/Toast/ToastProvider";
import AgentationClient from "@/app/_components/AgentationClient";
import DataDogInit from "@/app/_components/DataDogInit";

const pretendard = localFont({
  src: [
    {
      path: "../../public/fonts/PretendardVariable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Moong",
  description: "가족끼리 뭉쳐서 돈을 뭉치자! 노령 반려견 보호자를 위한 가계부 서비스, 뭉 (Moong)",
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
        <AgentationClient />
        <DataDogInit />
      </body>
    </html>
  );
}
