import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import {
  DOCS_GITHUB_ORG as GITHUB_ORG,
  DOCS_GITHUB_REPO as GITHUB_REPO,
} from "./src/constants/github";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "YCF",
  tagline: "The inbound mail filter that decides what happens to a message before it reaches an inbox.",
  favicon: "img/favicon.svg",

  future: {
    v4: true,
  },

  url: "https://ycf-docs.yukthi.net",
  baseUrl: "/",

  organizationName: GITHUB_ORG,
  projectName: GITHUB_REPO,

  onBrokenLinks: "throw",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          path: "docs",
          routeBasePath: "docs",
          sidebarPath: "./sidebars.ts",
          editUrl: `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}/tree/main/`,
        },
        blog: false,
        theme: {
          customCss: ["./src/css/tailwind.css", "./src/css/custom.css"],
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: ["./plugins/tailwind-config.js"],

  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        indexBlog: false,
        indexPages: true,
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "YCF",
      logo: {
        alt: "YCF Logo",
        src: "img/logo.svg",
      },
      items: [
        { to: "/docs", label: "Docs", position: "left" },
        { to: "/open-source", label: "Open Source", position: "left" },
        {
          href: `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}`,
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            { label: "Introduction", to: "/docs" },
            { label: "Plugin Reference", to: "/docs/plugins" },
            { label: "Configuration", to: "/docs/configuration" },
            { label: "Deployment", to: "/docs/deployment" },
          ],
        },
        {
          title: "Community",
          items: [
            { label: "Open Source & Contributing", to: "/open-source" },
            {
              label: "GitHub Discussions",
              href: `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}/discussions`,
            },
            {
              label: "Issues",
              href: `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}/issues`,
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}`,
            },
          ],
        },
      ],
      copyright: `Copyright © 2026 Yukthi Systems Private Limited. YCF is free software, licensed under the GNU General Public License v3.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
