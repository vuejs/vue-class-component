/**
  * vue-class-component v7.2.6
  * (c) 2015-present Evan You
  * @license MIT
  */
import Vue from 'vue';

// За подробной проверкой Reflect-feature, приведенной ниже, является то, что есть полифиллы,
// которые добавляют реализацию для Reflect.defineMetadata, но не для Reflect.getOwnMetadataKeys.
// Без этой проверки потребители столкнутся с трудно обнаруживаемыми ошибками времени выполнения.
function reflectionIsSupported() {
  return typeof Reflect !== 'undefined' && Reflect.defineMetadata && Reflect.getOwnMetadataKeys;
}
function copyReflectionMetadata(to, from) {
  forwardMetadata(to, from);
  Object.getOwnPropertyNames(from.prototype).forEach(key => {
    forwardMetadata(to.prototype, from.prototype, key);
  });
  Object.getOwnPropertyNames(from).forEach(key => {
    forwardMetadata(to, from, key);
  });
}

function forwardMetadata(to, from, propertyKey) {
  var metaKeys = propertyKey ? Reflect.getOwnMetadataKeys(from, propertyKey) : Reflect.getOwnMetadataKeys(from);
  metaKeys.forEach(metaKey => {
    var metadata = propertyKey ? Reflect.getOwnMetadata(metaKey, from, propertyKey) : Reflect.getOwnMetadata(metaKey, from);

    if (propertyKey) {
      Reflect.defineMetadata(metaKey, metadata, to, propertyKey);
    } else {
      Reflect.defineMetadata(metaKey, metadata, to);
    }
  });
}

var fakeArray = {
  __proto__: []
};
var hasProto = fakeArray instanceof Array;
function createDecorator(factory) {
  return (target, key, index) => {
    var Ctor = typeof target === 'function' ? target : target.constructor;

    if (!Ctor.__decorators__) {
      Ctor.__decorators__ = [];
    }

    if (typeof index !== 'number') {
      index = undefined;
    }

    Ctor.__decorators__.push(options => factory(options, key, index));
  };
}
function mixins() {
  for (var _len = arguments.length, Ctors = new Array(_len), _key = 0; _key < _len; _key++) {
    Ctors[_key] = arguments[_key];
  }

  return Vue.extend({
    mixins: Ctors
  });
}
function isPrimitive(value) {
  var type = typeof value;
  return value == null || type !== 'object' && type !== 'function';
}
function warn(message) {
  if (typeof console !== 'undefined') {
    console.warn('[vue-class-component] ' + message);
  }
}

function collectDataFromConstructor(vm, Component) {
  // переопределить _init, чтобы предотвратить инициализацию как экземпляр Vue
  var originalInit = Component.prototype._init;

  Component.prototype._init = function () {
    // прокси к фактическому vm
    var keys = Object.getOwnPropertyNames(vm); // 2.2.0 compat (реквизиты больше не отображаются как собственные свойства)

    if (vm.$options.props) {
      for (var key in vm.$options.props) {
        if (!vm.hasOwnProperty(key)) {
          keys.push(key);
        }
      }
    }

    keys.forEach(key => {
      Object.defineProperty(this, key, {
        get: () => vm[key],
        set: value => {
          vm[key] = value;
        },
        configurable: true
      });
    });
  }; // должны быть приобретены значения класса собственности


  var data = new Component(); // восстановить исходный _init, чтобы избежать утечки памяти (#209)

  Component.prototype._init = originalInit; // создать простой объект данных

  var plainData = {};
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      plainData[key] = data[key];
    }
  });

  {
    if (!(Component.prototype instanceof Vue) && Object.keys(plainData).length > 0) {
      warn('Component class must inherit Vue or its descendant class ' + 'when class property is used.');
    }
  }

  return plainData;
}

var $internalHooks = ['data', 'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeDestroy', 'destroyed', 'beforeUpdate', 'updated', 'activated', 'deactivated', 'render', 'errorCaptured', 'serverPrefetch' // 2.6
];
function componentFactory(Component) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  options.name = options.name || Component._componentTag || Component.name; // прототип реквизита.

  var proto = Component.prototype;
  Object.getOwnPropertyNames(proto).forEach(function (key) {
    if (key === 'constructor') {
      return;
    } // hooks


    if ($internalHooks.indexOf(key) > -1) {
      options[key] = proto[key];
      return;
    }

    var descriptor = Object.getOwnPropertyDescriptor(proto, key);

    if (descriptor.value !== void 0) {
      // methods
      if (typeof descriptor.value === 'function') {
        (options.methods || (options.methods = {}))[key] = descriptor.value;
      } else {
        // машинописные декорированные данные
        (options.mixins || (options.mixins = [])).push({
          data() {
            return {
              [key]: descriptor.value
            };
          }

        });
      }
    } else if (descriptor.get || descriptor.set) {
      // вычисленные свойства
      (options.computed || (options.computed = {}))[key] = {
        get: descriptor.get,
        set: descriptor.set
      };
    }
  });
  (options.mixins || (options.mixins = [])).push({
    data() {
      return collectDataFromConstructor(this, Component);
    }

  }); // варианты украшения

  var decorators = Component.__decorators__;

  if (decorators) {
    decorators.forEach(fn => fn(options));
    delete Component.__decorators__;
  } // найти супер


  var superProto = Object.getPrototypeOf(Component.prototype);
  var Super = superProto instanceof Vue ? superProto.constructor : Vue;
  var Extended = Super.extend(options);
  forwardStaticMembers(Extended, Component, Super);

  if (reflectionIsSupported()) {
    copyReflectionMetadata(Extended, Component);
  }

  return Extended;
}
var reservedPropertyNames = [// Уникальный идентификатор
'cid', // Конструктор Super Vue
'super', // Параметры компонента, которые будет использовать компонент
'options', 'superOptions', 'extendOptions', 'sealedOptions', // Частные активы
'component', 'directive', 'filter'];
var shouldIgnore = {
  prototype: true,
  arguments: true,
  callee: true,
  caller: true
};

function forwardStaticMembers(Extended, Original, Super) {
  // Мы должны использовать getOwnPropertyNames, поскольку Babel регистрирует методы как неперечислимые
  Object.getOwnPropertyNames(Original).forEach(key => {
    // Пропустите свойства, которые нельзя перезаписывать
    if (shouldIgnore[key]) {
      return;
    } // Некоторые браузеры не позволяют перенастроить встроенные свойства


    var extendedDescriptor = Object.getOwnPropertyDescriptor(Extended, key);

    if (extendedDescriptor && !extendedDescriptor.configurable) {
      return;
    }

    var descriptor = Object.getOwnPropertyDescriptor(Original, key); // Если пользовательский агент не поддерживает `__proto__` или его семейство (IE <= 10),
    // свойства подкласса могут быть унаследованы от свойств суперкласса в TypeScript.
    // Нам нужно исключить такие свойства, чтобы предотвратить перезапись
    // в объекте параметров компонента, который хранится в расширенном конструкторе (см. #192).
    // Если значение является ссылочным значением (объектом или функцией),
    // мы можем проверить их равенство и исключить его, если они имеют одинаковую ссылку.
    // Если это примитивное значение, оно будет отправлено в целях безопасности.

    if (!hasProto) {
      // Только cid явно исключен из пересылки свойств
      // потому что мы не можем определить, унаследованное ли это свойство или нет
      // в среде без `__proto__`, даже если свойство зарезервировано.
      if (key === 'cid') {
        return;
      }

      var superDescriptor = Object.getOwnPropertyDescriptor(Super, key);

      if (!isPrimitive(descriptor.value) && superDescriptor && superDescriptor.value === descriptor.value) {
        return;
      }
    } // Warn if the users manually declare reserved properties


    if ( reservedPropertyNames.indexOf(key) >= 0) {
      warn("Имя статического свойства '".concat(key, "' объявлен в классе '").concat(Original.name, "' ") + 'конфликтует с зарезервированным именем свойства Vue internal. ' + 'Это может вызвать неожиданное поведение компонента. Рассмотрите возможность переименования собственности.');
    }

    Object.defineProperty(Extended, key, descriptor);
  });
}

function Component(options) {
  if (typeof options === 'function') {
    return componentFactory(options);
  }

  return function (Component) {
    return componentFactory(Component, options);
  };
}

Component.registerHooks = function registerHooks(keys) {
  $internalHooks.push(...keys);
};

export default Component;
export { createDecorator, mixins };
