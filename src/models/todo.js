import { model } from '../redux-create'

function getData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(3)
    }, 2000)
  })
}

export default model({
  namespace: 'todo',
  state: [],
  reducers: {
    add(action, state) {
      return [...state, { id: action.id, text: action.text, completed: false }]
    },

    toggle(id, state) {
      console.log(state)
      return state.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    }
  },
  effects: {
    async addt(payload, dispatch, getState) {
      const a = await getData()
      console.log(a, getState())
      dispatch('add', { id: 9999, text: 'aaaaaaaaaaaa' })
    }
  }
})
