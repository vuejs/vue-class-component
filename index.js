var Vue = require('vue')

var internalHooks = [
  'data',
  'el',
  'init',
  'created',
  'ready',
  'beforeCompile',
  'compiled',
  'beforeDestroy',
  'destroyed',
  'attached',
  'detached',
  'activate'
]

function decorator (options) {
  return function (Component) {
    options.name = options.name || Component.name
    // prototype props.
    var proto = Component.prototype
    Object.getOwnPropertyNames(proto).forEach(function (key) {
      if (key === 'constructor') {
        return
      }
      // hooks
      if (internalHooks.indexOf(key) > -1) {
        options[key] = proto[key]
        return
      }
      var descriptor = Object.getOwnPropertyDescriptor(proto, key)
      if (typeof descriptor.value === 'function') {
        // methods
        (options.methods || (options.methods = {}))[key] = descriptor.value
      } else if (descriptor.get || descriptor.set) {
        // computed properties
        (options.computed || (options.computed = {}))[key] = {
          get: descriptor.get,
          set: descriptor.set
        }
      }
    })
    // find super
    var Super = proto.__proto__.constructor
    if (!(Super instanceof Vue)) {
      Super = Vue
    }
    return Super.extend(options)
  }
}

module.exports = decorator
