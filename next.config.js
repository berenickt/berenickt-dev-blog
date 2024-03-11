// @see https://codehike.org/docs/themes
const { remarkCodeHike } = require('@code-hike/mdx')

const withNextra = require('nextra')({
  // basic settings
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  // @see https://nextra.site/docs/guide/syntax-highlighting#copy-button
  defaultShowCopyCode: true,
  // @see https://nextra.site/docs/guide/image#static-image
  staticImage: true,
  // @see https://nextra.site/docs/guide/advanced/latex
  latex: true,
  // @see https://nextra.site/docs/guide/syntax-highlighting#custom-themes
  mdxOptions: {
    // @see https://codehike.org/docs/configuration
    remarkPlugins: [
      [
        remarkCodeHike,
        {
          theme: 'dark-plus',
          lineNumbers: true,
          showCopyButton: true,
          autoImport: true,
        },
      ],
    ],
  },
  //
})

module.exports = withNextra()

// If you have other Next.js configurations, you can pass them as the parameter:
// module.exports = withNextra({ /* other next.js config */ })
