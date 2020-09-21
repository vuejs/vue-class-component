/**
  * vue-class-component v8.0.0-alpha.6
  * (c) 2015-present Evan You
  * @license MIT
  */
var VueClassComponent = (function (exports, vue) {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Невозможно вызвать класс как функцию");
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
      throw new TypeError("Супервыражение должно быть либо нулевым, либо функцией");
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

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("это не было инициализировано - super() не был вызван");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function () {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Недопустимая попытка распространить не повторяемый экземпляр. \ NДля того, чтобы быть итерируемым, объекты, не являющиеся массивом, должны иметь метод [Symbol.iterator]().");
  }

  function defineGetter(obj, key, getter) {
    Object.defineProperty(obj, key, {
      get: getter,
      enumerable: false,
      configurable: true
    });
  }

  function defineProxy(proxy, key, target) {
    Object.defineProperty(proxy, key, {
      get: function get() {
        return target[key];
      },
      set: function set(value) {
        target[key] = value;
      },
      enumerable: true,
      configurable: true
    });
  }

  function getSuperOptions(Ctor) {
    var superProto = Object.getPrototypeOf(Ctor.prototype);

    if (!superProto) {
      return undefined;
    }

    var Super = superProto.constructor;
    return Super.__vccOpts;
  }

  var VueImpl = /*#__PURE__*/function () {
    function VueImpl(props, ctx) {
      var _this = this;

      _classCallCheck(this, VueImpl);

      defineGetter(this, '$props', function () {
        return props;
      });
      defineGetter(this, '$attrs', function () {
        return ctx.attrs;
      });
      defineGetter(this, '$slots', function () {
        return ctx.slots;
      });
      defineGetter(this, '$emit', function () {
        return ctx.emit;
      });
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


    _createClass(VueImpl, null, [{
      key: "registerHooks",
      value: function registerHooks(keys) {
        var _this$__vccHooks;

        (_this$__vccHooks = this.__vccHooks).push.apply(_this$__vccHooks, _toConsumableArray(keys));
      }
    }, {
      key: "__vccOpts",
      get: function get() {
        // Ранний возврат, если `this` является базовым классом, так как у него нет никаких опций
        if (this === Vue) {
          return {};
        }

        var cache = this.hasOwnProperty('__vccCache') && this.__vccCache;

        if (cache) {
          return cache;
        }

        var Ctor = this; // Если параметры предоставляются через декоратор, используйте его как основу

        var options = this.__vccCache = this.hasOwnProperty('__vccBase') ? _objectSpread2({}, this.__vccBase) : {}; // Обрабатывать варианты суперкласса

        options["extends"] = getSuperOptions(Ctor); // Обработка миксинов

        var mixins = this.hasOwnProperty('__vccMixins') && this.__vccMixins;

        if (mixins) {
          options.mixins = options.mixins ? options.mixins.concat(mixins) : mixins;
        }

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
          } // вычисленные свойства


          if (descriptor.get || descriptor.set) {
            options.computed[key] = {
              get: descriptor.get,
              set: descriptor.set
            };
            return;
          }
        });

        options.setup = function (props, ctx) {
          var data = new Ctor(props, ctx);
          var dataKeys = Object.keys(data);
          var plainData = vue.reactive({}); // Инициализировать реактивные данные и преобразовать конструктор this в прокси

          dataKeys.forEach(function (key) {
            // Пропустите, если значение не определено, чтобы не сделать его реактивным.
            // Если значение имеет `__s`, это значение из помощника `setup`, продолжить его позже.
            if (data[key] === undefined || data[key] && data[key].__s) {
              return;
            }

            plainData[key] = data[key];
            defineProxy(data, key, plainData);
          }); // Вызов функций композиции

          dataKeys.forEach(function (key) {
            if (data[key] && data[key].__s) {
              plainData[key] = data[key].__s();
            }
          });
          return plainData;
        };

        var decorators = this.hasOwnProperty('__vccDecorators') && this.__vccDecorators;

        if (decorators) {
          decorators.forEach(function (fn) {
            return fn(options);
          });
        } // из Vue Loader


        var injections = ['render', 'ssrRender', '__file', '__cssModules', '__scopeId', '__hmrId'];
        injections.forEach(function (key) {
          if (Ctor[key]) {
            options[key] = Ctor[key];
          }
        });
        return options;
      }
    }]);

    return VueImpl;
  }();
  /** @internal */


  VueImpl.__vccHooks = ['data', 'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUnmount', 'unmounted', 'beforeUpdate', 'updated', 'activated', 'deactivated', 'render', 'errorCaptured', 'serverPrefetch'];
  var Vue = VueImpl;

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
    for (var _len = arguments.length, Ctors = new Array(_len), _key = 0; _key < _len; _key++) {
      Ctors[_key] = arguments[_key];
    }

    var _a;

    return _a = /*#__PURE__*/function (_Vue) {
      _inherits(MixedVue, _Vue);

      var _super = _createSuper(MixedVue);

      function MixedVue(props, ctx) {
        var _this;

        _classCallCheck(this, MixedVue);

        _this = _super.call(this, props, ctx);
        Ctors.forEach(function (Ctor) {
          var data = new Ctor(props, ctx);
          Object.keys(data).forEach(function (key) {
            _this[key] = data[key];
          });
        });
        return _this;
      }

      return MixedVue;
    }(Vue), _a.__vccMixins = Ctors.map(function (Ctor) {
      return Ctor.__vccOpts;
    }), _a;
  }
  function setup(setupFn) {
    // Взломать, чтобы отложить вызов функции настройки.
    // Будет вызываться после работы со свойствами класса.
    return {
      __s: setupFn
    };
  }

  exports.Options = Options;
  exports.Vue = Vue;
  exports.createDecorator = createDecorator;
  exports.mixins = mixins;
  exports.setup = setup;

  return exports;

}({}, Vue));
