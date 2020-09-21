# Hooks Auto-complete

Компонент класса Vue предоставляет встроенные типы ловушек, которые позволяют автозаполнение для `data`, `render` и других хуков жизненного цикла в объявлениях компонентов класса для TypeScript. Чтобы включить его, вам необходимо импортировать тип хуков, расположенный по адресу `vue-class-component/hooks`.

```ts
// main.ts
import 'vue-class-component/hooks' // тип перехватчиков импорта для включения автозаполнения
import Vue from 'vue'
import App from './App.vue'

new Vue({
  render: h => h(App)
}).$mount('#app')
```

Если вы хотите, чтобы он работал с пользовательскими хуками, вы можете вручную добавить его самостоятельно:

```ts
import Vue from 'vue'
import { Route, RawLocation } from 'vue-router'

declare module 'vue/types/vue' {
  // Тип экземпляра компонента дополнения
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


