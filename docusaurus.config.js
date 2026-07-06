// @ts-check
const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Ergogen docs',
  tagline: 'Ergonomic keyboard layout generator',
  // Deployed via GitHub Pages from the kumekay/ergogen-docs fork.
  // Override with SITE_URL / BASE_URL env vars for other deployments.
  url: process.env.SITE_URL ?? 'https://kumekay.github.io',
  baseUrl: process.env.BASE_URL ?? '/ergogen-docs/',
  onBrokenLinks: 'throw',
  favicon: 'img/ergogen.png',
  organizationName: 'kumekay',
  projectName: 'ergogen-docs',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl: 'https://github.com/kumekay/ergogen-docs/edit/main/',
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
      colorMode: {
        defaultMode: 'dark',
      },
      navbar: {
        title: 'Ergogen docs',
        logo: {
          alt: 'Ergogen docs logo',
          src: 'img/ergogen.png',
        },
        items: [
          {
            href: 'https://github.com/kumekay/ergogen',
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
                label: 'Documentation',
                to: '/',
              },
            ],
          },
          {
            title: 'Absolem',
            items: [
              {
                label: 'Absolem blogpost',
                href: 'https://zealot.hu/absolem/',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'http://discord.ergogen.xyz',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Ergogen. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        defaultLanguage: 'yaml',
      },
    }),
};

module.exports = config;
