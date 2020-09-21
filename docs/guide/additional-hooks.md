# Дополнительные хуки

Если вы используете плагины Vue, например [Vue Router](https://router.vuejs.org/), вы можете захотеть, чтобы компоненты класса разрешали предоставляемые ими перехватчики. В этом случае `Component.registerHooks` позволяет вам регистрировать такие хуки:

```js
// class-component-hooks.js
import Component from 'vue-class-component'

// Зарегистрируйте хуки маршрутизатора с их именами
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])
```

После регистрации хуков компонент класса реализует их как методы прототипа класса:

```js
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloWorld extends Vue {
  // Компонент класса теперь обрабатывает beforeRouteEnter,
  // beforeRouteUpdate и beforeRouteLeave как хуки Vue Router
  beforeRouteEnter(to, from, next) {
    console.log('beforeRouteEnter')
    next()
  }

  beforeRouteUpdate(to, from, next) {
    console.log('beforeRouteUpdate')
    next()
  }

  beforeRouteLeave(to, from, next) {
    console.log('beforeRouteLeave')
    next()
  }
}
```

Рекомендуется записать этот регистрационный код в отдельный файл, потому что вы должны зарегистрировать их до любых определений компонентов. Вы можете убедиться в порядке выполнения, поместив оператор `import` для регистрации хуков вверху основного файла:

```js
// main.js

// Обязательно зарегистрируйтесь перед импортом любых компонентов
import './class-component-hooks'

import Vue from 'vue'
import App from './App'

new Vue({
  el: '#app',
  render: h => h(App)
})
```