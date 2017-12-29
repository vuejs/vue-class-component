import Vue ,{ CreateElement } from 'vue'
import Component from '../lib/index'

@Component({
  props:{
    title:{
      type:String,
      required:true
    }
  }
})
export default class World extends Vue {
  title:string
  content:string = 'default content'
  get computedContent () {
    return 'computed ' + this.content
  }

  clearContent() {
    this.content = ''
  }
  render(h: CreateElement) {
    return <div >
      <h1>{this.title}</h1>
      <input type="text" value={this.content} onInput={ (evt:Event)=> this.content = (evt.target as HTMLInputElement).value} />
      <p>content: {this.content} </p>
      <p>computed content: {this.computedContent} </p>
      <button onClick={this.clearContent}>Clear content</button>
    </div>
  }
}
