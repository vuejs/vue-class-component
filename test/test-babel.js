import Component, { createDecorator } from '../lib/index'
import chai, { expect } from 'chai'
import spies from 'chai-spies'
import Vue from 'vue'

chai.use(spies)

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
    const spy = chai.spy.on(console, 'warn')

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

    expect(spy).to.have.been.called.with(message)
  })
})