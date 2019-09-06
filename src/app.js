import React from 'react'
import { Layout, Menu, Icon } from 'antd'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
// import Breakcrumbs from '../../components/breakcrumbs'
import routes from './routes'

const { Header, Sider, Content } = Layout

class BasicLayout extends React.Component {
  state = {
    collapsed: false
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0
          }}
        >
          <div className="main-logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="user" />
              <span>nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span>nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span>nav </span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="main-right" style={{ marginLeft: this.state.collapsed ? 80 : 200 }}>
          <Header className="main-header" style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="main-trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content className="main-content" style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            {/* <Breakcrumbs></Breakcrumbs> */}
            <BrowserRouter>
              <Switch>{renderRoutes(routes)}</Switch>
            </BrowserRouter>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default BasicLayout
