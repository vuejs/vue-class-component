# `$refs` Type Extension

`$refs` type of a component is declared as the broadest type to handle all possible type of ref. While it is theoretically correct, in most cases, each ref only has a specific element or a component in practice.

You can specify a specific ref type by overriding `$refs` type in a class component:

```vue
<template>
  <input ref="input">
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class InputFocus extends Vue {
  // annotate refs type.
  // The symbol `!` (definite assignment assertion)
  // is needed to get rid of compilation error.
  $refs!: {
    input: HTMLInputElement
  }

  mounted() {
    // Use `input` ref without type cast.
    this.$refs.input.focus()
  }
}
</script>
```

You can access `input` type without type cast as `$refs.input` type is specified on the class component in the above example.

Note that it should be a type annotation (using colon `:`) rather than value assignment (`=`).
