import Component from '../index'
import { expect } from 'chai'
import Vue from 'vue'

describe('vue-class-component', () => {

  it('hooks', () => {
    let created = false
    let destroyed = false

    @Component
    class MyComp {
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

  it('methods', () => {
    let msg

    @Component
    class MyComp {
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
    class MyComp {
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

  it('other options', (done) => {
    let v

    @Component({
      watch: {
        a: val => v = val
      }
    })
    class MyComp {
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
    class Base {
      data () {
        return { a: 1 }
      }
    }

    @Component
    class A extends Base {
      data () {
        return { b: 2 }
      }
    }

    const a = new A()
    expect(a.a).to.equal(1)
    expect(a.b).to.equal(2)
  })
})
