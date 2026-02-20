"use client";

import { useState, useEffect } from "react";
import { getDemoReport } from "@/api/demoApi";
import DocumentIcon from "@/assets/icons/components/ic_document.svg";
import CheckCircleIcon from "@/assets/icons/components/ic_check_circle.svg";
import CloseIcon from "@/assets/icons/components/close.svg";

type ButtonState = "idle" | "loading" | "sending" | "sent" | "error";

export default function AnalysisReportButton() {
  const [state, setState] = useState<ButtonState>("idle");

  useEffect(() => {
    if (state !== "sent" && state !== "error") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const handleClick = async () => {
    if (state !== "idle") return;

    setState("loading");

    const result = await getDemoReport();

    if (!result) {
      setState("error");
      return;
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setState(prefersReduced ? "sent" : "sending");
  };

  const handleAnimationEnd = () => {
    if (state === "sending") {
      setState("sent");
    }
  };

  const ariaLabel =
    state === "idle"
      ? "분석 리포트 발송"
      : state === "loading"
        ? "리포트 발송 중"
        : state === "sending"
          ? "리포트 발송 중"
          : state === "sent"
            ? "리포트 발송 완료"
            : "리포트 발송 실패";

  const buttonStyle =
    state === "sent"
      ? "border-green-500 bg-green-100"
      : state === "error"
        ? "border-red-500 bg-red-100"
        : "border-gray-200 bg-white-100 hover:bg-gray-30";

  return (
    <div className="group relative ">
      <button
        type="button"
        disabled={state !== "idle"}
        onClick={handleClick}
        aria-label={ariaLabel}
        aria-live="polite"
        className={`flex h-[32px] w-[32px] items-center justify-center rounded-full border transition-colors duration-200 overflow-hidden hover:cursor-pointer ${buttonStyle}`}
      >
        {state === "loading" && <span className="report-spinner block h-[16px] w-[16px]" />}
        {state === "sent" && (
          <CheckCircleIcon className="report-check-in h-[18px] w-[18px] text-green-500" />
        )}
        {state === "error" && (
          <CloseIcon className="report-error-in h-[12px] w-[12px] text-red-500" />
        )}
        {(state === "idle" || state === "sending") && (
          <DocumentIcon
            className={`h-[18px] w-[18px] text-gray-800 ${state === "sending" ? "report-fly-up" : ""}`}
            onAnimationEnd={handleAnimationEnd}
          />
        )}
      </button>
      <span
        role="tooltip"
        className="typo-caption-m-medium pointer-events-none absolute top-1/2 right-full mr-[6px] -translate-y-1/2 whitespace-nowrap rounded-[6px] bg-gray-800 px-[8px] py-[4px] text-white-100 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      >
        소비 분석 레포트 즉시 발송 데모용 버튼입니다
      </span>
    </div>
  );
}
