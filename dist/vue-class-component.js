/**
  * vue-class-component v8.0.0-alpha.2
  * (c) 2015-present Evan You
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.VueClassComponent = {}));
}(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

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

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
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

  var Vue =
  /*#__PURE__*/
  function () {
    function Vue(props) {
      var _this = this;

      _classCallCheck(this, Vue);

      this.$props = props;
      Object.keys(props).forEach(function (key) {
        Object.defineProperty(_this, key, {
          enumerable: false,
          configurable: true,
          writable: true,
          value: props[key]
        });
      });
    }
    /** @internal */


    _createClass(Vue, null, [{
      key: "registerHooks",
      value: function registerHooks(keys) {
        var _this$__vccHooks;

        (_this$__vccHooks = this.__vccHooks).push.apply(_this$__vccHooks, _toConsumableArray(keys));
      }
    }, {
      key: "__vccOpts",
      get: function get() {
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

        options["extends"] = getSuperOptions(Ctor); // Handle mixins

        var mixins = this.hasOwnProperty('__vccMixins') && this.__vccMixins;

        if (mixins) {
          options.mixins = options.mixins ? options.mixins.concat(mixins) : mixins;
        } // Class name -> component name


        options.name = options.name || Ctor.name;
        options.methods = _objectSpread2({}, options.methods);
        options.computed = _objectSpread2({}, options.computed);
        var proto = Ctor.prototype;
        Object.getOwnPropertyNames(proto).forEach(function (key) {
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
          Object.keys(data).forEach(function (key) {
            if (data[key] !== undefined && key !== '$props') {
              plainData[key] = data[key];
            }
          });
          return _objectSpread2({}, hookData, {}, plainData);
        };

        var decorators = this.hasOwnProperty('__vccDecorators') && this.__vccDecorators;

        if (decorators) {
          decorators.forEach(function (fn) {
            return fn(options);
          });
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
    }]);

    return Vue;
  }();
  /** @internal */

  Vue.__vccHooks = ['data', 'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUnmount', 'unmounted', 'beforeUpdate', 'updated', 'activated', 'deactivated', 'render', 'errorCaptured', 'serverPrefetch'];

  function Options(options) {
    return function (Component) {
      Component.__vccBase = options;
      return Component;
    };
  }
  function createDecorator(factory) {
    return function (target, key, index) {
      var Ctor = typeof target === 'function' ? target : target.constructor;

      if (!Ctor.__vccDecorators) {
        Ctor.__vccDecorators = [];
      }

      if (typeof index !== 'number') {
        index = undefined;
      }

      Ctor.__vccDecorators.push(function (options) {
        return factory(options, key, index);
      });
    };
  }
  function mixins() {
    var _a;

    for (var _len = arguments.length, Ctors = new Array(_len), _key = 0; _key < _len; _key++) {
      Ctors[_key] = arguments[_key];
    }

    return _a =
    /*#__PURE__*/
    function (_Vue) {
      _inherits(MixedVue, _Vue);

      function MixedVue() {
        _classCallCheck(this, MixedVue);

        return _possibleConstructorReturn(this, _getPrototypeOf(MixedVue).apply(this, arguments));
      }

      return MixedVue;
    }(Vue), _a.__vccMixins = Ctors.map(function (Ctor) {
      return Ctor.__vccOpts;
    }), _a;
  }

  exports.Options = Options;
  exports.Vue = Vue;
  exports.createDecorator = createDecorator;
  exports.mixins = mixins;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
