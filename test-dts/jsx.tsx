import { Vue, props } from '../src'

describe('JSX', () => {
  function assertJsx(jsx: JSX.Element): void {}

  it('checks props type', () => {
    const Props = props({
      required: {
        type: String,
        required: true,
      },

      optional: Number,
    })

    class App extends Props {}

    assertJsx(<App required="Hello" />)
    assertJsx(<App required="Hello" optional={123} />)

    // @ts-expect-error
    assertJsx(<App />)
    // @ts-expect-error
    assertJsx(<App required={true} />)
    // @ts-expect-error
    assertJsx(<App required="Hello" optional={{ foo: 'bar' }} />)

    assertJsx(
      <App ref="app" class="foo" required="Test" testCustomProp="custom" />
    )
  })

  it('passes vnode props', () => {
    class App extends Vue {}

    assertJsx(<App ref="test" />)
    assertJsx(<App key="123" />)
  })

  it('passes class and style attributes', () => {
    class App extends Vue {}

    assertJsx(<App class="foo" />)
    assertJsx(<App class={{ disabled: true }} />)
    assertJsx(<App class={['test']} />)

    assertJsx(<App style="font-size: 12px;" />)
    assertJsx(<App style={{ color: 'red' }} />)
  })

  it('passes component custom props', () => {
    class App extends Vue {}

    assertJsx(<App testCustomProp="test" />)
  })
})

declare module '@vue/runtime-core' {
  interface ComponentCustomProps {
    testCustomProp?: string
  }
}
