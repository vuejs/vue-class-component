import Vue from 'vue'
import { VueClass } from './declarations'
import { warn } from './util'

export function collectDataFromConstructor (vm: Vue, Component: VueClass<Vue>) {
  // переопределить _init, чтобы предотвратить инициализацию как экземпляр Vue
  const originalInit = Component.prototype._init
  Component.prototype._init = function (this: Vue) {
    // прокси к фактическому vm
    const keys = Object.getOwnPropertyNames(vm)
    // 2.2.0 compat (реквизиты больше не отображаются как собственные свойства)
    if (vm.$options.props) {
      for (const key in vm.$options.props) {
        if (!vm.hasOwnProperty(key)) {
          keys.push(key)
        }
      }
    }
    keys.forEach(key => {
      Object.defineProperty(this, key, {
        get: () => vm[key],
        set: value => { vm[key] = value },
        configurable: true
      })
    })
  }

  // должны быть приобретены значения класса собственности
  const data = new Component()

  // восстановить исходный _init, чтобы избежать утечки памяти (#209)
  Component.prototype._init = originalInit

  // создать простой объект данных
  const plainData = {}
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      plainData[key] = data[key]
    }
  })

  if (process.env.NODE_ENV !== 'production') {
    if (!(Component.prototype instanceof Vue) && Object.keys(plainData).length > 0) {
      warn(
        'Класс компонента должен наследовать Vue или его дочерний класс ' +
        'когда используется свойство класса.'
      )
    }
  }

  return plainData
}
