# Props Definition

There is no dedicated API for props definition that Vue Class Component provides. You, however, can do that by using canonical `Vue.extend` API:

```vue
<template>
  <div>{{ message }}</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

// Define the props by using Vue's canonical way.
const GreetingProps = Vue.extend({
  props: {
    name: String
  }
})

// Use defined props by extending GreetingProps.
@Component
export default class Greeting extends GreetingProps {
  get message(): string {
    // this.name will be typed
    return 'Hello, ' + this.name
  }
}
</script>
```

As `Vue.extend` infers defined prop types, it is possible to use them in your class component by extending it.

If you have a super class component or mixins to extend, use `mixins` helper to combine defined props with them:

```vue
<template>
  <div>{{ message }}</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component, { mixins } from 'vue-class-component'
import Super from './super'

// Define the props by using Vue's canonical way.
const GreetingProps = Vue.extend({
  props: {
    name: String
  }
})

// Use `mixins` helper to combine defined props and a mixin.
@Component
export default class Greeting extends mixins(GreetingProps, Super) {
  get message(): string {
    // this.name will be typed
    return 'Hello, ' + this.name
  }
}
</script>
```
