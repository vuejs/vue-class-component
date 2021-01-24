module.exports = {
  title: 'Vue Class Component',
  description:
    'ECMAScript / TypeScript decorator for class-style Vue components',

  themeConfig: {
    repo: 'vuejs/vue-class-component',
    docsDir: 'docs',
    editLinks: true,

    nav: [
      {
        text: 'Guide',
        link: '/',
      },
      {
        text: 'API Reference',
        link: '/api/',
      },
    ],

    sidebar: {
      '/api/': [
        {
          text: 'API Reference',
          link: '/api/',
        },
      ],

      '/': [
        {
          text: 'Overview',
          link: '/',
        },
        {
          text: 'Installation',
          link: '/guide/installation.html',
        },
        {
          text: 'General Guide',
          collapsable: false,
          children: [
            {
              text: 'Class Component',
              link: '/guide/class-component.html',
            },
            {
              text: 'Additional Hooks',
              link: '/guide/additional-hooks.html',
            },
            {
              text: 'Custom Decorators',
              link: '/guide/custom-decorators.html',
            },
            {
              text: 'Extend and Mixins',
              link: '/guide/extend-and-mixins.html',
            },
            {
              text: 'Caveats of Class Component',
              link: '/guide/caveats.html',
            },
          ],
        },
        {
          text: 'TypeScript Guide',
          collapsable: false,
          children: [
            {
              text: 'Props Definition',
              link: '/guide/props-definition.html',
            },
            {
              text: 'Property Type Declaration',
              link: '/guide/property-type-declaration.html',
            },
            {
              text: '$refs Type Extension',
              link: '/guide/refs-type-extension.html',
            },
            {
              text: 'Hooks Auto-complete',
              link: '/guide/hooks-auto-complete.html',
            },
          ],
        },
      ],
    },
  },
}
