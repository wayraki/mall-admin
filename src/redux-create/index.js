import checkModel from './checkModel'
import createAction from './createAction'
import createReducer from './createReducer'

const existModels = []

export function model(model) {
  checkModel(model, existModels)
  existModels.push(model.namespace)
  return {
    actions: createAction(model),
    reducer: createReducer(model)
  }
}
