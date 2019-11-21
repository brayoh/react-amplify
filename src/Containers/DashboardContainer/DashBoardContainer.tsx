import * as React from 'react';
import { Layout, Menu, Icon } from 'antd';

const DashBoardContainer: React.SFC = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Layout className="cover" id="app-header">
      <Layout.Sider className="cover" trigger={null} collapsible collapsed={collapsed}>
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
      </Layout.Sider>
      <Layout>
        <Layout.Header style={{ background: '#fff', padding: 0 }}>
          <Icon
            className="trigger"
            onClick={() => setCollapsed(!collapsed)}
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
          />
        </Layout.Header>
        <Layout.Content
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
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default DashBoardContainer;
