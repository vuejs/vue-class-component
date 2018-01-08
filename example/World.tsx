import Vue ,{ CreateElement } from 'vue'
import Component from '../lib/index'

@Component
export default class World extends Vue {

  render(h: CreateElement) {
    return <h1 > tsx render function </h1>
  }
}
