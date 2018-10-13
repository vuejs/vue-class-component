import 'reflect-metadata'
import Component, { createDecorator, mixins } from '../lib'
import { expect } from 'chai'
import * as td from 'testdouble'
import Vue from 'vue'

describe('vue-class-component with Babel', () => {
  it('should be instantiated without any errors', () => {
    @Component
    class MyComp {}
    expect(() => new MyComp()).to.not.throw(Error)
  })

  it('should collect class properties as data', () => {
    @Component({
      props: ['propValue']
    })
    class MyComp extends Vue {
      foo = 'hello'
      bar = 1 + this.propValue
    }
    const c = new MyComp({
      propsData: {
        propValue: 1
      }
    })
    expect(c.foo).to.equal('hello')
    expect(c.propValue).to.equal(1)
    expect(c.bar).to.equal(2)
  })

  it('should collect decorated class properties', () => {
    const valueDecorator = (value) => () => {
      return {
        enumerable: true,
        value: value
      }
    }

    const getterDecorator = (value) => () => {
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
      field1

      @getterDecorator('field2')
      field2
    }

    const c = new MyComp()
    expect(c.field1).to.equal('field1')
    expect(c.field2).to.equal('field2')
  })

  it('should not collect uninitialized class properties', () => {
    const Prop = createDecorator((options, key) => {
      if (!options.props) {
        options.props = {}
      }
      options.props[key] = true
    })

    @Component
    class MyComp {
      foo
      @Prop bar
    }
    const c = new MyComp()
    expect('foo' in c.$data).to.be.false
    expect('bar' in c.$data).to.be.false
  })

  it('warn if class property is used without inheriting Vue class', () => {
    const originalWarn = console.warn
    console.warn = td.function('warn')

    @Component({
      foo: Number
    })
    class MyComp {
      bar = this.foo + 2
    }
    const c = new MyComp({
      propsData: {
        foo: 1
      }
    })

    const message = '[vue-class-component] ' +
      'Component class must inherit Vue or its descendant class ' +
      'when class property is used.'

    try {
      td.verify(console.warn(message))
    } finally {
      console.warn = originalWarn
    }
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

    const vm = new MyComp()
    expect(vm.test).to.equal('foo')
  })

  it('should not throw if property decorator declare some methods', () => {
    const Test = createDecorator((options, key) => {
      if (!options.methods) {
        options.methods = {}
      }
      options.methods[key] = () => 'test'
    })

    @Component
    class MyComp extends Vue {
      @Test test
    }

    const vm = new MyComp()
    expect(vm.test()).to.equal('test')
  })

  it('should forward static members', () => {
    @Component
    class MyComp extends Vue {
      static foo = 'foo'

      static bar () {
        return 'bar'
      }
    }

    expect(MyComp.foo).to.equal('foo')
    expect(MyComp.bar()).to.equal('bar')
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
    }

    expect(Reflect.getOwnMetadata('worksConstructor', Test)).to.equal(true)
    expect(Reflect.getOwnMetadata('worksStatic', Test, 'staticValue')).to.equal(true)
    expect(Reflect.getOwnMetadata('worksMethod', Test.prototype, 'test')).to.equal(true)
    expect(Reflect.getOwnMetadata('worksAccessor', Test.prototype, 'testAccessor')).to.equal(true)
  })
})
