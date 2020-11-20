import { PropType } from 'vue'
import { Vue, prop } from '../src'

describe('JSX', () => {
  function assertJsx(jsx: JSX.Element): void {}

  it('checks props type', () => {
    interface Person {
      name: string
      age?: number
    }

    class Props {
      required!: string
      optional?: number

      withDefault = prop({ default: false })

      withDefaultType = prop<Person>({
        default: () => ({
          name: 'Test',
          age: 20,
        }),
      })
    }

    class App extends Vue.with(Props) {}

    assertJsx(<App required="Hello" />)
    assertJsx(
      <App
        required="Hello"
        optional={123}
        withDefault={true}
        withDefaultType={{ name: 'Foo' }}
      />
    )

    // @ts-expect-error
    assertJsx(<App />)
    // @ts-expect-error
    assertJsx(<App required={true} />)
    // @ts-expect-error
    assertJsx(<App required="Hello" optional={{ foo: 'bar' }} />)
    // @ts-expect-error
    assertJsx(<App required="Hello" withDefault={Symbol()} />)

    assertJsx(
      // @ts-expect-error
      <App required="Hello" withDefaultType={{ name: 'Foo', age: true }} />
    )

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
