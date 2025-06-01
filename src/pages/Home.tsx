import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Typography, message, Form, Collapse } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { validateOllamaUrl } from '../utils/api';
import { RocketOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Panel } = Collapse;

// Styled Components
const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--background-color);
  padding: 20px;
`;

const HomeCard = styled(Card)`
  width: 100%;
  max-width: 440px;
  border-radius: var(--ant-border-radius-lg);
  
  .ant-card-body {
    padding: 32px;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const RocketIcon = styled(RocketOutlined)`
  font-size: 48px;
  color: var(--ant-color-primary);
  margin-bottom: 16px;
`;

const AppTitle = styled(Title)`
  margin: 0 0 8px !important;
  font-size: 28px !important;
`;

const AdvancedSettings = styled(Collapse)`
  &.ant-collapse-ghost .ant-collapse-header {
    padding: 8px 0 !important;
  }
  
  &.ant-collapse-ghost .ant-collapse-content-box {
    padding: 0 !important;
  }
  
  .ant-form-item:last-child {
    margin-bottom: 0;
  }
`;

const SubmitButton = styled(Button)`
  margin-top: 24px;
`;

const Home: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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

  // 同步更新URL参数
  const updateUrlParams = (values: any) => {
    const params = new URLSearchParams();
    
    if (values.baseUrl && values.baseUrl !== 'http://localhost:11434') {
      params.set('base_url', values.baseUrl);
    }
    
    if (values.apiKey) {
      params.set('api_key', values.apiKey);
    }
    
    if (values.defaultModel) {
      params.set('default_model', values.defaultModel);
    }
    
    setSearchParams(params, { replace: true });
  };

  // 处理表单值变化
  const handleValuesChange = (changedValues: any, allValues: any) => {
    updateUrlParams(allValues);
  };

  const handleConnect = async (values: any) => {
    setLoading(true);
    try {
      const result = await validateOllamaUrl(values.baseUrl, values.apiKey);
      if (result.isValid && result.validUrl) {
        // 如果验证成功的URL与原始URL不同（添加了/v1），更新表单
        if (result.validUrl !== values.baseUrl) {
          form.setFieldValue('baseUrl', result.validUrl);
          message.success('已自动添加 /v1 后缀以确保连接成功');
          // 同步更新URL参数
          updateUrlParams({ ...values, baseUrl: result.validUrl });
        }
        
        const params = new URLSearchParams({
          url: result.validUrl,
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
    <Container>
      <HomeCard>
        <HeaderSection>
          <RocketIcon />
          <AppTitle level={2}>
            WebChatUI
          </AppTitle>
          <Text type="secondary">
            连接 AI 服务商
          </Text>
        </HeaderSection>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleConnect}
          onValuesChange={handleValuesChange}
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

          <AdvancedSettings 
            ghost 
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
          </AdvancedSettings>

          <Form.Item>
            <SubmitButton 
              type="primary" 
              htmlType="submit"
              size="large"
              block 
              loading={loading}
            >
              开始聊天
            </SubmitButton>
          </Form.Item>
        </Form>
      </HomeCard>
    </Container>
  );
};

export default Home;