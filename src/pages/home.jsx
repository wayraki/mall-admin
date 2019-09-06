import React from 'react'
import { connect } from 'react-redux'
import model from '../models/todo'

function Home(props) {
  let input
  console.log(props)
  return (
    <div className="App">
      <ul>
        {props.todo.map(item => (
          <li key={item.id} style={item.completed ? { textDecoration: 'line-through' } : null}>
            {item.text}
            <button onClick={() => props.toggle(item.id)}>完成</button>
          </li>
        ))}
      </ul>
      <br />
      <input
        ref={node => {
          input = node
        }}
      />
      <button
        onClick={() => {
          props.add({ id: props.todo.length, text: input.value })
          input.value = ''
        }}
      >
        Add Todo
      </button>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    todo: state.todo
  }
}

const mapDispatchToProps = dispatch => {
  return {
    add: postData => {
      dispatch(model.actions.add(postData))
    },
    toggle: id => {
      dispatch(model.actions.toggle(id))
    },
    addt: () => {
      dispatch(model.actions.addt(1))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
