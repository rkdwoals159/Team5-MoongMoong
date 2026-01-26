import type { StorybookConfig } from "@storybook/nextjs-vite";
import svgr from "vite-plugin-svgr";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-vitest", "@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {
      image: {
        excludeFiles: ["**/*.svg", "**/*.svg?*"],
      },
    },
  },
  staticDirs: ["../public"],
  viteFinal: async (config) => {
    config.plugins = [
      svgr({
        include: "**/*.svg",
        svgrOptions: {
          exportType: "default",
          icon: true,
        },
      }),
      ...(config.plugins ?? []),
    ];
    return config;
  },
};
export default config;
