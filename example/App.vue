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

    Clicked: {{ $store.state.count }} times, count is {{ evenOrOdd }}.
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="incrementIfOdd">Increment if odd</button>
    <button @click="incrementAsync">Increment async</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from '../lib/index'
import Hello from './Hello.vue'
import World from './World'
import { mapGetters, mapActions } from 'vuex'

// We declare the props separately
// to make props types inferable.
const AppProps = Vue.extend({
  props: {
    propMessage: String
  }
})

@Component({
  components: {
    Hello,
    World
  },
  // mapGetters & mapActions example
  computed: mapGetters([
    'evenOrOdd'
  ]),
  methods: mapActions([
    'increment',
    'decrement',
    'incrementAsync'
  ])
})
export default class App extends AppProps {
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

  // direct dispatch example
  incrementIfOdd() {
    this.$store.dispatch('incrementIfOdd')
  }

  // dynamic component
  $refs!: {
    helloComponent: Hello
  }
}
</script>
