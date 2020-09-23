# Определение Реквизита

Не существует специального API для определения свойств, который предоставляет компонент класса Vue. Однако вы можете сделать это, используя канонический `Vue.extend` API:

```vue
<template>
  <div>{{ message }}</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

// Определите реквизиты, используя канонический способ Vue.
const GreetingProps = Vue.extend({
  props: {
    name: String
  }
})

// Используйте определенные свойства, расширяя GreetingProps.
@Component
export default class Greeting extends GreetingProps {
  get message(): string {
    // this.name будет напечатано
    return 'Hello, ' + this.name
  }
}
</script>
```

Поскольку `Vue.extend` подразумевает определенные типы опор, их можно использовать в компоненте вашего класса, расширив его.

Если у вас есть компонент суперкласса или миксины для расширения, используйте помощник `mixins`, чтобы объединить с ними определенные свойства:

```vue
<template>
  <div>{{ message }}</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component, { mixins } from 'vue-class-component'
import Super from './super'

// Определите реквизиты, используя канонический способ Vue.
const GreetingProps = Vue.extend({
  props: {
    name: String
  }
})

// Используйте помощник `mixins`, чтобы комбинировать определенные свойства и миксин.
@Component
export default class Greeting extends mixins(GreetingProps, Super) {
  get message(): string {
    // this.name будет набран
    return 'Hello, ' + this.name
  }
}
</script>
```
