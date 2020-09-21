# `$refs` Type Extension

Тип компонента `$refs` объявлен как самый широкий тип для обработки всех возможных типов ссылок. Хотя теоретически это сбор, в большинстве случаев каждая ссылка имеет только определенный элемент или компонент на практике.

Вы можете указать конкретный тип ссылки, переопределив тип `$refs` в компоненте класса:

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

Вы можете получить доступ к типу `input` без приведения типа, поскольку тип `$refs.input` указан в компоненте класса в приведенном выше примере.

Обратите внимание, что это должна быть аннотация типа (с использованием двоеточия `:`), а не присвоение значения (`=`).
