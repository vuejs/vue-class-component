import 'reflect-metadata'
import { createApp, h, resolveComponent, ref, onMounted, Ref, watch, toRef } from 'vue'
import { Options, createDecorator, mixins, Vue, setup } from '../../src'

const root = document.createElement('div')

describe('vue-class-component', () => {
  it('hooks', () => {
    let created = false
    let unmounted = false

    class MyComp extends Vue {
      created () {
        created = true
      }
      unmounted () {
        unmounted = true
      }

      render () {}
    }

    const app = createApp(MyComp)
    app.mount(root)
    expect(created).toBe(true)
    expect(unmounted).toBe(false)
    app.unmount(root)
    expect(unmounted).toBe(true)
  })

  it('hooks: adding custom hooks', () => {
    class SubVue extends Vue {}
    SubVue.registerHooks(['beforeRouteEnter'])

    class MyComp extends SubVue {
      static options: any

      beforeRouteEnter () {
        return 'beforeRouteEnter'
      }

      render () {}
    }

    const app = createApp(MyComp).mount(root)
    expect((app.$options as any).beforeRouteEnter()).toBe('beforeRouteEnter')
  })

  if (!process.env.BABEL_TEST) {
    it('data: should collect from class properties', () => {
      @Options({
        props: ['foo']
      })
      class MyComp extends Vue {
        foo!: number
        a: string = 'hello'
        b: number = this.foo + 1

        render () {}
      }

      const app = createApp(MyComp, { foo: 1 }).mount(root) as MyComp

      expect(app.a).toBe('hello')
      expect(app.b).toBe(2)
    })
  }

  it('data: $props should be available', () => {
    interface Props {
      foo: number
    }

    @Options({
      props: ['foo']
    })
    class MyComp extends Vue<Props> {
      message = 'answer is ' + this.$props.foo

      render () {}
    }

    const app = createApp(MyComp, { foo: 42 }).mount(root) as MyComp
    expect(app.message).toBe('answer is 42')
  })

  it('data: should not collect uninitialized class properties', () => {
    const Prop = createDecorator((options, key) => {
      if (!options.props) {
        (options as any).props = {}
      }
      (options.props as any)[key] = {
        type: null
      }
    })

    class MyComp extends Vue {
      foo: any
      @Prop bar: any

      render () {}
    }
    const c = createApp(MyComp).mount(root)
    expect('foo' in c.$data).toBe(false)
    expect('bar' in c.$data).toBe(false)
  })

  xit('data: should collect custom property defined on beforeCreate', () => {
    class MyComp extends Vue {
      $store: any
      foo: string = 'Hello, ' + this.$store.state.msg

      beforeCreate () {
        this.$store = {
          state: {
            msg: 'world'
          }
        }
      }

      render () {}
    }

    const app = createApp(MyComp).mount(root) as MyComp
    expect(app.foo).toBe('Hello, world')
  })

  it('methods', () => {
    let msg: string = ''

    class MyComp extends Vue {
      hello () {
        msg = 'hi'
      }

      render () {}
    }

    const app = createApp(MyComp).mount(root) as MyComp
    app.hello()
    expect(msg).toBe('hi')
  })

  it('computed', () => {
    class MyComp extends Vue {
      a!: number
      data () {
        return {
          a: 1
        }
      }
      get b () {
        return this.a + 1
      }

      render () {}
    }

    const app = createApp(MyComp).mount(root) as MyComp
    expect(app.a).toBe(1)
    expect(app.b).toBe(2)
    app.a = 2
    expect(app.b).toBe(3)
  })

  it('other options', (done) => {
    let v: number

    @Options<MyComp>({
      watch: {
        a: val => { v = val }
      }
    })
    class MyComp extends Vue {
      a!: number
      data () {
        return { a: 1 }
      }

      render () {}
    }

    const app = createApp(MyComp).mount(root) as MyComp
    app.a = 2
    app.$nextTick(() => {
      expect(v).toBe(2)
      done()
    })
  })

  it('extending', function () {
    class Base extends Vue {
      baseA!: number
      baseB = 2

      data (): any {
        return { baseA: 1 }
      }
    }

    class Child extends Base {
      childA!: number
      childB = 4

      data (): any {
        return { childA: 3 }
      }

      render () {}
    }

    const app = createApp(Child).mount(root) as Child
    expect(app.baseA).toBe(1)
    expect(app.baseB).toBe(2)
    expect(app.childA).toBe(3)
    expect(app.childB).toBe(4)
  })

  // #199
  it('should not re-execute super class decortors', function (done) {
    const Watch = (valueKey: string) => createDecorator((options, key) => {
      if (!options.watch) {
        options.watch = {}
      }
      options.watch[valueKey] = key
    })

    const spy = jest.fn()

    class Base extends Vue {
      count = 0

      @Watch('count')
      notify () {
        spy()
      }
    }

    class A extends Base {
      render () {}
    }

    const app = createApp(A).mount(root) as A
    app.count++
    app.$nextTick(() => {
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    })
  })

  it('createDecorator', function () {
    const Prop = createDecorator((options, key) => {
      // component options should be passed to the callback
      // and update for the options affect the component
      if (!options.props) {
        (options as any).props = {}
      }
      (options.props as any)[key] = {
        type: null
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
      @Wrap get bar (): string {
        return 'world'
      }

      render () {}
    }

    const app = createApp(MyComp, { foo: 'hello' }).mount(root) as MyComp
    expect(app.foo).toBe('hello')
    expect(app.bar).toBe('(world)')
  })

  // #104
  it('createDecorator: decorate correctly even if a component is created in another @Component decorator', () => {
    // Just assigns the given value to the decorated property
    const Value = (value: any) => createDecorator((options, key) => {
      const data = options.data as Function || (() => ({}))
      options.data = function () {
        return {
          ...data.call(this),
          [key]: value
        }
      }
    })

    const createChild = () => {
      class Child extends Vue {
        @Value('child')
        value!: string

        render () {
          return h('div')
        }
      }
      return Child
    }

    @Options({
      components: {
        Child: createChild()
      }
    })
    class Parent extends Vue {
      @Value('parent')
      value!: string

      render () {
        const child = resolveComponent('Child') as any
        return h(child, { ref: 'child' })
      }
    }

    const parent = createApp(Parent).mount(root) as Parent
    const child = parent.$refs.child as any
    expect(parent.value).toBe('parent')
    expect(child.value).toBe('child')
  })

  // #155
  it('createDecrator: create a class decorator', () => {
    const DataMixin = createDecorator(options => {
      options.data = function () {
        return {
          test: 'foo'
        }
      }
    })

    @DataMixin
    class MyComp extends Vue {
      render () {}
    }

    const app: any = createApp(MyComp).mount(root)
    expect(app.test).toBe('foo')
  })

  it('should not throw if property decorator declare some methods', () => {
    const Test = createDecorator((options, key) => {
      if (!options.methods) {
        options.methods = {}
      }
      (options.methods as any)[key] = () => 'test'
    })

    class MyComp extends Vue {
      @Test test!: () => string

      render () {}
    }

    const vm = createApp(MyComp).mount(root) as MyComp
    expect(vm.test()).toBe('test')
  })

  it('should keep static members available', function () {
    class MyComp extends Vue {
      static myValue = 52

      static myFunc () {
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
      test () {
        this.valueA = 'hi'
        this.valueB = 456
      }

      render () {}
    }

    const app = createApp(MyComp).mount(root) as MyComp
    expect(app.valueA).toBe('hello')
    expect(app.valueB).toBe(123)
    app.test()
    expect(app.valueA).toBe('hi')
    expect(app.valueB).toBe(456)
  })

  it('uses composition functions', () => {
    function useCounter () {
      const count = ref(0)

      function increment () {
        count.value++
      }

      onMounted(() => {
        increment()
      })

      return {
        count,
        increment
      }
    }

    class App extends Vue {
      counter = setup(() => useCounter())

      render () {}
    }

    const app = createApp(App).mount(root) as App
    expect(app.counter.count).toBe(1)
    app.counter.increment()
    expect(app.counter.count).toBe(2)
  })

  it('reactive class properties in a composition function', done => {
    function test (message: Ref<string>) {
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

      render () {}
    }

    const app = createApp(App).mount(root) as App
    app.message = 'Updated'
  })

  it('keeps reflection metadata available', function () {
    @Reflect.metadata('worksConstructor', true)
    class Test extends Vue {
      @Reflect.metadata('worksStatic', true)
      static staticValue: string = 'staticValue'

      private _test: boolean = false

      @Reflect.metadata('worksMethod', true)
      test (): void {
        void 0
      }

      @Reflect.metadata('worksAccessor', true)
      get testAccessor (): boolean {
        return this._test
      }
    }

    expect(Reflect.getOwnMetadata('worksConstructor', Test)).toBe(true)
    expect(Reflect.getOwnMetadata('worksStatic', Test, 'staticValue')).toBe(true)
    expect(Reflect.getOwnMetadata('worksMethod', Test.prototype, 'test')).toBe(true)
    expect(Reflect.getOwnMetadata('worksAccessor', Test.prototype, 'testAccessor')).toBe(true)
  })
})
