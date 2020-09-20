import Vue, { ComponentOptions } from 'vue'
import { copyReflectionMetadata, reflectionIsSupported } from './reflect'
import { VueClass, DecoratedClass } from './declarations'
import { collectDataFromConstructor } from './data'
import { hasProto, isPrimitive, warn } from './util'

export const $internalHooks = [
  'data',
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeDestroy',
  'destroyed',
  'beforeUpdate',
  'updated',
  'activated',
  'deactivated',
  'render',
  'errorCaptured', // 2.5
  'serverPrefetch' // 2.6
]

export function componentFactory (
  Component: VueClass<Vue>,
  options: ComponentOptions<Vue> = {}
): VueClass<Vue> {
  options.name = options.name || (Component as any)._componentTag || (Component as any).name
  // прототип реквизита.
  const proto = Component.prototype
  Object.getOwnPropertyNames(proto).forEach(function (key) {
    if (key === 'constructor') {
      return
    }

    // крючки
    if ($internalHooks.indexOf(key) > -1) {
      options[key] = proto[key]
      return
    }
    const descriptor = Object.getOwnPropertyDescriptor(proto, key)!
    if (descriptor.value !== void 0) {
      // методы
      if (typeof descriptor.value === 'function') {
        (options.methods || (options.methods = {}))[key] = descriptor.value
      } else {
        // машинописные декорированные данные
        (options.mixins || (options.mixins = [])).push({
          data (this: Vue) {
            return { [key]: descriptor.value }
          }
        })
      }
    } else if (descriptor.get || descriptor.set) {
      // вычисленные свойства
      (options.computed || (options.computed = {}))[key] = {
        get: descriptor.get,
        set: descriptor.set
      }
    }
  })

  // добавить обработчик данных для сбора свойств класса как данных экземпляра Vue
  ;(options.mixins || (options.mixins = [])).push({
    data (this: Vue) {
      return collectDataFromConstructor(this, Component)
    }
  })

  // варианты украшения
  const decorators = (Component as DecoratedClass).__decorators__
  if (decorators) {
    decorators.forEach(fn => fn(options))
    delete (Component as DecoratedClass).__decorators__
  }

  // найти супер
  const superProto = Object.getPrototypeOf(Component.prototype)
  const Super = superProto instanceof Vue
    ? superProto.constructor as VueClass<Vue>
    : Vue
  const Extended = Super.extend(options)

  forwardStaticMembers(Extended, Component, Super)

  if (reflectionIsSupported()) {
    copyReflectionMetadata(Extended, Component)
  }

  return Extended
}

const reservedPropertyNames = [
  // Уникальный идентификатор
  'cid',

  // Конструктор Super Vue
  'super',

  // Параметры компонента, которые будет использовать компонент
  'options',
  'superOptions',
  'extendOptions',
  'sealedOptions',

  // Частные активы
  'component',
  'directive',
  'filter'
]

const shouldIgnore = {
  prototype: true,
  arguments: true,
  callee: true,
  caller: true
}

function forwardStaticMembers (
  Extended: typeof Vue,
  Original: typeof Vue,
  Super: typeof Vue
): void {
  // Мы должны использовать getOwnPropertyNames, поскольку Babel регистрирует методы как неперечислимые
  Object.getOwnPropertyNames(Original).forEach(key => {
    // Пропустите свойства, которые нельзя перезаписывать
    if (shouldIgnore[key]) {
      return
    }

    // Некоторые браузеры не позволяют перенастроить встроенные свойства
    const extendedDescriptor = Object.getOwnPropertyDescriptor(Extended, key)
    if (extendedDescriptor && !extendedDescriptor.configurable) {
      return
    }

    const descriptor = Object.getOwnPropertyDescriptor(Original, key)!

    // Если пользовательский агент не поддерживает `__proto__` или его семейство (IE <= 10),
    // свойства подкласса могут быть унаследованы от суперкласса в TypeScript.
    // Нам необходимо исключить такие свойства, чтобы предотвратить перезапись
    // объекта параметров компонента, который хранится в расширенном конструкторе. (See #192).
    // Если значение является ссылочным значением (объектом или функцией),
    // мы можем проверить их равенство и исключить его, если они имеют одинаковую ссылку.
    // Если это примитивное значение, оно будет отправлено в целях безопасности.
    if (!hasProto) {
      // Только cid явно исключается из пересылки свойств, потому что мы не можем определить,
      // является ли это унаследованным свойством или нет в среде no `__proto__`,
      // даже если свойство зарезервировано.
      if (key === 'cid') {
        return
      }

      const superDescriptor = Object.getOwnPropertyDescriptor(Super, key)

      if (
        !isPrimitive(descriptor.value) &&
        superDescriptor &&
        superDescriptor.value === descriptor.value
      ) {
        return
      }
    }

    // Предупреждать, если пользователи вручную объявляют зарезервированные свойства
    if (
      process.env.NODE_ENV !== 'production' &&
      reservedPropertyNames.indexOf(key) >= 0
    ) {
      warn(
        `Имя статического свойства '${key}', объявленное в классе '${Original.name}', ` +
        'конфликтует с зарезервированным именем свойства Vue internal. ' +
        'Это может вызвать неожиданное поведение компонента. Рассмотрите возможность его переименования.'
      )
    }

    Object.defineProperty(Extended, key, descriptor)
  })
}
