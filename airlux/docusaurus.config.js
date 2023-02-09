// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Airlux',
  tagline: 'Vos équipements sous votre controle.',
  favicon: 'img/favicon.ico',

  url: 'https://airlux.com',
  baseUrl: '/',

  organizationName: 'devlmiot', // Usually your GitHub org/user name.
  projectName: 'Airlux', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/airlux.png',
      navbar: {
        title: 'Airlux',
        logo: {
          alt: 'Airlux Logo',
          src: 'img/airlux_logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Premiers pas',
          },
          {
            type: 'doc',
            docId: 'bd_cloud',
            position: 'left',
            label: 'Bases de données',
          },
          {
            type: 'doc',
            docId: 'api_cloud',
            position: 'left',
            label: 'API',
          },
          {
            type: 'doc',
            docId: 'flutter/architecture',
            position: 'left',
            label: 'Application',
          },
          {
            href: 'https://github.com/AmbreFavetto/Airlux',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Premiers pas',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: `GitHub`,
                href: 'https://github.com/AmbreFavetto/Airlux',
              },
              {
                label: 'Notion',
                href: 'https://www.notion.so/Airlux-Project-566f83d3860f4b609d48fd7bd630d4a8',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Airlux, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
