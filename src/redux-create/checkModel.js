import { isFunction, isPlainObject, invariant } from './utils'

function isFunctionObject(obj) {
  return isPlainObject(obj) && Object.keys(obj).every(key => isFunction(obj[key]))
}

export default function checkModel(model, existModels) {
  const { namespace, reducers, effects } = model

  // namespace 必须被定义
  invariant(namespace, `[model] namespace should be defined`)
  // 并且是字符串
  invariant(
    typeof namespace === 'string',
    `[model] namespace should be string, but got ${typeof namespace}`
  )
  // 并且唯一
  invariant(
    !existModels.some(model => model.namespace === namespace),
    `[model] namespace should be unique`
  )

  // state 可以为任意值

  // reducers 可以为空，PlainObject
  if (reducers) {
    invariant(
      isFunctionObject(reducers),
      `[model] reducers should be plain function object, but got ${typeof reducers}`
    )
  }

  // effects 可以为空，PlainObject
  if (effects) {
    invariant(
      isFunctionObject(effects),
      `[model] effects should be plain function object, but got ${typeof effects}`
    )
  }
}
