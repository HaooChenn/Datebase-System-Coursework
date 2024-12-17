import { Modal, Form, Input, Button } from 'antd';

const MedicalRecordRequest = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="申请访问病历记录"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} onFinish={onSubmit}>
        <Form.Item
          name="patientInfo"
          label="病人信息"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="reason"
          label="申请原因"
          rules={[{ required: true }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交申请
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MedicalRecordRequest; 