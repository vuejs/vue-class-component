# Справочник по API

## `@Component([options])`

- **Аргументы**
  - `{Object} [options]`

Декоратор для определения компонентов стиля класса. Вы можете передать [параметры компонента Vue](https://vuejs.org/v2/api/#Options-Data) через необязательный 1-й аргумент.

Смотрите также: [Class Component](../guide/class-component.md)

## `Component.registerHooks(hooks)`

- **Аргументы**
  - `{Array} hooks`

Регистрирует имена методов, которые компоненты класса обрабатывают как перехватчики.

См. [Additional Hooks](../guide/additional-hooks.md) для получения более подробной информации.

## `createDecorator(callback)`

- **Аргументы**
  - `{Function} callback`
- **Возврат**
  - `{Function}`

Создает новый декоратор, который обрабатывает компоненты класса.

See [Custom Decorators](../guide/custom-decorators.md) for more details.

## Встроенные методы перехвата

Ниже приведены встроенные имена ловушек, которые компоненты класса рассматривают как специальные методы.

- data
- beforeCreate
- created
- beforeMount
- mounted
- beforeDestroy
- destroyed
- beforeUpdate
- updated
- activated
- deactivated
- render
- errorCaptured
- serverPrefetch

Они не будут регистрироваться как методы компонентов, а как хуки (жизненного цикла). Вам следует избегать этих зарезервированных имен, если ваши свойства или методы не должны быть такими хуками.

Смотрите также: [Hooks](../guide/class-component.md#Hooks)

## Типы встроенных методов перехвата

Доступно только в TypeScript. Он позволяет автоматически заполнять встроенные методы хуков после импорта:

```ts
import 'vue-class-component/hooks'
```
