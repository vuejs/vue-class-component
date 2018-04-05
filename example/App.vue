<template>
  <div>
    <input v-model="msg">
    <p>prop: {{ propMessage }}</p>
    <p>msg: {{ msg }}</p>
    <p>helloMsg: {{ helloMsg }}</p>
    <p>computed msg: {{ computedMsg }}</p>
    <Hello ref="helloComponent" />
    <World />
    <button @click="greet">Greet</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from '../lib/index'
import Hello from './Hello.vue'
import World from './World'

@Component({
  props: {
    propMessage: String
  },
  components: {
    Hello,
    World
  }
})
export default class App extends Vue {
  // props have to be declared for typescript
  propMessage!: string

  // inital data
  msg: number = 123

  // use prop values for initial data
  helloMsg: string = 'Hello, ' + this.propMessage

  // lifecycle hook
  mounted () {
    this.greet()
  }

  // computed
  get computedMsg () {
    return 'computed ' + this.msg
  }

  // method
  greet () {
    alert('greeting: ' + this.msg)
    this.$refs.helloComponent.sayHello()
  }

  // dynamic component
  $refs!: {
    helloComponent: Hello
  }
}
</script>
