import { createApp, App } from 'vue'
import { VueConstructor } from '../src/vue'

const wrapper = document.createElement('div')

export function mount<T extends VueConstructor>(
  Component: T,
  props?: Record<string, any>
) {
  if (!Component.__vccOpts.render) {
    Component.__vccOpts.render = () => {}
  }
  const app = createApp(Component, props)
  const root = app.mount(wrapper) as InstanceType<T>
  return { app, root }
}

export function unmount(app: App): void {
  app.unmount(wrapper)
}
