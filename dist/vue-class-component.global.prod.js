/**
  * vue-class-component v8.0.0-alpha.6
  * (c) 2015-present Evan You
  * @license MIT
  */
var VueClassComponent=function(t,e){"use strict";
function r(t,e){if(!(t instanceof e))throw new TypeError("Невозможно вызвать класс как функцию")}
function n(t,e){for(var r=0;r<e.length;r++){var n=e[r];
    n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}
    function o(t,e,r){
        return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}
        function c(t,e){var r=Object.keys(t);
        if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter(function(e){
            return Object.getOwnPropertyDescriptor(t,e).enumerable})),r.push.apply(r,n)}
            return r}
            function i(t){
                for(var e=1;
                e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};
                e%2?c(Object(r),!0)
                .forEach(function(e){o(t,e,r[e])})
                :Object.getOwnPropertyDescriptors
                ?Object.defineProperties(t,
                    Object.getOwnPropertyDescriptors(r)):c(Object(r))
                    .forEach(function(e){
                        Object.defineProperty(t,e,
                            Object.getOwnPropertyDescriptor(r,e))})}
                            return t}
                function u(t){
                    return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){
                        return t.__proto__||Object.getPrototypeOf(t)})(t)}
                function a(t,e){
                    return(a=Object.setPrototypeOf||function(t,e){
                        return t.__proto__=e,t})(t,e)}
                function f(t,e){return!e||"object"!=typeof e&&"function"!=typeof e?function(t)
                {if(void 0===t)
                    throw new ReferenceError("это не было инициализировано - super() не был вызван");
                    return t}(t):e}
                function s(t){
                    var e=function(){
                        if("undefined"==typeof Reflect||!Reflect.construct)return!1;
                if(Reflect.construct.sham)return!1;
                if("function"==typeof Proxy)return!0;
                try{return Date.prototype.toString.call(Reflect.construct(Date,[],
                    function(){})),!0}
                catch(t){return!1}}();
                return function(){var r,n=u(t);
                    if(e){var o=u(this).constructor;
                        r=Reflect.construct(n,arguments,o)}
                    else r=n.apply(this,arguments);
                return f(this,r)}}
                function p(t){
                    return function(t){
                        if(Array.isArray(t))
                        return l(t)}(t)||function(t){
                            if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))
                            return Array.from(t)}(t)||function(t,e){
                                if(!t)return;
                                if("string"==typeof t)return l(t,e);
                                var r=Object.prototype.toString.call(t).slice(8,-1);
                                "Object"===r&&t.constructor&&(r=t.constructor.name);
                                if("Map"===r||"Set"===r)return Array.from(t);
                                if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))
                                return l(t,e)}(t)||function(){
                                    throw new TypeError("Недопустимая попытка распространения не повторяемого экземпляра.\nЧтобы быть итерируемыми, объекты, не являющиеся массивами, должны иметь метод [Symbol.iterator]().")}()}
                function l(t,e){(null==e||e>t.length)&&(e=t.length);
                                for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];
                                return n
                               }
                function y(t,e,r){Object.defineProperty(t,e,{get:r,enumerable:!1,configurable:!0})}
                var v=function(){function t(e,n){var o=this;
                    r(this,t),y(this,"$props",
                    function(){return e}),y(this,"$attrs",
                               function(){return n.attrs}),
                               y(this,"$slots",function(){return n.slots}),
                               y(this,"$emit",function(){return n.emit}),
                               Object.keys(e).forEach(function(t){Object.defineProperty(o,t,{enumerable:!1,configurable:!0,writable:!0,value:e[t]})})}
                               var o,c,u;return o=t,u=[{key:"registerHooks",
                               value:function(t){var e;(e=this.__vccHooks).push.apply(e,p(t))}},
                               {key:"__vccOpts",get:function(){if(this===b)return{};
                    var t=this.hasOwnProperty("__vccCache")&&this.__vccCache;if(t)return t;
                    var r=this,n=this.__vccCache=this.hasOwnProperty("__vccBase")?i({},this.__vccBase):{};
                    n.extends=function(t){var e=Object.getPrototypeOf(t.prototype);if(e)return e.constructor.__vccOpts}(r);
                    var o=this.hasOwnProperty("__vccMixins")&&this.__vccMixins;
                    o&&(n.mixins=n.mixins?n.mixins.concat(o):o),n.methods=i({},n.methods),n.computed=i({},n.computed);
                    var c=r.prototype;
                    Object.getOwnPropertyNames(c)
                    .forEach(function(t){if("constructor"!==t)if(r.__vccHooks.indexOf(t)>-1)n[t]=c[t];
                                         else{var e=Object.getOwnPropertyDescriptor(c,t);
                        "function"!=typeof e.value?(e.get||e.set)&&(n.computed[t]={get:e.get,set:e.set}):n.methods[t]=e.value}
                    }),
n.setup=function(t,n){
    var o=new r(t,n),
                      c=Object.keys(o),i=e.reactive({});
                      return c.forEach(function(t){void 0===o[t]||o[t]&&o[t].__s||(i[t]=o[t],
                                                   function(t,e,r){
                                                       Object.defineProperty(t,e,
                                                                   {get:function(){return r[e]},
                                                                    set:function(t){r[e]=t},
                                                                    enumerable:!0,configurable:!0
                                                                   }        )
                                                                  }(o,t,i)
                                      )                         
                                                  }),
                        c.forEach(function(t){o[t]&&o[t].__s&&(i[t]=o[t].__s())}),i};
                    var u=this.hasOwnProperty("__vccDecorators")&&this.__vccDecorators;
                    u&&u.forEach(function(t){return t(n)});
                    return["render","ssrRender","__file","__cssModules","__scopeId","__hmrId"]
                    .forEach(function(t){r[t]&&(n[t]=r[t])}),n}}],(c=null)&&n(o.prototype,c),u&&n(o,u),t}();
                    v.__vccHooks=["data","beforeCreate","created","beforeMount","mounted","beforeUnmount","unmounted","beforeUpdate","updated","activated","deactivated","render","errorCaptured","serverPrefetch"];
                    var b=v;
                    return t.Options=function(t){
                        return function(e){
                            return e.__vccBase=t,e}},t.Vue=b,t.createDecorator=function(t){
                                return function(e,r,n){
                                    var o="function"==typeof e?e:e.constructor;o.__vccDecorators||(o.__vccDecorators=[]),"number"!=typeof n&&(n=void 0),o.__vccDecorators.push(function(e){
                                        return t(e,r,n)})}},t.mixins=function(){
                                            for(var t=arguments.length,e=new Array(t),n=0;
                        n<t;n++)e[n]=arguments[n]; var o;
                        return(o=function(t){!function(t,e){
                            if("function"!=typeof e&&null!==e)
                             throw new TypeError("Супервыражение должно быть либо нулевым, либо функцией");
                             t.prototype=Object.create(e&&e.prototype,
                                {constructor:{value:t,writable:!0,configurable:!0}}),e&&a(t,e)
                            }(o,b);
    var n=s(o);
    function o(t,c){
        var i;
        return r(this,o),i=n.call(this,t,c),
                    e.forEach(function(e){
                        var r=new e(t,c); Object.keys(r).forEach(function(t){i[t]=r[t]})}
                             ),i 
                    }
        return o}()).__vccMixins=e.map(function(t){
            return t.__vccOpts}),o},
    t.setup=function(t){
        return{__s:t}},
    t}({},Vue);