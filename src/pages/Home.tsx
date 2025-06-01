import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Typography, message, Form, Collapse } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { validateOllamaUrl } from '../utils/api';
import { RocketOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const Home: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeKey, setActiveKey] = useState<string[]>([]);

  useEffect(() => {
    const baseUrl = searchParams.get('base_url');
    const apiKey = searchParams.get('api_key');
    const defaultModel = searchParams.get('default_model');

    if (baseUrl || apiKey || defaultModel) {
      form.setFieldsValue({
        baseUrl: baseUrl || 'http://localhost:11434',
        apiKey: apiKey || '',
        defaultModel: defaultModel || ''
      });

      // Automatically expand advanced settings if API key or default model is present
      if (apiKey || defaultModel) {
        setActiveKey(['1']);
      }
    }
  }, [searchParams, form]);

  const handleConnect = async (values: any) => {
    setLoading(true);
    try {
      const isValid = await validateOllamaUrl(values.baseUrl, values.apiKey);
      if (isValid) {
        const params = new URLSearchParams({
          url: values.baseUrl,
          ...(values.apiKey && { api_key: values.apiKey }),
          ...(values.defaultModel && { default_model: values.defaultModel })
        });
        navigate(`/chat?${params.toString()}`);
      } else {
        message.error('无法连接到服务器，请检查地址是否正确');
      }
    } catch (error) {
      message.error('连接验证失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'var(--background-color)',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%',
          maxWidth: '440px',
          borderRadius: 'var(--ant-border-radius-lg)',
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <RocketOutlined style={{ 
            fontSize: '48px', 
            color: 'var(--ant-color-primary)', 
            marginBottom: '16px' 
          }} />
          <Title level={2} style={{ margin: '0 0 8px', fontSize: '28px' }}>
            WebChatUI
          </Title>
          <Text type="secondary">
            连接 AI 服务商
          </Text>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleConnect}
          initialValues={{
            baseUrl: 'http://localhost:11434'
          }}
        >
          <Form.Item
            name="baseUrl"
            rules={[{ required: true, message: '请输入服务器地址' }]}
          >
            <Input placeholder="请输入服务器地址" size="large" />
          </Form.Item>

          <Collapse 
            ghost 
            className="advanced-settings" 
            destroyInactivePanel={false}
            activeKey={activeKey}
            onChange={(keys) => setActiveKey(typeof keys === 'string' ? [keys] : keys)}
          >
            <Panel header="高级设置" key="1">
              <Form.Item name="apiKey">
                <Input.Password placeholder="请输入 API Key" />
              </Form.Item>

              <Form.Item name="defaultModel">
                <Input placeholder="请输入默认模型" />
              </Form.Item>
            </Panel>
          </Collapse>

          <Form.Item style={{ marginTop: '24px' }}>
            <Button 
              type="primary" 
              htmlType="submit"
              size="large"
              block 
              loading={loading}
            >
              开始聊天
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Home;