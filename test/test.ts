import Component, { createDecorator, mixins } from '../lib'
import { Emit, Inject, Prop, Provide, Watch } from '../lib'
import { expect } from 'chai'
import * as td from 'testdouble'
import Vue, { ComputedOptions } from 'vue'

describe('vue-class-component', () => {

  it('hooks', () => {
    let created = false
    let destroyed = false

    @Component
    class MyComp extends Vue {
      created () {
        created = true
      }
      destroyed () {
        destroyed = true
      }
    }

    const c = new MyComp()
    expect(created).to.be.true
    expect(destroyed).to.be.false
    c.$destroy()
    expect(destroyed).to.be.true
  })

  it('hooks: adding custom hooks', () => {
    Component.registerHooks(['beforeRouteEnter'])

    @Component
    class MyComp extends Vue {
      static options: any

      beforeRouteEnter () {
        return 'beforeRouteEnter'
      }
    }

    expect(MyComp.options.beforeRouteEnter()).to.equal('beforeRouteEnter')
  })

  it('data: should collect from class properties', () => {
    @Component({
      props: ['foo']
    })
    class MyComp extends Vue {
      foo!: number
      a: string = 'hello'
      b: number = this.foo + 1
    }

    const c = new MyComp({
      propsData: {
        foo: 1
      }
    })
    expect(c.a).to.equal('hello')
    expect(c.b).to.equal(2)
  })

  it('data: should collect custom property defined on beforeCreate', () => {
    @Component
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
    }

    const c = new MyComp()
    expect(c.foo).to.equal('Hello, world')
  })

  it('methods', () => {
    let msg: string = ''

    @Component
    class MyComp extends Vue {
      hello () {
        msg = 'hi'
      }
    }

    const c = new MyComp()
    c.hello()
    expect(msg).to.equal('hi')
  })

  it('computed', () => {
    @Component
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
    }

    const c = new MyComp()
    expect(c.a).to.equal(1)
    expect(c.b).to.equal(2)
    c.a = 2
    expect(c.b).to.equal(3)
  })

  describe('name', () => {
    it('via name option', () => {
      @Component({ name: 'test' })
      class MyComp extends Vue {}

      const c = new MyComp()
      expect(c.$options.name).to.equal('test')
    })

    it('via _componentTag', () => {
      @Component
      class MyComp extends Vue {
        static _componentTag = 'test'
      }

      const c = new MyComp()
      expect(c.$options.name).to.equal('test')
    })

    it('via class name', () => {
      @Component
      class MyComp extends Vue {}

      const c = new MyComp()
      expect(c.$options.name).to.equal('MyComp')
    })
  })

  it('other options', (done) => {
    let v: number

    @Component<MyComp>({
      watch: {
        a: val => v = val
      }
    })
    class MyComp extends Vue {
      a!: number
      data () {
        return { a: 1 }
      }
    }

    const c = new MyComp()
    c.a = 2
    Vue.nextTick(() => {
      expect(v).to.equal(2)
      done()
    })
  })

  it('extending', function () {
    @Component
    class Base extends Vue {
      a!: number
      data (): any {
        return { a: 1 }
      }
    }

    @Component
    class A extends Base {
      b!: number
      data (): any {
        return { b: 2 }
      }
    }

    const a = new A()
    expect(a.a).to.equal(1)
    expect(a.b).to.equal(2)
  })

  // #199
  it('should not re-execute super class decortors', function (done) {
    const Watch = (valueKey: string) => createDecorator((options, key) => {
      if (!options.watch) {
        options.watch = {}
      }
      options.watch[valueKey] = key
    })

    const spy = td.function()

    @Component
    class Base extends Vue {
      count = 0

      @Watch('count')
      notify () {
        spy()
      }
    }

    @Component
    class A extends Base {}

    const vm = new A()
    vm.count++
    vm.$nextTick(() => {
      td.verify(spy(), { times: 1 })
      done()
    })
  })

  it('createDecorator', function () {
    const Prop = createDecorator((options, key) => {
      // component options should be passed to the callback
      // and update for the options affect the component
      (options.props || (options.props = {}))[key] = true
    })

    const NoCache = createDecorator((options, key) => {
      // options should have computed and methods etc.
      // that specified by class property accessors and methods
      const computedOption = options.computed![key] as ComputedOptions<Vue>
      computedOption.cache = false
    })

    @Component
    class MyComp extends Vue {
      @Prop foo!: string
      @NoCache get bar (): string {
        return 'world'
      }
    }

    const c = new MyComp({
      propsData: {
        foo: 'hello'
      }
    })
    expect(c.foo).to.equal('hello')
    expect(c.bar).to.equal('world')
    expect((MyComp as any).options.computed.bar.cache).to.be.false
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
      @Component
      class Child extends Vue {
        @Value('child')
        value!: string
      }
      return Child
    }

    @Component({
      components: {
        Child: createChild()
      }
    })
    class Parent extends Vue {
      @Value('parent')
      value!: string
    }

    const parent = new Parent()
    const child = new (parent as any).$options.components.Child()
    expect(parent.value).to.equal('parent')
    expect(child.value).to.equal('child')
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

    @Component
    @DataMixin
    class MyComp extends Vue {}

    const vm: any = new MyComp()
    expect(vm.test).to.equal('foo')
  })

  it('forwardStatics', function () {
    @Component
    class MyComp extends Vue {
      static myValue = 52

      static myFunc() {
        return 42
      }
    }

    expect(MyComp.myValue).to.equal(52)
    expect(MyComp.myFunc()).to.equal(42)
  })

  it('should warn if declared static property uses a reserved name but not prevent forwarding', function () {
    const originalWarn = console.warn
    console.warn = td.function('warn') as any

    @Component
    class MyComp extends Vue {
      static options = 'test'
    }

    const message = '[vue-class-component] ' +
      'Static property name \'options\' declared on class \'MyComp\' conflicts with ' +
      'reserved property name of Vue internal. It may cause unexpected behavior of the component. Consider renaming the property.'

    expect(MyComp.options).to.equal('test')
    try {
      td.verify(console.warn(message))
    } finally {
      console.warn = originalWarn
    }
  })

  it('mixin helper', function () {
    @Component
    class MixinA extends Vue {
      valueA = 'hello'
    }

    @Component
    class MixinB extends Vue {
      valueB = 123
    }

    @Component
    class MyComp extends mixins(MixinA, MixinB) {
      test () {
        this.valueA = 'hi'
        this.valueB = 456
      }
    }

    const vm = new MyComp()
    expect(vm.valueA).to.equal('hello')
    expect(vm.valueB).to.equal(123)
    vm.test()
    expect(vm.valueA).to.equal('hi')
    expect(vm.valueB).to.equal(456)
  })

  describe('property decorators', () => {
    it('Emit decorator', () => {
      @Component
      class Child extends Vue {
        count = 0

        @Emit('reset') resetCount() {
          this.count = 0
        }

        @Emit() increment(n: number) {
          this.count += n
        }

        @Emit() canceled() {
          return false
        }
      }
      const child = new Child()

      let result = {
        called: false,
        event: '',
        arg: 0
      }

      child.$emit = (event, ...args) => {
        result.called = true
        result.event = event
        result.arg = args[0]

        return child
      }

      child.resetCount()
      expect(result.called).equal(true)
      expect(result.event).equal('reset')
      expect(result.arg).equal(undefined)

      result.called = false
      child.increment(30)
      expect(result.event).equal('increment')
      expect(result.arg).equal(30)

      result.called = false
      child.canceled()
      expect(result.called).equal(false)
    })

    it('Inject decorator', () => {
      const s = Symbol()

      @Component({
        provide() {
          return {
            [s]: 'one',
            bar: 'two'
          }
        }
      })
      class Parent extends Vue {
      }

      const parent = new Parent()

      @Component
      class Child extends Vue {
        @Inject(s) foo!: string
        @Inject() bar!: string
      }

      const child = new Child({ parent })
      expect(child.foo).equal('one')
      expect(child.bar).equal('two')

      @Component
      class GrandChild extends Vue {
        @Inject(s) foo!: string
        @Inject() bar!: string
      }

      const grandChild = new GrandChild({ parent: child })
      expect(grandChild.foo).equal('one')
      expect(grandChild.bar).equal('two')
    })

    it('Prop decorator', () => {
      @Component
      class Test extends Vue {

        @Prop(Number) propA!: number
        @Prop({ default: 'propB' }) propB!: string
        @Prop([Boolean, String]) propC!: boolean | string
      }

      const { $options } = new Test()
      const { props } = $options
      if (!(props instanceof Array)) {
        expect(props!['propA']).to.deep.equal({ type: Number })
        expect(props!['propB']).to.deep.equal({ default: 'propB' })
        expect(props!['propC']).to.deep.equal({ type: [Boolean, String] })
      }

      const test = new Test({ propsData: { propA: 10 } })
      expect(test.propA).equal(10)
      expect(test.propB).equal('propB')
    })

    it('Provide decorator', () => {
      @Component
      class Parent extends Vue {
        @Provide() one = 'one'
        @Provide('two') two_ = 'two'
      }

      @Component
      class Child extends Vue {
        @Inject() one!: string
        @Inject() two!: string
      }

      const parent = new Parent()
      const child = new Child({ parent })
      expect(child.one).equal('one')
      expect(child.two).equal('two')
    })

    it('Watch decorator', () => {
      let changed = false

      @Component
      class MyComp extends Vue {
        expression = false

        @Watch('expression', { immediate: true })
        watcher() {
          changed = true
        }
      }

      const comp = new MyComp()
      comp.expression = true

      expect(changed).to.equal(true)
    })
  })
})
