import { Card, Row, Col, Table, Badge, Button, Modal, Tabs, Tag, Space } from 'antd';
import { useState } from 'react';

const AdminDashboard = () => {
  const [approvalRequests, setApprovalRequests] = useState([]);
  
  // 客户管理表格列
  const clientColumns = [
    { title: '姓名', dataIndex: 'name' },
    { title: '房间号', dataIndex: 'roomNumber' },
    { 
      title: '健康状态', 
      dataIndex: 'healthStatus',
      render: (status) => {
        const color = status === '危急' ? 'red' : status === '需要关注' ? 'orange' : 'green';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { 
      title: '生命体征', 
      dataIndex: 'vitals',
      render: (vitals) => (
        <Space direction="vertical">
          <span>血压: {vitals?.bloodPressure}</span>
          <span>心率: {vitals?.heartRate}</span>
          <span>体温: {vitals?.temperature}</span>
        </Space>
      )
    },
    { title: '主治医生', dataIndex: 'doctor' },
    { title: '负责护士', dataIndex: 'nurse' },
    { title: '负责护工', dataIndex: 'caregiver' },
    { 
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button type="primary">查看详情</Button>
          <Button>分配人员</Button>
          <Button>查看病历</Button>
        </Space>
      )
    }
  ];

  // 待分配客户表格列
  const unassignedColumns = [
    ...clientColumns.filter(col => col.dataIndex !== 'nurse' && col.dataIndex !== 'caregiver'),
    {
      title: '操作',
      render: (_, record) => (
        <Button type="primary">分配护理人员</Button>
      )
    }
  ];

  // 审批请求表格列
  const approvalColumns = [
    { title: '申请护士', dataIndex: 'nurseName' },
    { title: '病人信息', dataIndex: 'patientInfo' },
    { title: '申请原因', dataIndex: 'reason' },
    { 
      title: '紧急程度',
      dataIndex: 'urgency',
      render: (urgency) => (
        <Tag color={urgency === '紧急' ? 'red' : 'orange'}>{urgency}</Tag>
      )
    },
    { title: '申请时间', dataIndex: 'requestTime' },
    { 
      title: '状态', 
      dataIndex: 'status',
      render: status => (
        <Badge status={status === 'pending' ? 'processing' : 'success'} 
               text={status === 'pending' ? '待审批' : '已审批'} />
      )
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button type="primary">审批</Button>
          <Button>查看详情</Button>
        </Space>
      )
    }
  ];

  const items = [
    {
      key: '1',
      label: '在住客户管理',
      children: (
        <Table 
          columns={clientColumns} 
          scroll={{ x: true }}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>
                病史: {record.medicalHistory}<br/>
                当前用药: {record.currentMedication}<br/>
                特殊注意事项: {record.specialNotes}
              </p>
            ),
          }}
        />
      )
    },
    {
      key: '2',
      label: '待分配客户',
      children: <Table columns={unassignedColumns} scroll={{ x: true }} />
    },
    {
      key: '3',
      label: '病历访问审批',
      children: <Table columns={approvalColumns} dataSource={approvalRequests} scroll={{ x: true }} />
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <h2 style={{ marginBottom: '20px' }}>养老院管理系统</h2>
        <Tabs 
          defaultActiveKey="1" 
          items={items}
          type="card"
        />
      </Card>
    </div>
  );
};

export default AdminDashboard; 