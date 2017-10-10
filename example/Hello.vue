<template>
  <div class="hello">
    <h1>Hello Times: {{ helloTimes }}</h1>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from '../lib/index'

  @Component
  export default class Hello extends Vue {
    helloTimes: number = 0
    sayHello() {
      this.helloTimes++;
    }
  }
</script>

