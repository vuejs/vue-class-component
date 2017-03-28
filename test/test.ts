import Component, { createDecorator } from '../'
import { expect } from 'chai'
import Vue from 'vue'

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
      foo: number
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
      a: number
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
      a: number
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
      a: number
      data (): any {
        return { a: 1 }
      }
    }

    @Component
    class A extends Base {
      b: number
      data (): any {
        return { b: 2 }
      }
    }

    const a = new A()
    expect(a.a).to.equal(1)
    expect(a.b).to.equal(2)
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
      const computedOption: Vue.ComputedOptions<Vue> = options.computed![key]
      computedOption.cache = false
    })

    @Component
    class MyComp extends Vue {
      @Prop foo: string
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
})
