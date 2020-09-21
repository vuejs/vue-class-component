# Компонент класса

Декоратор `@Component` делает ваш класс компонентом Vue:

```js
import Vue from 'vue'
import Component from 'vue-class-component'

// Класс HelloWorld будет компонентом Vue
@Component
export default class HelloWorld extends Vue {}
```

## Data

Исходные `data` могут быть объявлены как свойства класса:

```vue
<template>
  <div>{{ message }}</div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // Объявлено в качестве компонентных данных
  message = 'Hello World!'
}
</script>
```

Вышеупомянутый компонент отображает `Hello World!` в элементе `<div>` как `сообщение` является компонентом данных.

Обратите внимание, что если начальное значение является `undefined`, свойство класса не будет реактивным, что означает, что изменения свойств не будут обнаружены:

```js
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // `message` не будет реактивным значением
  message = undefined
}
```

Чтобы избежать этого, вы можете использовать значение `null` или вместо этого использовать ловушку `data`:

```js
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // `message` будет реагировать со значением `null`
  message = null

  // См. Раздел «Хуки» для подробностей о ловушке `data` внутри класса.
  data() {
    return {
      // `hello` будет реактивным, поскольку он объявлен через ловушку `data`.
      hello: undefined
    }
  }
}
```

## Методы

Компоненты `методы` могут быть объявлены непосредственно как методы прототипа класса:

```vue
<template>
  <button v-on:click="hello">Click</button>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // Заявлен как компонентный метод
  hello() {
    console.log('Hello World!')
  }
}
</script>
```

## Вычисленные свойства

Вычисляемые свойства могут быть объявлены как свойство класса getter/setter:

```vue
<template>
  <input v-model="name">
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  firstName = 'John'
  lastName = 'Doe'

  // Заявлено как вычисляемое свойство getter
  get name() {
    return this.firstName + ' ' + this.lastName
  }

  // Заявлено как вычисляемое свойство setter
  set name(value) {
    const splitted = value.split(' ')
    this.firstName = splitted[0]
    this.lastName = splitted[1] || ''
  }
}
</script>
```

## Hooks

`data`, `render` и все хуки жизненного цикла Vue также могут быть напрямую объявлены как методы прототипа класса, но вы не можете вызывать их в самом экземпляре. При объявлении пользовательских методов следует избегать этих зарезервированных имен.

```jsx
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // Объявить установленный хук жизненного цикла
  mounted() {
    console.log('mounted')
  }

  // Объявить функцию рендеринга
  render() {
    return <div>Hello World!</div>
  }
}
```

## Другие варианты

Для всех остальных параметров передайте их функции декоратора:

```vue
<template>
  <OtherComponent />
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import OtherComponent from './OtherComponent.vue'

@Component({
  // Укажите опцию `components`.
  // См. Все доступные параметры в документации Vue.js:
  // https://vuejs.org/v2/api/#Options-Data
  components: {
    OtherComponent
  }
})
export default class HelloWorld extends Vue {}
</script>
```