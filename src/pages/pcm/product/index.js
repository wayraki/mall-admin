import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Button, Input, List, Card, Avatar } from 'antd'
import styles from './style.less'

const { Search } = Input

class ProductList extends Component {
  state = {
    autoLogin: true
  }

  handleSubmit = (err, values) => {
    const { type } = this.state
    if (!err) {
      const { dispatch } = this.props
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type
        }
      })
    }
  }

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked
    })
  }

  render() {
    const data = [
      {
        title: 'Title 2'
      },
      {
        title: 'Title 2'
      },
      {
        title: 'Title 3'
      },
      {
        title: 'Title 4'
      }
    ]
    return (
      <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
        ...
        <br />
        Really
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        long
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        ...
        <br />
        content
      </div>
    )
  }
}

export default ProductList
