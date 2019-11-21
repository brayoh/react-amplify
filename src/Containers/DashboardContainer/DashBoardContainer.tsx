import * as React from 'react';
import { Layout, Menu, Icon } from 'antd';

// css files
import './DashBoardContainer.css';

const { Header, Sider, Content } = Layout;

class DashBoardContainer extends React.Component {
  state = {
    collapsed: false,
  };

  render() {
    return (
      <Layout className="cover" id="app-header">
        <Sider
          className="cover"
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="home" />
              <span>Home</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="setting" />
              <span>Settings</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="question-circle" />
              <span>About</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
            }}
          >
            <div className="text-center">
              <h1>Hello world</h1>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default DashBoardContainer;
