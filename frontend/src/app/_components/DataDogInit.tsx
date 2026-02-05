// App Router를 사용하여 이 파일이 클라이언트에서 실행되도록 할 경우 필요합니다
"use client";

import { datadogRum } from "@datadog/browser-rum";
datadogRum.init({
  applicationId: process.env.DD_APP_ID ?? "",
  clientToken: process.env.DD_CLIENT_TOKEN ?? "",
  site: process.env.DD_SITE ?? "",
  service: process.env.DD_SERVICE ?? "",
  env: process.env.DD_ENV ?? "",
  // Datadog에서 배포 애플리케이션 버전을 파악할 수 있도록 버전 넘버를 지정합니다
  // version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 40,
  trackBfcacheViews: true,
  defaultPrivacyLevel: "allow",
  allowedTracingUrls: [
    {
      match: process.env.BASE_API_URL ?? "",
      propagatorTypes: ["tracecontext"],
    },
  ],
});
export default function DataDogInit() {
  // 랜더링하지 않음 - 이 컴포넌트는 초기화 코드가 포함되도록 하기 위함입니다
  // 위는 클라이언트 측에서 실행됩니다
  return null;
}
