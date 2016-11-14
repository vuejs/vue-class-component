import Component from '../lib/index'
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
})