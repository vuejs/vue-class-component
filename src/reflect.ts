import Vue, { VueConstructor } from 'vue'
import { VueClass } from './declarations'

// За подробной проверкой Reflect-feature, приведенной ниже, является то, что есть полифиллы.
// которые добавляют реализацию для Reflect.defineMetadata, но не для Reflect.getOwnMetadataKeys.
// Без этой проверки потребители столкнутся с трудно обнаруживаемыми ошибками времени выполнения.
export function reflectionIsSupported () {
  return typeof Reflect !== 'undefined' && Reflect.defineMetadata && Reflect.getOwnMetadataKeys
}

export function copyReflectionMetadata (
  to: VueConstructor,
  from: VueClass<Vue>
) {
  forwardMetadata(to, from)

  Object.getOwnPropertyNames(from.prototype).forEach(key => {
    forwardMetadata(to.prototype, from.prototype, key)
  })

  Object.getOwnPropertyNames(from).forEach(key => {
    forwardMetadata(to, from, key)
  })
}

function forwardMetadata (to: object, from: object, propertyKey?: string): void {
  const metaKeys = propertyKey
    ? Reflect.getOwnMetadataKeys(from, propertyKey)
    : Reflect.getOwnMetadataKeys(from)

  metaKeys.forEach(metaKey => {
    const metadata = propertyKey
      ? Reflect.getOwnMetadata(metaKey, from, propertyKey)
      : Reflect.getOwnMetadata(metaKey, from)

    if (propertyKey) {
      Reflect.defineMetadata(metaKey, metadata, to, propertyKey)
    } else {
      Reflect.defineMetadata(metaKey, metadata, to)
    }
  })
}
