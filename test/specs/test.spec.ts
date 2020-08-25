import 'reflect-metadata'
import { h, resolveComponent, ref, onMounted, Ref, watch, toRef } from 'vue'
import { Options, createDecorator, mixins, Vue, setup, props } from '../../src'
import { mount, unmount } from '../helpers'

describe('vue-class-component', () => {
  it('hooks', () => {
    let created = false
    let unmounted = false

    class MyComp extends Vue {
      created() {
        created = true
      }
      unmounted() {
        unmounted = true
      }
    }

    const { app } = mount(MyComp)
    expect(created).toBe(true)
    expect(unmounted).toBe(false)
    unmount(app)
    expect(unmounted).toBe(true)
  })

  it('hooks: adding custom hooks', () => {
    class SubVue extends Vue {}
    SubVue.registerHooks(['beforeRouteEnter'])

    class MyComp extends SubVue {
      static options: any

      beforeRouteEnter() {
        return 'beforeRouteEnter'
      }
    }

    const { root } = mount(MyComp)
    expect((root.$options as any).beforeRouteEnter()).toBe('beforeRouteEnter')
  })

  if (!process.env.BABEL_TEST) {
    it('data: should collect from class properties', () => {
      @Options({
        props: ['foo'],
      })
      class MyComp extends Vue {
        foo!: number
        a: string = 'hello'
        b: number = this.foo + 1
      }

      const { root } = mount(MyComp, { foo: 1 })

      expect(root.a).toBe('hello')
      expect(root.b).toBe(2)
    })
  }

  it('data: $props should be available', () => {
    interface Props {
      foo: number
    }

    @Options({
      props: ['foo'],
    })
    class MyComp extends Vue<Props> {
      message = 'answer is ' + this.$props.foo
    }

    const { root } = mount(MyComp, { foo: 42 })
    expect(root.message).toBe('answer is 42')
  })

  it('data: should not collect uninitialized class properties', () => {
    const Prop = createDecorator((options, key) => {
      if (!options.props) {
        ;(options as any).props = {}
      }
      ;(options.props as any)[key] = {
        type: null,
      }
    })

    class MyComp extends Vue {
      foo: any
      @Prop bar: any
    }
    const { root } = mount(MyComp)
    expect('foo' in root.$data).toBe(false)
    expect('bar' in root.$data).toBe(false)
  })

  it('methods', () => {
    let msg: string = ''

    class MyComp extends Vue {
      hello() {
        msg = 'hi'
      }
    }

    const { root } = mount(MyComp)
    root.hello()
    expect(msg).toBe('hi')
  })

  it('computed', () => {
    class MyComp extends Vue {
      a!: number
      data() {
        return {
          a: 1,
        }
      }
      get b() {
        return this.a + 1
      }
    }

    const { root } = mount(MyComp)
    expect(root.a).toBe(1)
    expect(root.b).toBe(2)
    root.a = 2
    expect(root.b).toBe(3)
  })

  it('other options', (done) => {
    let v: number

    @Options<MyComp>({
      watch: {
        a: (val) => {
          v = val
        },
      },
    })
    class MyComp extends Vue {
      a!: number
      data() {
        return { a: 1 }
      }
    }

    const { root } = mount(MyComp)
    root.a = 2
    root.$nextTick(() => {
      expect(v).toBe(2)
      done()
    })
  })

  it('extending', function () {
    class Base extends Vue {
      baseA!: number
      baseB = 2

      data(): any {
        return { baseA: 1 }
      }
    }

    class Child extends Base {
      childA!: number
      childB = 4

      data(): any {
        return { childA: 3 }
      }
    }

    const { root } = mount(Child)
    expect(root.baseA).toBe(1)
    expect(root.baseB).toBe(2)
    expect(root.childA).toBe(3)
    expect(root.childB).toBe(4)
  })

  // #199
  it('should not re-execute super class decortors', function (done) {
    const Watch = (valueKey: string) =>
      createDecorator((options, key) => {
        if (!options.watch) {
          options.watch = {}
        }
        options.watch[valueKey] = key
      })

    const spy = jest.fn()

    class Base extends Vue {
      count = 0

      @Watch('count')
      notify() {
        spy()
      }
    }

    class A extends Base {}

    const { root } = mount(A)
    root.count++
    root.$nextTick(() => {
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    })
  })

  it('createDecorator', function () {
    const Prop = createDecorator((options, key) => {
      // component options should be passed to the callback
      // and update for the options affect the component
      if (!options.props) {
        ;(options as any).props = {}
      }
      ;(options.props as any)[key] = {
        type: null,
      }
    })

    const Wrap = createDecorator((options, key) => {
      // options should have computed and methods etc.
      // that specified by class property accessors and methods
      const computedOption = (options.computed as any)[key]
      const originalGet = computedOption.get
      computedOption.get = function () {
        return '(' + originalGet() + ')'
      }
    })

    class MyComp extends Vue {
      @Prop foo!: string
      @Wrap get bar(): string {
        return 'world'
      }
    }

    const { root } = mount(MyComp, { foo: 'hello' })
    expect(root.foo).toBe('hello')
    expect(root.bar).toBe('(world)')
  })

  // #104
  it('createDecorator: decorate correctly even if a component is created in another @Component decorator', () => {
    // Just assigns the given value to the decorated property
    const Value = (value: any) =>
      createDecorator((options, key) => {
        const data = (options.data as Function) || (() => ({}))
        options.data = function () {
          return {
            ...data.call(this),
            [key]: value,
          }
        }
      })

    const createChild = () => {
      class Child extends Vue {
        @Value('child')
        value!: string

        render() {
          return h('div')
        }
      }
      return Child
    }

    @Options({
      components: {
        Child: createChild(),
      },
    })
    class Parent extends Vue {
      @Value('parent')
      value!: string

      render() {
        const child = resolveComponent('Child') as any
        return h(child, { ref: 'child' })
      }
    }

    const { root: parent } = mount(Parent)
    const child = parent.$refs.child as any
    expect(parent.value).toBe('parent')
    expect(child.value).toBe('child')
  })

  // #155
  it('createDecrator: create a class decorator', () => {
    const DataMixin = createDecorator((options) => {
      options.data = function () {
        return {
          test: 'foo',
        }
      }
    })

    @DataMixin
    class MyComp extends Vue {}

    const { root } = mount(MyComp)
    expect((root as any).test).toBe('foo')
  })

  it('should not throw if property decorator declare some methods', () => {
    const Test = createDecorator((options, key) => {
      if (!options.methods) {
        options.methods = {}
      }
      ;(options.methods as any)[key] = () => 'test'
    })

    class MyComp extends Vue {
      @Test test!: () => string
    }

    const { root } = mount(MyComp)
    expect(root.test()).toBe('test')
  })

  it('should keep static members available', function () {
    class MyComp extends Vue {
      static myValue = 52

      static myFunc() {
        return 42
      }
    }

    expect(MyComp.myValue).toBe(52)
    expect(MyComp.myFunc()).toBe(42)
  })

  it('mixin helper', function () {
    class MixinA extends Vue {
      valueA = 'hello'
    }

    class MixinB extends Vue {
      valueB = 123
    }

    class MyComp extends mixins(MixinA, MixinB) {
      test() {
        this.valueA = 'hi'
        this.valueB = 456
      }
    }

    const { root } = mount(MyComp)
    expect(root.valueA).toBe('hello')
    expect(root.valueB).toBe(123)
    root.test()
    expect(root.valueA).toBe('hi')
    expect(root.valueB).toBe(456)
  })

  it('props mixin: prop names', () => {
    const Props = props(['foo', 'bar'])

    class App extends Props {
      baz = this.foo + this.bar
    }

    const { root } = mount(App, { foo: 'Hello', bar: 'World' })
    expect(root.baz).toBe('HelloWorld')
  })

  it('props mixin: props options object', () => {
    const Props = props({
      foo: {
        type: String,
        default: 'The answer is'
      },
      bar: {
        type: Number,
        required: true
      }
    })

    class App extends Props {
      baz = this.foo + ': ' + this.bar
    }

    const { root } = mount(App, { bar: 42 })
    expect(root.baz).toBe('The answer is: 42')
  })

  it('uses composition functions', () => {
    function useCounter() {
      const count = ref(0)

      function increment() {
        count.value++
      }

      onMounted(() => {
        increment()
      })

      return {
        count,
        increment,
      }
    }

    class App extends Vue {
      counter = setup(() => useCounter())
    }

    const { root } = mount(App)
    expect(root.counter.count).toBe(1)
    root.counter.increment()
    expect(root.counter.count).toBe(2)
  })

  it('reactive class properties in a composition function', (done) => {
    function test(message: Ref<string>) {
      watch(message, () => {
        expect(message.value).toBe('Updated')
        done()
      })
      return {}
    }

    class App extends Vue {
      message = 'Hello'
      test = setup(() => {
        return test(toRef(this, 'message'))
      })
    }

    const { root } = mount(App)
    root.message = 'Updated'
  })

  it('keeps reflection metadata available', function () {
    @Reflect.metadata('worksConstructor', true)
    class Test extends Vue {
      @Reflect.metadata('worksStatic', true)
      static staticValue: string = 'staticValue'

      private _test: boolean = false

      @Reflect.metadata('worksMethod', true)
      test(): void {
        void 0
      }

      @Reflect.metadata('worksAccessor', true)
      get testAccessor(): boolean {
        return this._test
      }
    }

    expect(Reflect.getOwnMetadata('worksConstructor', Test)).toBe(true)
    expect(Reflect.getOwnMetadata('worksStatic', Test, 'staticValue')).toBe(
      true
    )
    expect(Reflect.getOwnMetadata('worksMethod', Test.prototype, 'test')).toBe(
      true
    )
    expect(
      Reflect.getOwnMetadata('worksAccessor', Test.prototype, 'testAccessor')
    ).toBe(true)
  })
})
