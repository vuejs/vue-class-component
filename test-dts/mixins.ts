import { Vue, mixins } from '../src'

describe('mixins', () => {
  it('mixes multiple Vue class', () => {
    class Foo extends Vue {
      foo: string = ''
    }

    class Bar extends Vue {
      bar: number = 0
    }

    class Baz extends Vue {
      baz: boolean = false
    }

    class App extends mixins(Foo, Bar, Baz) {
      mounted() {
        const vm = this
        equals<typeof vm.foo, string>(true)
        equals<typeof vm.bar, number>(true)
        equals<typeof vm.baz, boolean>(true)
        // @ts-expect-error
        this.nonExist

        equals<typeof vm.$emit, (event: string, ...args: any[]) => void>(true)
      }
    }
  })
})
