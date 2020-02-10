# Custom Decorators

You can extend the functionality of this library by creating your own decorators. Vue Class Component provides `createDecorator` helper to create custom decorators. `createDecorator` expects a callback function as the 1st argument and the callback will receive following arguments:

- `options`: Vue component options object. Changes for this object will affect the provided component.
- `key`: The property or method key that the decorator is applied.
- `parameterIndex`: The index of a decorated argument if the custom decorator is used for an argument.

Example of creating `Log` decorator which prints a log message with the method name and passed arguments when the decorated method is called:

```js
// decorators.js
import { createDecorator } from 'vue-class-component'

// Declare Log decorator.
export const Log = createDecorator((options, key) => {
  // Keep the original method for later.
  const originalMethod = options.methods[key]

  // Wrap the method with the logging logic.
  options.methods[key] = function wrapperMethod(...args) {
    // Print a log.
    console.log(`Invoked: ${key}(`, ...args, ')')

    // Invoke the original method.
    originalMethod.apply(this, args)
  }
})
```

Using it as a method decorator:

```js
import Vue from 'vue'
import Component from 'vue-class-component'
import { Log } from './decorators'

@Component
class MyComp extends Vue {
  // It prints a log when `hello` method is invoked.
  @Log
  hello(value) {
    // ...
  }
}
```

In the above code, when `hello` method is called with `42`, the following log will be printed:

```
Invoked: hello( 42 )
```