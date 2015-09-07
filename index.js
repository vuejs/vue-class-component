var Vue = require('vue')

var internalHooks = [
  'created',
  'ready',
  'beforeCompile',
  'compiled', 
  'beforeDestroy',
  'destroyed',
  'attached', 
  'detached'
]

function decorator (Component) {
  var options = {}
  // instance properties are data
  var data = new Component()
  if (Object.keys(data).length) {
    options.data = function () {
      return clone(data)
    }
  }
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
  // copy static options
  Object.keys(Component).forEach(function (key) {
    options[key] = Component[key]
  })
  // find super
  var Super = proto.__proto__.constructor
  if (!(Super instanceof Vue)) {
    Super = Vue
  }
  return Super.extend(options)
}

function clone (val) {
  if (val === null || typeof val !== 'object') {
    return val
  } else if (Array.isArray(val)) {
    return val.map(clone)
  } else {
    var res = {}
    Object.keys(val).forEach(function (key) {
      res[key] = clone(val[key])
    })
    return res
  }
}

module.exports = decorator
