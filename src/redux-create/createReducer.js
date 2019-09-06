import { NAMESPACE_SEP } from './constants'

export default function createReducer(model) {
  const reducerObj = Object.keys(model.reducers || []).reduce((reducer, key) => {
    return {
      ...reducer,
      [`${model.namespace}${NAMESPACE_SEP}${key}`]: model.reducers[key]
    }
  }, {})
  return function(state = model.state, action) {
    if (reducerObj.hasOwnProperty(action.type)) {
      return reducerObj[action.type](action.payload, state)
    }
    return state
  }
}
