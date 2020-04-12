/**
  * vue-class-component v8.0.0-alpha.2
  * (c) 2015-present Evan You
  * @license MIT
  */
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function isFunction(value) {
  return typeof value === 'function';
}

function getSuperOptions(Ctor) {
  var superProto = Object.getPrototypeOf(Ctor.prototype);

  if (!superProto) {
    return undefined;
  }

  var Super = superProto.constructor;
  return Super.__vccOpts;
}

class Vue {
  constructor(props) {
    this.$props = props;
    Object.keys(props).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: props[key]
      });
    });
  }
  /** @internal */


  static get __vccOpts() {
    // Early return if `this` is base class as it does not have any options
    if (this === Vue) {
      return {};
    }

    var cache = this.hasOwnProperty('__vccCache') && this.__vccCache;

    if (cache) {
      return cache;
    }

    var Ctor = this; // If the options are provided via decorator use it as a base

    var options = this.__vccCache = this.hasOwnProperty('__vccBase') ? _objectSpread2({}, this.__vccBase) : {}; // Handle super class options

    options.extends = getSuperOptions(Ctor); // Handle mixins

    var mixins = this.hasOwnProperty('__vccMixins') && this.__vccMixins;

    if (mixins) {
      options.mixins = options.mixins ? options.mixins.concat(mixins) : mixins;
    } // Class name -> component name


    options.name = options.name || Ctor.name;
    options.methods = _objectSpread2({}, options.methods);
    options.computed = _objectSpread2({}, options.computed);
    var proto = Ctor.prototype;
    Object.getOwnPropertyNames(proto).forEach(key => {
      if (key === 'constructor') {
        return;
      } // hooks


      if (Ctor.__vccHooks.indexOf(key) > -1) {
        options[key] = proto[key];
        return;
      }

      var descriptor = Object.getOwnPropertyDescriptor(proto, key); // methods

      if (typeof descriptor.value === 'function') {
        options.methods[key] = descriptor.value;
        return;
      } // computed properties


      if (descriptor.get || descriptor.set) {
        options.computed[key] = {
          get: descriptor.get,
          set: descriptor.set
        };
        return;
      }
    }); // Class properties -> reactive data

    var hookDataOption = options.data;

    options.data = function () {
      var hookData = isFunction(hookDataOption) ? hookDataOption.call(this, this) : hookDataOption; // should be acquired class property values

      var data = new Ctor(this.$props); // create plain data object

      var plainData = {};
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && key !== '$props') {
          plainData[key] = data[key];
        }
      });
      return _objectSpread2({}, hookData, {}, plainData);
    };

    var decorators = this.hasOwnProperty('__vccDecorators') && this.__vccDecorators;

    if (decorators) {
      decorators.forEach(fn => fn(options));
    } // from Vue Loader


    if (Ctor.render) {
      options.render = Ctor.render;
    }

    if (Ctor.__file) {
      options.__file = Ctor.__file;
    }

    if (Ctor.__cssModules) {
      options.__cssModules = Ctor.__cssModules;
    }

    if (Ctor.__scopeId) {
      options.__scopeId = Ctor.__scopeId;
    }

    return options;
  }

  static registerHooks(keys) {
    this.__vccHooks.push(...keys);
  }

}
/** @internal */

Vue.__vccHooks = ['data', 'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUnmount', 'unmounted', 'beforeUpdate', 'updated', 'activated', 'deactivated', 'render', 'errorCaptured', 'serverPrefetch'];

function Options(options) {
  return Component => {
    Component.__vccBase = options;
    return Component;
  };
}
function createDecorator(factory) {
  return (target, key, index) => {
    var Ctor = typeof target === 'function' ? target : target.constructor;

    if (!Ctor.__vccDecorators) {
      Ctor.__vccDecorators = [];
    }

    if (typeof index !== 'number') {
      index = undefined;
    }

    Ctor.__vccDecorators.push(options => factory(options, key, index));
  };
}
function mixins() {
  var _a;

  for (var _len = arguments.length, Ctors = new Array(_len), _key = 0; _key < _len; _key++) {
    Ctors[_key] = arguments[_key];
  }

  return _a = class MixedVue extends Vue {}, _a.__vccMixins = Ctors.map(Ctor => Ctor.__vccOpts), _a;
}

export { Options, Vue, createDecorator, mixins };
