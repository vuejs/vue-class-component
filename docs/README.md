# Overview

:::warning
This library is no longer actively maintained. It is no longer recommend to use Class-based components in Vue 3. The recommended way to use Vue 3 in large applications is Single-File Components, Composition API, and `<script setup>`. If you still want to use classes, check out the community-maintained project [`vue-facing-decorator`](https://facing-dev.github.io/vue-facing-decorator/#/).

Additionally, if you're interested in migrating out of class components, you might find the CLI tool [`vue-class-migrator`](https://github.com/getyourguide/vue-class-migrator) helpful for the transition.

:::

Vue Class Component is a library that lets you make your Vue components in class-style syntax. For example, below is a simple counter component written with Vue Class Component:

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

As the example shows, you can define component data and methods in the intuitive and standard class syntax by annotating the class with the `@Component` decorator. You can simply replace your component definition with a class-style component as it is equivalent with the ordinary options object style of component definition.

By defining your component in class-style, you not only change the syntax but also can utilize some ECMAScript language features such as class inheritance and decorators. Vue Class Component also provides a [`mixins` helper](guide/extend-and-mixins.md#Mixins) for mixin inheritance, and a [`createDecorator` function](guide/custom-decorators.md) to create your own decorators easily.

You may also want to check out the `@Prop` and `@Watch` decorators provided by [Vue Property Decorator](https://github.com/kaorun343/vue-property-decorator).
