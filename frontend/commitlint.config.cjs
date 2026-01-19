module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "docs", "refactor", "chore", "style", "test", "fix", "design", "config"],
    ],
    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
  },
};
