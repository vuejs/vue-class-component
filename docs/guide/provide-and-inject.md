# Provide and Inject

## Provide

The provide option should be an object or a function that returns an object. This object contains the properties that are available for injection into its descendants.
```js
// father.js
import Vue from 'vue'
import Component from 'vue-class-component'

// Define a provide in component
@Component({
    provide() {
        return {
            commonData: 'It`s data provided'
        }           
    }
})
export default class Father extends Vue {}
```

## Inject

The inject option should be either:

- an array of strings, or
- an object where the keys are the local binding name and the value is either:
    - the key (string or Symbol) to search for in available injections, or
    - an object where:
      - the from property is the key (string or Symbol) to search for in available injections, and
      - the default property is used as fallback value

```js
// son.js
import Vue from 'vue'
import Component from 'vue-class-component'

// use inject to get the data provided by Father component
@Component({
    inject: ['commonData']
})
export class Son extends Vue { 
    created() {
        console.log(this.commonData) // It`s data provided
    }   
}


```

> Note: the provide and inject bindings are NOT reactive. This is intentional. However, if you pass down an observed object, properties on that object do remain reactive.