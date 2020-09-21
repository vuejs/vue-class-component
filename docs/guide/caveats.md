# Предостережения относительно компонента класса

Компонент класса Vue собирает свойства класса как данные экземпляра Vue, создавая экземпляр исходного конструктора под капотом. Хотя мы можем определять данные экземпляра как собственный класс, иногда нам нужно знать, как это работает.

## значение `this` в инициализаторе свойства

Если вы определите стрелочную функцию как свойство класса и получите в ней доступ к `this`, она не будет работать. Это потому, что `this` - это просто прокси-объект для экземпляра Vue при инициализации свойств класса:

```js
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class MyComp extends Vue {
  foo = 123

  // Не делай этого
  bar = () => {
    // Не обновляет ожидаемое свойство.
    // Фактически, значение `this` не является экземпляром Vue.
    this.foo = 456
  }
}
```

В этом случае вы можете просто определить метод вместо свойства класса, потому что Vue автоматически привяжет экземпляр:

```js
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class MyComp extends Vue {
  foo = 123

  // Сделай это
  bar() {
    // Правильно обнови ожидаемое свойство.
    this.foo = 456
  }
}
```

## Всегда используйте хуки жизненного цикла вместо конструктора

Поскольку исходный конструктор вызывается для сбора исходных данных компонента, не рекомендуется объявлять `constructor` самостоятельно:

```js
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Posts extends Vue {
  posts = []

  // Не делай этого
  constructor() {
    fetch('/posts.json')
      .then(res => res.json())
      .then(posts => {
        this.posts = posts
      })
  }
}
```

Приведенный выше код намеревается получить список сообщений при инициализации компонента, но выборка будет вызываться дважды неожиданно из-за того, как работает компонент класса Vue.

Рекомендуется писать хуки жизненного цикла, такие как `created` вместо `constructor`:

```js
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Posts extends Vue {
  posts = []

  // Сделай это
  created() {
    fetch('/posts.json')
      .then(res => res.json())
      .then(posts => {
        this.posts = posts
      })
  }
}
```