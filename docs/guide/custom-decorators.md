# Пользовательские декораторы

Вы можете расширить функциональность этой библиотеки, создав свои собственные декораторы. Компонент класса Vue предоставляет помощник `createDecorator` для создания собственных декораторов. `createDecorator` ожидает функцию обратного вызова в качестве 1-го аргумента, и обратный вызов получит следующие аргументы:

- `options`: Объект параметров компонента Vue. Изменения этого объекта повлияют на предоставленный компонент.
- `key`: Ключ свойства или метода, к которому применяется декоратор.
- `parameterIndex`: Индекс декорированного аргумента, если для аргумента используется пользовательский декоратор.

Пример создания декоратора `Log`, который печатает сообщение журнала с именем метода и переданными аргументами при вызове декорированного метода:

```js
// decorators.js
import { createDecorator } from 'vue-class-component'

// Объявите декоратор журнала.
export const Log = createDecorator((options, key) => {
  // Сохраните исходный метод на будущее.
  const originalMethod = options.methods[key]

  // Оберните метод логикой ведения журнала.
  options.methods[key] = function wrapperMethod(...args) {
    // Print a log.
    console.log(`Invoked: ${key}(`, ...args, ')')

    // Вызвать исходный метод.
    originalMethod.apply(this, args)
  }
})
```

Используя его как декоратор метода:

```js
import Vue from 'vue'
import Component from 'vue-class-component'
import { Log } from './decorators'

@Component
class MyComp extends Vue {
  // Он печатает журнал при вызове метода `hello`.
  @Log
  hello(value) {
    // ...
  }
}
```

В приведенном выше коде, когда метод `hello` вызывается с `42`, будет напечатан следующий журнал:

```
Invoked: hello( 42 )
```