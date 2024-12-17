import { Layout, Header, Content } from 'antd';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: 0 }}>
        <div className="logo">
          <h1>Admin Management System</h1>
        </div>
      </Header>
      <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AdminLayout; 