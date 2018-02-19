/**
 * global type declarations in this project
 * should not expose to userland
 */

declare namespace Reflect {
  function decorate(decorators: ClassDecorator[], target: Function): Function
  function decorate(decorators: (PropertyDecorator | MethodDecorator)[], target: Object, propertyKey: string | symbol, attributes?: PropertyDescriptor): PropertyDescriptor
  function metadata(metadataKey: any, metadataValue: any): {
   (target: Function): void
   (target: Object, propertyKey: string | symbol): void
  }
  function defineMetadata(metadataKey: any, metadataValue: any, target: Object): void
  function defineMetadata(metadataKey: any, metadataValue: any, target: Object, propertyKey: string | symbol): void
  function hasMetadata(metadataKey: any, target: Object): boolean
  function hasMetadata(metadataKey: any, target: Object, propertyKey: string | symbol): boolean
  function hasOwnMetadata(metadataKey: any, target: Object): boolean
  function hasOwnMetadata(metadataKey: any, target: Object, propertyKey: string | symbol): boolean
  function getMetadata(metadataKey: any, target: Object): any
  function getMetadata(metadataKey: any, target: Object, propertyKey: string | symbol): any
  function getOwnMetadata(metadataKey: any, target: Object): any
  function getOwnMetadata(metadataKey: any, target: Object, propertyKey: string | symbol): any
  function getMetadataKeys(target: Object): any[]
  function getMetadataKeys(target: Object, propertyKey: string | symbol): any[]
  function getOwnMetadataKeys(target: Object): any[]
  function getOwnMetadataKeys(target: Object, propertyKey: string | symbol): any[]
  function deleteMetadata(metadataKey: any, target: Object): boolean
  function deleteMetadata(metadataKey: any, target: Object, propertyKey: string | symbol): boolean
 }

declare const process: {
  env: {
    NODE_ENV: string
  }
}
