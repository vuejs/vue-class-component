# Расширение и миксины

## Расширить

Вы можете расширить существующий компонент класса как наследование собственного класса. Представьте, что у вас есть следующий компонент суперкласса:

```js
// super.js
import Vue from 'vue'
import Component from 'vue-class-component'

// Определите компонент суперкласса
@Component
export default class Super extends Vue {
  superValue = 'Hello'
}
```

Вы можете расширить его, используя синтаксис наследования собственного класса:

```js
import Super from './super'
import Component from 'vue-class-component'

// Расширение компонента суперкласса
@Component
export default class HelloWorld extends Super {
  created() {
    console.log(this.superValue) // -> Привет
  }
}
```

Обратите внимание, что каждый суперкласс должен быть компонентом класса. Другими словами, он должен наследовать конструктор `Vue` в качестве предка и украшаться декоратором `@Component`.

## Миксины

Компонент класса Vue предоставляет вспомогательную функцию `mixins` для использования [mixins](https://vuejs.org/v2/guide/mixins.html) в стиле класса.  
Используя помощник `mixins`, TypeScript может определять типы миксинов и наследовать их от типа компонента.

Пример объявления миксинов `Hello` и `World`:

```js
// mixins.js
import Vue from 'vue'
import Component from 'vue-class-component'

// Вы можете объявить миксины в том же стиле, что и компоненты.
@Component
export class Hello extends Vue {
  hello = 'Hello'
}

@Component
export class World extends Vue {
  world = 'World'
}
```

Используйте их в компоненте стиля класса:

```js
import Component, { mixins } from 'vue-class-component'
import { Hello, World } from './mixins'

// Используйте вспомогательную функцию `mixins` вместо `Vue`.
// `mixins` может принимать любое количество аргументов.
@Component
export class HelloWorld extends mixins(Hello, World) {
  created () {
    console.log(this.hello + ' ' + this.world + '!') // -> Hello World!
  }
}
```

Как и суперкласс, все миксины должны быть объявлены как компоненты класса.
