/**
 * @fileOverview page组件
 * @author wayraki
 * @version 0.1
 */

import React from 'react'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'

function Page(props) {
  return <DocumentTitle title={props.title + ' - 商城平台'}>{props.children}</DocumentTitle>
}

Page.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired
}

export default Page
