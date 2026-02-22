# Frontend (Next.js + React)

## 배포 및 모니터링

| 항목               | 링크                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| 서비스             | [moongmoong.site](https://moongmoong.site)                                                                |
| 단위 테스트 리포트 | PR마다 GitHub Pages 배포 후 코멘트 링크                                                                   |
| Lighthouse 성능    | [Google Spreadsheet](https://docs.google.com/spreadsheets/d/1Q6cmwDpTvwskdYi6x3gMSxvp_i3OF729vHrLYSf91ZA) |

- **Vitest** — 로컬 `yarn test`. CI에서 PR마다 단위 테스트 실행 → HTML 리포트를 GitHub Pages에 배포 → 해당 PR에 링크 코멘트.
- **Lighthouse** — 5개 페이지(대시보드, 분석, 캘린더, 저축, 예측) 성능을 PR 시 측정해 스프레드시트에 기록·PR 코멘트로 요약.

---

## 스크립트 레퍼런스

| 스크립트                  | 설명                                       |
| ------------------------- | ------------------------------------------ |
| `yarn install`            | 의존성 설치                                |
| `yarn dev`                | 개발 서버 실행                             |
| `yarn build`              | 프로덕션 빌드                              |
| `yarn start`              | 프로덕션 서버 실행                         |
| `yarn lint`               | ESLint 실행                                |
| `yarn format`             | Prettier 포맷팅 적용                       |
| `yarn test`               | 단위 테스트 실행                           |
| `yarn storybook`          | Storybook 개발 서버                        |
| `yarn chromatic`          | Chromatic 배포 (Visual Regression)         |
| `yarn openapi-typescript` | BE API 스펙 → `schema.d.ts` 타입 자동 생성 |

---

## 폴더 구조

```
src/
├── app/                           # Next.js App Router
│   ├── (sidebar)/                 # 사이드바 레이아웃 그룹
│   │   ├── @modal/                # Parallel Route (인터셉팅 모달)
│   │   ├── dashboard/             # 대시보드
│   │   ├── analysis/              # 분석
│   │   ├── calendar/              # 캘린더
│   │   ├── saving/                # 저축
│   │   ├── forecast/              # 예측 (AI 질병/의료비)
│   │   │   └── @medicalExpense/   # Parallel Route
│   │   ├── family/                # 가족 관리
│   │   └── settings/              # 설정
│   ├── api/                       # Route Handlers (Auth, Saving, Settings)
│   ├── login/                     # 로그인
│   └── onBoarding/                # 온보딩
├── api/                           # API 함수 (feature별 분리)
├── components/                    # 공유 컴포넌트
│   ├── common/                    # Atomic (Button, Input, Chip, DatePicker ...)
│   ├── layout/                    # 레이아웃 (Header, Sidebar, Notification)
│   └── ui/                        # 복합 UI (DataTable, Modal, Toast, Dropdown)
├── hooks/                         # 공유 커스텀 훅 (useSSE, useOutsideClick ...)
├── lib/                           # 라이브러리 래퍼 (API 클라이언트, SSE)
├── constants/                     # 전역 상수 (질병, 견종, 행정구역)
├── types/                         # 전역 타입 (OpenAPI 자동생성 schema.d.ts)
├── utils/                         # 유틸리티 (date, amount, string)
├── configs/                       # 설정 (Lighthouse CI)
├── assets/                        # 정적 리소스 (SVG 등)
├── styles/                        # 글로벌 스타일
└── test/                          # 테스트 설정
```

### Feature 폴더 컨벤션

각 페이지(feature) 폴더는 `_` 접두사를 사용하여 해당 페이지 전용 모듈을 관리합니다. Next.js App Router의 라우팅 대상에서 자동 제외됩니다.

```
dashboard/
├── _components/     # 페이지 전용 컴포넌트
├── _hooks/          # 페이지 전용 커스텀 훅
├── _utils/          # 페이지 전용 유틸리티
├── _types/          # 페이지 전용 타입
├── _constants/      # 페이지 전용 상수
├── _lib/            # 페이지 전용 라이브러리 래퍼
├── _contexts/       # 페이지 전용 Context
├── layout.tsx
└── page.tsx
```

## 주요 기술 결정

- **Next.js** — App Router 기반 개발 및 서버/클라이언트 컴포넌트 분리
- **Server Components 우선** — 데이터 페칭은 서버 컴포넌트에서 처리, 인터랙션이 필요한 경우만 `"use client"` 사용
- **Parallel & Intercepting Routes** — `@modal` (인터셉팅 모달), `@medicalExpense` (의료비 예측) 등 Next.js 라우팅 패턴 활용
- **Google OAuth·JWT 인증 (Route Handler)** — `app/api/auth/`에서 Google OAuth + JWT 검증 및 자동 리프레시 처리
- **SSE 실시간 통신** — `ServerEventProvider` + `useSSE` 훅으로 저축 알림 등 실시간 이벤트 수신
- **OpenAPI 타입 자동 생성** — BE API 스펙(`api-docs.yaml`)에서 `schema.d.ts`를 자동 생성하여 타입 안전한 API 호출 (`openapi-typescript` + `openapi-fetch`)
- **Claude 기반 코드 리뷰** — PR 본문 또는 코멘트에 `@claude-fe` 입력 시 프론트엔드 변경사항에 대한 AI 리뷰가 자동 실행되어 PR에 코멘트로 남김

## CI/CD

| 파이프라인                 | 트리거                             | 설명                                                                                                                                                        |
| -------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend CI**            | PR/푸시 (`frontend/**`, `main`)    | Lint, Format check, Build                                                                                                                                   |
| **Lighthouse CI**          | PR 오픈 (`develop`, `frontend/**`) | 5개 핵심 페이지 성능 측정 → PR 코멘트 + [Google Spreadsheet](https://docs.google.com/spreadsheets/d/1Q6cmwDpTvwskdYi6x3gMSxvp_i3OF729vHrLYSf91ZA) 자동 기록 |
| **Test Report (Vitest)**   | PR 오픈/동기화 (`frontend/**`)     | 단위 테스트 실행 → HTML 리포트를 GitHub Pages에 배포 후 PR에 링크 코멘트                                                                                    |
| **Claude Frontend Review** | PR 본문/코멘트에 `@claude-fe`      | 프론트엔드 변경사항에 대한 AI 코드 리뷰 → PR 코멘트                                                                                                         |
| **Frontend CD (Dev)**      | 푸시 `develop` (`frontend/**`)     | Lint/Format 검사 후 Vercel Production 배포, Health check, 실패 시 Rollback                                                                                  |
| **Frontend CD (Prod)**     | 푸시 `main` (`frontend/**`)        | Validate → Staging 배포 → Production 배포, Health check, 실패 시 Rollback                                                                                   |

## 테스팅 전략

| 구분              | 도구                             | 규모                     |
| ----------------- | -------------------------------- | ------------------------ |
| Unit Test         | Vitest + jsdom + Testing Library | 38개 테스트 파일         |
| Storybook         | Storybook 10 + addon-a11y        | 15개 스토리              |
| Visual Regression | Chromatic                        | Storybook 연동           |
| Lighthouse CI     | @lhci/cli                        | 5개 페이지 성능 모니터링 |

## 팀원별 Leading Task

- 재민

- 본승

- 용현

## 팀원별 PR 및 wiki 바로가기

## 👥 팀원별 PR & Wiki

### 🧑‍💻 강재민

- 🔎 [PR 목록 보기](https://github.com/softeerbootcamp-7th/WEB-Team5-Moong/pulls?q=assignee%3Arkdwoals159)
- 📚 [Wiki 문서 보기](https://github.com/softeerbootcamp-7th/WEB-Team5-Moong/wiki/%F0%9F%91%A8%E2%80%8D%F0%9F%92%BB-%EC%9E%AC%EB%AF%BC's-wiki)

### 🧑‍💻 구본승

- 🔎 [PR 목록 보기](https://github.com/softeerbootcamp-7th/WEB-Team5-Moong/pulls?q=assignee%3Abonsng)
- 📚 [Wiki 문서 보기](https://github.com/softeerbootcamp-7th/WEB-Team5-Moong/wiki/%F0%9F%91%A8%E2%80%8D%F0%9F%92%BB-%EB%B3%B8%EC%8A%B9's-wiki)

### 🧑‍💻 권용현

- 🔎 [PR 목록 보기](https://github.com/softeerbootcamp-7th/WEB-Team5-Moong/pulls?q=assignee%3Ayyoonngg)
- 📚 [Wiki 문서 보기](https://github.com/softeerbootcamp-7th/WEB-Team5-Moong/wiki/%F0%9F%91%A8%E2%80%8D%F0%9F%92%BB-%EC%9A%A9%ED%98%84's-wiki)

## 컨벤션 & 협업

- 코드 스타일 컨벤션 [Link](https://github.com/softeerbootcamp-7th/WEB-Team5-Moong/wiki/%5BFE%5D-%EC%BD%94%EB%93%9C-%EC%8A%A4%ED%83%80%EC%9D%BC-%EC%BB%A8%EB%B2%A4%EC%85%98)
