# Обзор

Компонент класса Vue - это библиотека, которая позволяет создавать компоненты Vue в синтаксисе в стиле классов. Например, ниже представлен простой компонент счетчика, написанный с помощью компонента класса Vue:

```vue
<template>
  <div>
    <button v-on:click="decrement">-</button>
    {{ count }}
    <button v-on:click="increment">+</button>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

// Define the component in class-style
@Component
export default class Counter extends Vue {
  // Class properties will be component data
  count = 0

  // Methods will be component methods
  increment() {
    this.count++
  }

  decrement() {
    this.count--
  }
}
</script>
```

Как показывает пример, вы можете определить данные и методы компонентов в интуитивно понятном и стандартном синтаксисе класса, аннотируя класс с помощью декоратора `@ Component`. Вы можете просто заменить определение вашего компонента на компонент в стиле класса, поскольку он эквивалентен обычному объектному стилю опций для определения компонента.

Определяя свой компонент в стиле класса, вы не только меняете синтаксис, но также можете использовать некоторые функции языка ECMAScript, такие как наследование классов и декораторы. Компонент Vue Class также предоставляет [`mixins` helper](guide/extend-and-mixins.md#Mixins) для наследования миксинов и [`createDecorator` function](guide/custom-decorators.md) для лёгкого создания собственных декораторов.

Вы также можете проверить декораторы `@Prop` и `@Watch`, предоставленные [Vue Property Decorator](https://github.com/kaorun343/vue-property-decorator).
