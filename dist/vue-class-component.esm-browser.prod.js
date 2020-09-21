/**
  * vue-class-component v8.0.0-alpha.6
  * (c) 2015-present Evan You
  * @license MIT
  */
import{reactive}from"vue";
function _defineProperty(e,t,r){
    return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}
    function ownKeys(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){
        var c=Object.getOwnPropertySymbols(e);
        t&&(c=c.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,c)}
        return r} 
        function _objectSpread2(e){
            for(var t=1;t<arguments.length;t++){
                var r=null!=arguments[t]?arguments[t]:{};
            t%2?ownKeys(Object(r),!0)
            .forEach(function(t){_defineProperty(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r))
            .forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}
            return e}
            function defineGetter(e,t,r){Object.defineProperty(e,t,{get:r,enumerable:!1,configurable:!0})}
            function defineProxy(e,t,r){
                Object.defineProperty(e,t,{get:()=>r[t], set:e=>{r[t]=e},enumerable:!0,configurable:!0})}
            function getSuperOptions(e){
                var t=Object.getPrototypeOf(e.prototype);
                if(t)return t.constructor.__vccOpts}
                class VueImpl{constructor(e,t){defineGetter(this,"$props",()=>e),
                defineGetter(this,"$attrs",()=>t.attrs),
                defineGetter(this,"$slots",()=>t.slots),
                defineGetter(this,"$emit",()=>t.emit),Object.keys(e)
                .forEach(t=>{Object.defineProperty(this,t,{enumerable:!1,configurable:!0,writable:!0,value:e[t]})})
              }
                static get __vccOpts(){if(this===Vue)return{};
                var e=this.hasOwnProperty("__vccCache")&&this.__vccCache;
                if(e)return e;var t=this,r=this.__vccCache=this.hasOwnProperty("__vccBase")?_objectSpread2({},this.__vccBase):{};r.extends=getSuperOptions(t);
                var c=this.hasOwnProperty("__vccMixins")&&this.__vccMixins;c&&(r.mixins=r.mixins?r.mixins.concat(c):c),r.methods=_objectSpread2({},r.methods),r.computed=_objectSpread2({},r.computed);var o=t.prototype;Object.getOwnPropertyNames(o).forEach(e=>{if("constructor"!==e)if(t.__vccHooks.indexOf(e)>-1)r[e]=o[e];
                else{var c=Object.getOwnPropertyDescriptor(o,e);"function"!=typeof c.value?(c.get||c.set)&&(r.computed[e]={get:c.get,set:c.set}):r.methods[e]=c.value}}),
                r.setup=function(e,r){
                    var c=new t(e,r),o=Object.keys(c),n=reactive({});
                return o.forEach(e=>{void 0===c[e]||c[e]&&c[e].__s||(n[e]=c[e],defineProxy(c,e,n))}),o.forEach(e=>{c[e]&&c[e].__s&&(n[e]=c[e].__s())}),n};var n=this.hasOwnProperty("__vccDecorators")&&this.__vccDecorators;
                n&&n.forEach(e=>e(r));
                return["render","ssrRender","__file","__cssModules","__scopeId","__hmrId"]
                .forEach(e=>{t[e]&&(r[e]=t[e])}),r}
                static registerHooks(e){this.__vccHooks.push(...e)}}
                VueImpl.__vccHooks=["data","beforeCreate","created","beforeMount","mounted","beforeUnmount","unmounted","beforeUpdate","updated","activated","deactivated","render","errorCaptured","serverPrefetch"];
                var Vue;
                function Options(e){return t=>(t.__vccBase=e,t)}
                function createDecorator(e){return(t,r,c)=>{var o="function"==typeof t?t:t.constructor;o.__vccDecorators||(o.__vccDecorators=[]),"number"!=typeof c&&(c=void 0),o.__vccDecorators.push(t=>e(t,r,c))}}
                function mixins(){for(var e=arguments.length,t=new Array(e),r=0;
                    r<e;r++)t[r]=arguments[r];
                    var c;
                    return(c=class extends Vue{constructor(e,r){super(e,r),t.forEach(t=>{
                        var c=new t(e,r);
                        Object.keys(c).forEach(e=>{this[e]=c[e]}
        )})}})
                        .__vccMixins=t.map(e=>e.__vccOpts), c
    }
                    function setup(e){return{__s:e}}
export{Options,VueImpl as Vue,createDecorator,mixins,setup};