declare function describe(name: string, fn: () => void): void
declare function it(name: string, fn: () => void): void

declare function equals<T, U>(value: Equals<T, U>): void

// https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false
