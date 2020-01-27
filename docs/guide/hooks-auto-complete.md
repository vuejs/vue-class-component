# Hooks Auto-complete

Vue Class Component provides built-in hook types, which enables auto-complete for `data`, `render` and other lifecycle hooks in class component declarations, for TypeScript. To enable it, you need to import hooks type located at `vue-class-component/hooks`.

```ts
// main.ts
import 'vue-class-component/hooks' // import hooks type to enable auto-complete
import Vue from 'vue'
import App from './App.vue'

new Vue({
  render: h => h(App)
}).$mount('#app')
```

If you want to make it work with custom hooks, you can manually add it by yourself:

```ts
import Vue from 'vue'
import { Route, RawLocation } from 'vue-router'

declare module 'vue/types/vue' {
  // Augment component instance type
  interface Vue {
    beforeRouteEnter?(
      to: Route,
      from: Route,
      next: (to?: RawLocation | false | ((vm: Vue) => void)) => void
    ): void

    beforeRouteLeave?(
      to: Route,
      from: Route,
      next: (to?: RawLocation | false | ((vm: Vue) => void)) => void
    ): void

    beforeRouteUpdate?(
      to: Route,
      from: Route,
      next: (to?: RawLocation | false | ((vm: Vue) => void)) => void
    ): void
  }
}
```


