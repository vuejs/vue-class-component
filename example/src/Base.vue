<script lang="ts">
import { Vue } from '../../src'
import { Watch } from './decorators/Watch'

export default class Base extends Vue {

  public config = {
    name: 'name',
    value: 'value'
  }

  @Watch('config.name')
  public onNameChangeBase() {
    console.log('Base name change==>', this.config.value)
  }
}
</script>
