module.exports = {
  title: 'Представление компонентов класса',
  description: 'ECMAScript/TypeScript декоратор для компонентов Vue в стиле классов',

  themeConfig: {
    repo: 'vuejs/vue-class-component',
    docsDir: 'docs',
    editLinks: true,

    nav: [
      {
        text: 'Guide',
        link: '/'
      },
      {
        text: 'API Reference',
        link: '/api/'
      }
    ],

    sidebar: {
      '/api/': [
        ''
      ],

      '/': [
        '',
        'guide/installation.md',
        {
          title: 'Общее руководство',
          collapsable: false,
          children: [
            'guide/class-component.md',
            'guide/additional-hooks.md',
            'guide/custom-decorators.md',
            'guide/extend-and-mixins.md',
            'guide/caveats.md'
          ]
        },
        {
          title: 'TypeScript Руководство',
          collapsable: false,
          children: [
            'guide/props-definition.md',
            'guide/property-type-declaration.md',
            'guide/refs-type-extension.md',
            'guide/hooks-auto-complete.md',
            'guide/annotate-component-type-in-decorator'
          ]
        }
      ]
    }
  }
}