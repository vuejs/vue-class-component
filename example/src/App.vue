<template>
  <div>
    <input v-model="msg">
    <p>prop: {{ propMessage }}</p>
    <p>msg: {{ msg }}</p>
    <p>helloMsg: {{ helloMsg }}</p>
    <p>computed msg: {{ computedMsg }}</p>
    <comp />
    <comp2 />
    <p>
      <button @click="greet">Greet</button>
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from '../../src'
import Comp from './Comp.vue'
import Comp2 from './Comp2.vue'

class Props {
  propMessage!: string
}

@Options({
  components: {
    Comp,
    Comp2
  }
})
export default class App extends Vue.with(Props) {
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
  }
}
</script>
