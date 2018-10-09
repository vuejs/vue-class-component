import Vue, { VueConstructor } from 'vue'
import { VueClass } from './declarations'

export function reflectionIsSupported () {
  return (Reflect && Reflect.defineMetadata) !== undefined
}

export function copyReflectionMetadata (
  to: VueConstructor,
  from: VueClass<Vue>
) {
  forwardMetadata(to, from)

  Object.keys(from.prototype).forEach(key => {
    forwardMetadata(to.prototype, from.prototype, key)
  })

  Object.keys(from).forEach(key => {
    forwardMetadata(to, from, key)
  })
}

function forwardMetadata(to: object, from: object, propertyKey?: string): void {
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
