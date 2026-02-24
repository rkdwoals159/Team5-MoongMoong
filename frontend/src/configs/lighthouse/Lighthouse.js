module.exports = {
  LHCI_GOOGLE_SPREAD_SHEET_ID: "1Q6cmwDpTvwskdYi6x3gMSxvp_i3OF729vHrLYSf91ZA",

  LHCI_GREEN_MIN_SCORE: 90,
  LHCI_ORANGE_MIN_SCORE: 50,
  LHCI_RED_MIN_SCORE: 0,

  LHCI_MONITORING_PAGE_NAMES: [
    "로그인",
    "온보딩",
    "대시보드",
    "분석",
    "캘린더",
    "저축",
    "예측",
    "가족관리",
    "설정",
  ],

  LHCI_PAGE_NAME_TO_URL: {
    로그인: "/login",
    온보딩: "/onBoarding",
    대시보드: "/dashboard",
    분석: "/analysis",
    캘린더: "/calendar",
    저축: "/saving",
    예측: "/forecast",
    가족관리: "/family",
    설정: "/settings",
  },

  LHCI_PAGE_NAME_TO_SHEET_ID: {
    로그인: 173707155,
    온보딩: 514950897,
    대시보드: 1032370938,
    분석: 276234911,
    캘린더: 1021242166,
    저축: 349905617,
    예측: 1551666389,
    가족관리: 186654088,
    설정: 2144942811,
  },

  getLhciPageNameFromUrl: (url) => {
    for (const [name, path] of Object.entries(module.exports.LHCI_PAGE_NAME_TO_URL)) {
      if (decodeURIComponent(path) === decodeURIComponent(url)) return name;
    }
  },

  getLhciUrlFromPageName: (name) => {
    return module.exports.LHCI_PAGE_NAME_TO_URL[name];
  },

  getLhciSheetIdFromPageName: (name) => {
    return module.exports.LHCI_PAGE_NAME_TO_SHEET_ID[name];
  },
};
