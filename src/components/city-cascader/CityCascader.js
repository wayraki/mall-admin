import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Cascader } from 'antd'
import dataSource from '../../config/data-source'

const { addresss } = dataSource

class CityCascader extends Component {
  static propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func
  }

  static defaultProps = {
    value: []
  }

  handleChange = value => {
    this.props.onChange && this.props.onChange(value)
  }

  render() {
    return <Cascader options={addresss} onChange={this.handleChange} placeholder="Please select" />
  }
}

export default CityCascader
