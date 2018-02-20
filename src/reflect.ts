import { VueConstructor } from 'vue'

export type StringToArrayMap = {
  [key: string]: Array<string>
}

export type ReflectionMap = {
  constructor: Array<string>,
  instance: StringToArrayMap,
  static: StringToArrayMap
}

export function reflectionIsSupported() {
  return (Reflect && Reflect.defineMetadata) !== undefined
}

export function copyReflectionMetadata(
  from: VueConstructor,
  to: VueConstructor,
  reflectionMap: ReflectionMap
) {
  shallowCopy(from.prototype, to.prototype, reflectionMap.instance)
  shallowCopy(from, to, reflectionMap.static)
  shallowCopy(from, to, {'constructor': reflectionMap.constructor})
}

function shallowCopy(from: VueConstructor, to: VueConstructor, propertyKeys: StringToArrayMap) {
  for (const propertyKey in propertyKeys) {
    propertyKeys[propertyKey].forEach((metadataKey) => {
      if (propertyKey == 'constructor') {
        const metadata = Reflect.getOwnMetadata(metadataKey, from)
        Reflect.defineMetadata(metadataKey, metadata, to)
      } else {
        const metadata = Reflect.getOwnMetadata(metadataKey, from, propertyKey)
        Reflect.defineMetadata(metadataKey, metadata, to, propertyKey)
      }
    })
  }
}
