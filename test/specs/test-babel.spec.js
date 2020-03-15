import 'reflect-metadata'
import { Options, createDecorator, mixins, Vue } from '../../src'
import { createApp } from 'vue'

describe('vue-class-component with Babel', () => {
  const root = document.createElement('div')

  it('should be instantiated without any errors', () => {
    class MyComp extends Vue {
      render() {}
    }
    expect(() =>  createApp(MyComp).mount(root)).not.toThrow()
  })

  it('should collect class properties as data', () => {
    @Options({
      props: ['propValue']
    })
    class MyComp extends Vue {
      foo = 'hello'
      bar = 1 + this.propValue

      render() {}
    }
    const c = createApp(MyComp, { propValue: 1 }).mount(root)
    expect(c.foo).toBe('hello')
    expect(c.propValue).toBe(1)
    expect(c.bar).toBe(2)
  })

  it('should not collect uninitialized class properties', () => {
    const Prop = createDecorator((options, key) => {
      if (!options.props) {
        options.props = {}
      }
      options.props[key] = {
        type: null
      }
    })

    class MyComp extends Vue {
      foo
      @Prop bar

      render() {}
    }
    const c = createApp(MyComp).mount(root)
    expect('foo' in c.$data).toBe(false)
    expect('bar' in c.$data).toBe(false)
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
      render() {}
    }

    const vm = createApp(MyComp).mount(root)
    expect(vm.test).toBe('foo')
  })

  it('should not throw if property decorator declare some methods', () => {
    const Test = createDecorator((options, key) => {
      if (!options.methods) {
        options.methods = {}
      }
      options.methods[key] = () => 'test'
    })

    class MyComp extends Vue {
      @Test test

      render() {}
    }

    const vm = createApp(MyComp).mount(root)
    expect(vm.test()).toBe('test')
  })

  it('should forward static members', () => {
    class MyComp extends Vue {
      static foo = 'foo'

      static bar () {
        return 'bar'
      }
    }

    expect(MyComp.foo).toBe('foo')
    expect(MyComp.bar()).toBe('bar')
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

      render() {}
    }

    const vm = createApp(MyComp).mount(root)
    expect(vm.valueA).toBe('hello')
    expect(vm.valueB).toBe(123)
    vm.test()
    expect(vm.valueA).toBe('hi')
    expect(vm.valueB).toBe(456)
  })

  it('copies reflection metadata', function () {
    @Reflect.metadata('worksConstructor', true)
    class Test extends Vue {
      @Reflect.metadata('worksStatic', true)
      static staticValue = 'staticValue'

      _test = false

      @Reflect.metadata('worksMethod', true)
      test () {
        void 0
      }

      @Reflect.metadata('worksAccessor', true)
      get testAccessor () {
        return this._test
      }

      render() {}
    }

    expect(Reflect.getOwnMetadata('worksConstructor', Test)).toBe(true)
    expect(Reflect.getOwnMetadata('worksStatic', Test, 'staticValue')).toBe(true)
    expect(Reflect.getOwnMetadata('worksMethod', Test.prototype, 'test')).toBe(true)
    expect(Reflect.getOwnMetadata('worksAccessor', Test.prototype, 'testAccessor')).toBe(true)
  })
})
