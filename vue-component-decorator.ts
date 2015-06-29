// You should have `Vue` definitions downloaded using tsd
// and here just reference your main tsd.d.ts file or
// vue.d.ts to make the compilator work correctly.

/// <reference path="../typings/tsd.d.ts"/>

module Decorator {

  var hooks = [
      "created",
      "ready",
      "beforeCompile",
      "compiled",
      "beforeDestroy",
      "destroyed",
      "attached",
      "detached"
  ];

  interface IOptions {
    data?: {};
    methods?: {};
    computed?: {};
  }

  export function VueComponent(target: any) {

      var options : IOptions = {};

      // instance properties are data
      var data = new target();

      if (Object.keys(data).length) {
        options.data = data;
      }

      // prototype props.
      var proto = target.prototype;
      Object.getOwnPropertyNames(proto).forEach((key) => {

          if (key === 'constructor') {
              return;
          }

          // hooks
          if (hooks.indexOf(key) > -1) {
              options[key] = proto[key];
              return;
          }

          // descriptor
          var descriptor = Object.getOwnPropertyDescriptor(proto, key);

          if (typeof descriptor.value === 'function') {

              // methods
              (options.methods || (options.methods = {}))[key] = descriptor.value;

          } else if (descriptor.get || descriptor.set) {

              // computed properties
              (options.computed || (options.computed = {}))[key] = {
                  get: descriptor.get,
                  set: descriptor.set
              };

          }
      });

      // copy static options
      Object.keys(target).forEach(function(key) {
          options[key] = target[key];
      });

      // find super
      var Super = proto.__proto__.constructor;

      if (!(Super instanceof Vue)) {
          Super = Vue;
      }

      return Super.extend(options);
  }
}

// Example usage in TypeScript class:

// module Example {
//
//     @Decorator.VueComponent
//     export class ExampleComponent extends Vue {
//         static template = '<div>test</div>';
//     }
//
// }
//
// $(() => {
//   new Example.ExampleComponent({
//     el: '#example'
//   });
// });
