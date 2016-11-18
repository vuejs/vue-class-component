import Component, { createDecorator } from '../lib/index'
import { expect } from 'chai'
import Vue from 'vue'

describe('vue-class-component with Babel', () => {
  it('should be instantiated without any errors', () => {
    @Component
    class MyComp {}
    expect(() => new MyComp()).to.not.throw(Error)
  })

  it('should collect class properties as data', () => {
    @Component
    class MyComp {
      foo = 'hello'
    }
    const c = new MyComp()
    expect(c.foo).to.equal('hello')
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
})