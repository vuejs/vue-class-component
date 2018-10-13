import 'reflect-metadata'
import Component, { createDecorator, mixins } from '../lib'
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

  it('data: should collect from decorated class properties', () => {
    const valueDecorator = (value: any) => (_: any, __: any): any => {
      return {
        enumerable: true,
        value
      }
    }

    const getterDecorator = (value: any) => (_: any, __: any): any => {
      return {
        enumerable: true,
        get () {
          return value
        }
      }
    }

    @Component
    class MyComp extends Vue {
      @valueDecorator('field1')
      field1!: string

      @getterDecorator('field2')
      field2!: string
    }

    const c = new MyComp()
    expect(c.field1).to.equal('field1')
    expect(c.field2).to.equal('field2')
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

      static myFunc () {
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

  it('copies reflection metadata', function () {
    @Component
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

    expect(Reflect.getOwnMetadata('worksConstructor', Test)).to.equal(true)
    expect(Reflect.getOwnMetadata('worksStatic', Test, 'staticValue')).to.equal(true)
    expect(Reflect.getOwnMetadata('worksMethod', Test.prototype, 'test')).to.equal(true)
    expect(Reflect.getOwnMetadata('worksAccessor', Test.prototype, 'testAccessor')).to.equal(true)
  })
})
