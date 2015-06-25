var Vue

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

function decorate (Component) {
  var capture = new Component(false)
  var options = {}
  // instance properties are data
  var fields = Object.keys(capture)
  if (fields.length) {
    options.data = function () {
      return clone(capture)
    }
  }
  // prototype props.
  // only need to identify hooks and methods.
  // computed properties just work!
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
    // methods
    var descriptor = Object.getOwnPropertyDescriptor(proto, key)
    if (typeof descriptor.value === 'function') {
      (options.methods || (options.methods = {}))[key] = descriptor.value
    }
  })
  // copy static options
  Object.keys(Component).forEach(function (key) {
    options[key] = Component[key]
  })
  // set options
  var Super = proto.__proto__.constructor
  Component.options = Vue.util.mergeOptions(Super.options, options)
  Component['super'] = Super
  Component.extend = Super.extend
  // asset registers
  Vue.config._assetTypes.forEach(function (type) {
    Component[type] = Super[type]
  })
}

function clone (val) {
  if (typeof val !== 'object') {
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

function install (externalVue) {
  Vue = externalVue
  Vue.componentClass = decorate
}

module.exports = install
