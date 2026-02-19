const {
  LHCI_MONITORING_PAGE_NAMES,
  getLhciUrlFromPageName,
} = require("./src/configs/lighthouse/Lighthouse.js");

const urls = LHCI_MONITORING_PAGE_NAMES.map(
  (name) => `http://localhost:3000${getLhciUrlFromPageName(name)}`,
);

module.exports = {
  ci: {
    collect: {
      startServerCommand: "yarn start",
      url: urls,
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
        maxWaitForLoad: 15000,
        maxWaitForFcp: 15000,
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./lhci_reports/desktop",
      reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%",
    },
  },
};
