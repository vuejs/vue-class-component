import { Vue, props, emits, mixins } from '../src'

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

        equals<typeof vm.$emit, ((event: string, ...args: any[]) => void) & ((event: never, ...args: any[]) => void)>(true)
      }
    }
  })

  it('mixes props and emits mixins', () => {
    const Props = props({
      value: String
    })

    const Emits = emits({
      input: (value: string) => true
    })

    class App extends mixins(Props, Emits) {
      mounted() {
        const vm = this
        equals<typeof vm.$props.value, string | undefined>(true)
        equals<typeof vm.$emit, ((event: 'input', value: string) => void) & ((event: never, ...args: any[]) => void)>(true)
      }
    }
  })
})

describe('props', () => {
  it('types with array style props definition', () => {
    const Props = props(['foo'])
    class App extends Props {
      mounted() {
        const vm = this
        equals<typeof vm.foo, any>(true)
        equals<typeof vm.$props.foo, any>(true)

        // @ts-expect-error
        this.bar
        // @ts-expect-error
        this.$props.bar
      }
    }
  })

  it('types with object style props definition', () => {
    const Props = props({
      foo: {
        type: Number,
        default: 42
      },

      bar: {
        type: String,
        required: true
      },

      baz: {
        type: Boolean
      }
    })

    class App extends Props {
      mounted() {
        type ExpectedProps = Readonly<{
          foo: number
          bar: string
        } & {
          baz?: boolean | undefined
        }>

        const vm = this
        equals<typeof vm.foo, number>(true)
        equals<typeof vm.bar, string>(true)
        equals<typeof vm.baz, boolean | undefined>(true)
        equals<typeof vm.$props, ExpectedProps>(true)

        // @ts-expect-error
        this.nonExist
      }
    }
  })

  it('does not lose $emit type', () => {
    const Props = props(['foo'])
    class App extends Props {
      mounted() {
        const vm = this
        equals<typeof vm.$emit, (event: string, ...args: any[]) => void>(true)
        equals<typeof vm.$emit, any>(false)
      }
    }
  })
})

describe('emits', () => {
  it('types with array style emits definition', () => {
    const Emits = emits(['change'])
    class App extends Emits {
      mounted() {
        const vm = this
        equals<typeof vm.$emit, (event: 'change', ...args: any[]) => void>(true)
      }
    }
  })

  it('types with object style emits definition', () => {
    const Emits = emits({
      change: (value: number) => true,
      input: (value: number, additional: string) => true
    })

    class App extends Emits {
      mounted() {
        type ExpectedEmit
          = ((event: 'change', value: number) => void)
          & ((event: 'input', value: number, additional: string) => void)


        const vm = this
        equals<typeof vm.$emit, ExpectedEmit>(true)
      }
    }
  })

  it('does not lose $props type', () => {
    const Emits = emits(['change'])
    class App extends Emits {
      mounted() {
        const vm = this
        equals<typeof vm.$props, {}>(true)
      }
    }
  })
})