<template>
  <div>
    <p @click="changeName">comp: Comp1</p>
    <p>name: {{ config.name }}</p>
    <p>value: {{ config.value }}</p>
  </div>
</template>

<script lang="ts">
import Base from './Base.vue'
import { Watch } from './decorators/Watch'

export default class Comp extends Base {

  @Watch('config.name')
  public onNameChange() {
    console.log('Comp1 name change==>', this.config.name)
  }

  public changeName() {
    this.config.name = Math.random() + ''
  }
}
</script>
