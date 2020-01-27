# Caveats of Class Component

Vue Class Component collects class properties as Vue instance data by instantiating the original constructor under the hood. While we can define instance data like native class manner, we sometimes need to know how it works.

## `this` value in property initializer

If you define an arrow function as a class property and access `this` in it, it will not work. This is because `this` is just a proxy object to the Vue instance when initializing class properties:

```js
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class MyComp extends Vue {
  foo = 123

  // DO NOT do this
  bar = () => {
    // Does not update the expected property.
    // `this` value is not a Vue instance in fact.
    this.foo = 456
  }
}
```

You can simply define a method instead of a class property in that case because Vue will bind the instance automatically:

```js
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class MyComp extends Vue {
  foo = 123

  // DO this
  bar() {
    // Correctly update the expected property.
    this.foo = 456
  }
}
```

## Always use lifecycle hooks instead of `constructor`

As the original constructor is invoked to collect initial component data, it is recommended against declaring `constructor` by yourself:

```js
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Posts extends Vue {
  posts = []

  // DO NOT do this
  constructor() {
    fetch('/posts.json')
      .then(res => res.json())
      .then(posts => {
        this.posts = posts
      })
  }
}
```

The above code intends to fetch post list on component initialization but the fetch will be called twice unexpectedly because of how Vue Class Component works.

It is recommended to write lifecycle hooks such as `created` instead of `constructor`:

```js
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Posts extends Vue {
  posts = []

  // DO this
  created() {
    fetch('/posts.json')
      .then(res => res.json())
      .then(posts => {
        this.posts = posts
      })
  }
}
```