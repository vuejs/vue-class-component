module.exports = {
  title: 'Представление компонентов класса',
  description: 'ECMAScript/TypeScript декоратор для компонентов Vue в стиле классов',

  themeConfig: {
    repo: 'warsan/vue-class-component',
    docsDir: 'docs',
    editLinks: true,

    nav: [
      {
        text: 'Руководство',
        link: '/'
      },
      {
        text: 'Справочник по API',
        link: '/api/'
      },
      {
        text: 'Проба',
        link: '/проба/'
      }
    ],

    sidebar: {
      '/api/': [''],
      '/проба/': 
      ['/',
         '/проба/проба.md',
        {
          title: 'Эксперимент', 
          collapsable: false, 
          children: [ 
                 'проба/проба.md'
             ]
        },
      ],

      '/': 
      ['',
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
          title: 'Руководство TypeScript ',
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