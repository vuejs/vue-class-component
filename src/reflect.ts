import { VueConstructor } from 'vue'
import 'reflect-metadata'

export type StringToArrayMap = {
    [key: string]: Array<string>
}

export type ReflectionMap = {
    instance: StringToArrayMap,
    static: StringToArrayMap
}

export function copyReflectionMetadata(
    from: VueConstructor,
    to: VueConstructor,
    reflectionMap: ReflectionMap
) {
  shallowCopy(from.prototype, to.prototype, reflectionMap.instance);
  shallowCopy(from, to, reflectionMap.static);
}

function shallowCopy(from: VueConstructor, to: VueConstructor, propertyKeys: StringToArrayMap) {
    for (const propertyKey in propertyKeys) {
        propertyKeys[propertyKey].forEach((metadataKey) => {
            const metadata = Reflect.getOwnMetadata(metadataKey, from, propertyKey)
            Reflect.defineMetadata(metadataKey, metadata, to, propertyKey)
        })
    }
}
