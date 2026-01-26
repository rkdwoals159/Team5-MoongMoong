import type { NextConfig } from "next";
import type { Configuration, RuleSetRule } from "webpack";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              icon: true,
            },
          },
        ],
        as: "*.js",
      },
    },
  },

  webpack(config: Configuration) {
    const rules = config.module?.rules ?? [];

    const fileLoaderRule = rules.find((rule): rule is RuleSetRule => {
      if (!rule || typeof rule === "string") return false;
      return rule.test instanceof RegExp && rule.test.test(".svg");
    });

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/;
    }

    if (config.module?.rules) {
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: { and: [/\.(js|ts)x?$/] },
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              icon: true,
            },
          },
        ],
      });
    }

    return config;
  },
};

export default nextConfig;
