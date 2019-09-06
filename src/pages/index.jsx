import React from 'react'
import { Layout, Menu, Icon } from 'antd'
// import Breakcrumbs from '../../components/breakcrumbs'
import styles from './style.module.css'

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
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className={styles.logo} />
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
              <span>nav1 </span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className={styles.right}>
          <Header className={styles.header}>
            <Icon
              className={styles.trigger}
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content className={styles.content}>{/* <Breakcrumbs></Breakcrumbs> */}</Content>
        </Layout>
      </Layout>
    )
  }
}

export default BasicLayout
