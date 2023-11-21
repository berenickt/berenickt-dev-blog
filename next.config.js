// import { remarkCodeHike } from "@code-hike/mdx"
// import githubDarkDimmed from "shiki/themes/github-dark-dimmed.json" assert { type: "json" };

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  // staticImage: true,
  // flexsearch: {
  //   codeblocks: false,
  // },
  // latex: true,
  // defaultShowCopyCode: true,
  // mdxOptions: {
  //   remarkPlugins: [
  //     [
  //       remarkCodeHike,
  //       {
  //         lineNumbers: true,
  //         showCopyButton: true,
  //         theme: githubDarkDimmed,
  //         autoImport: true,
  //       },
  //     ],
  //   ],
  // },
})

module.exports = withNextra()

// If you have other Next.js configurations, you can pass them as the parameter:
// module.exports = withNextra({ /* other next.js config */ })