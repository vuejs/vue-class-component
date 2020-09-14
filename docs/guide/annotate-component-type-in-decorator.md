# Annotate Component Type in Decorator

There are cases that you want to use your component type on a function in `@Component` decorator argument.
For example, to access component methods in a watch handler:

```ts
@Component({
  watch: {
    postId(id: string) {
      // To fetch post data when the id is changed.
      this.fetchPost(id) // -> Property 'fetchPost' does not exist on type 'Vue'.
    }
  }
})
class Post extends Vue {
  postId: string

  fetchPost(postId: string): Promise<void> {
    // ...
  }
}
```

The above code produces a type error that indicates `fetchPost` does not exist on `this` in the watch handler. This happens because `this` type in `@Component` decorator argument is the base `Vue` type.

To use your own component type (in this case `Post`), you can annotate the decorator through its type parameter.

```ts
// Annotate the decorator with the component type 'Post' so that `this` type in
// the decorator argument becomes 'Post'.
@Component<Post>({
  watch: {
    postId(id: string) {
      this.fetchPost(id) // -> No errors
    }
  }
})
class Post extends Vue {
  postId: string

  fetchPost(postId: string): Promise<void> {
    // ...
  }
}
```
