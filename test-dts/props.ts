import { prop, Vue } from '../src'

describe('props', () => {
  it('types component props', () => {
    interface Person {
      name: string
      age?: number
    }

    class Props {
      foo!: string
      bar?: number
      baz = prop({ default: false })
      qux = prop<Person>({
        default: () => ({
          name: 'Test',
          age: 20,
        }),
      })

      // @ts-expect-error
      invalidDefault: string = prop({ default: 'default' })
    }

    class App extends Vue.props(Props) {
      mounted() {
        const vm = this

        equals<typeof vm.foo, string>(true)
        equals<typeof vm.bar, number | undefined>(true)
        equals<typeof vm.baz, boolean>(true)
        equals<typeof vm.qux, Person>(true)
        equals<typeof vm.$props.foo, string>(true)
        equals<typeof vm.$props.bar, number | undefined>(true)
        equals<typeof vm.$props.baz, boolean | undefined>(true)
        equals<typeof vm.$props.qux, Person | undefined>(true)

        // @ts-expect-error
        vm.notExists
        // @ts-expect-error
        vm.$props.notExists
      }
    }
  })
})
