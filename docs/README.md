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

// Определите компонент в стиле класса
@Component
export default class Counter extends Vue {
  // Свойства класса будут данными компонента
  count = 0

  // Методы будут компонентными методами
  increment() {
    this.count++
  }

  decrement() {
    this.count--
  }
}
</script>
```

Как показывает пример, вы можете определить данные и методы компонентов в интуитивно понятном и стандартном синтаксисе класса, аннотируя класс с помощью декоратора `@Component`. Вы можете просто заменить определение компонента на компонент в стиле класса, поскольку он эквивалентен обычному объектному стилю опций для определения компонента.

Определяя свой компонент в стиле класса, вы не только меняете синтаксис, но также можете использовать некоторые функции языка ECMAScript, такие как наследование классов и декораторы. Компонент Vue Class также предоставляет [`mixins` helper](guide/extend-and-mixins.md#Mixins) для наследования миксинов и [`createDecorator` function](guide/custom-decorators.md) для лёгкого создания собственных декораторов.

Вы также можете проверить декораторы `@Prop` и `@Watch`, предоставленные [Vue Property Decorator](https://github.com/kaorun343/vue-property-decorator).
