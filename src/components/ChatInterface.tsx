import React, { useState, useCallback, useEffect } from 'react';
import { Select, message, Spin, Input, List, Avatar, Card, Empty } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined, MessageOutlined } from '@ant-design/icons';
import OpenAI from 'openai';
import { ChatMessage, ModelInfo } from '../types/chat';
import { fetchModels } from '../utils/api';

// 聊天界面组件的属性定义
interface ChatInterfaceProps {
  config: {
    ollamaUrl: string;
    apiKey?: string;
    defaultModel?: string;
  };
}

// 聊天界面组件
const ChatInterface: React.FC<ChatInterfaceProps> = ({ config }) => {
  // 状态管理
  const [messages, setMessages] = useState<ChatMessage[]>([]); // 聊天消息列表
  const [inputValue, setInputValue] = useState(''); // 输入框的值
  const [model, setModel] = useState<string>(''); // 当前选择的模型
  const [models, setModels] = useState<ModelInfo[]>([]); // 可用模型列表
  const [loading, setLoading] = useState(true); // 加载状态
  const [sending, setSending] = useState(false); // 发送状态
  const [openai, setOpenai] = useState<OpenAI | null>(null); // OpenAI 实例

  // 初始化 OpenAI 实例和加载模型列表
  useEffect(() => {
    const openaiInstance = new OpenAI({
      baseURL: config.ollamaUrl,
      apiKey: config.apiKey || 'dummy-key',
      dangerouslyAllowBrowser: true
    });
    setOpenai(openaiInstance);

    const loadModels = async () => {
      try {
        const availableModels = await fetchModels(config.ollamaUrl, config.apiKey);
        setModels(availableModels);
        if (config.defaultModel) {
          setModel(config.defaultModel);
        } else if (availableModels.length > 0) {
          setModel(availableModels[0].id);
        }
      } catch (error) {
        message.error('加载模型列表失败');
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, [config.ollamaUrl, config.apiKey, config.defaultModel]);

  // 发送消息处理函数
  const handleSend = async () => {
    if (!inputValue.trim() || !openai || sending) return;

    const userMessage: ChatMessage = {
      type: 'text',
      content: inputValue,
      position: 'right',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSending(true);

    try {
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: inputValue }]
      });

      const response = completion.choices[0]?.message?.content || '无响应';
      const assistantMessage: ChatMessage = {
        type: 'text',
        content: response,
        position: 'left',
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      message.error('发送消息失败，请稍后重试');
      console.error('Error:', error);
    } finally {
      setSending(false);
    }
  };

  // 加载状态显示
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  // 渲染聊天界面
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-[800px] h-[600px] flex flex-col shadow-xl rounded-2xl" bodyStyle={{ padding: 0, flex: 1 }}>
        {/* 消息列表区域 */}
        <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0 }}>
          <List
            dataSource={messages}
            locale={{
              emptyText: (
                <Empty
                  image={<MessageOutlined style={{ fontSize: 48, color: '#52c41a' }} />}
                  description="开始聊天"
                />
              )
            }}
            renderItem={(msg) => (
              <List.Item className={`flex ${msg.position === 'right' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start max-w-[70%] ${msg.position === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar
                    icon={msg.position === 'right' ? <UserOutlined /> : <RobotOutlined />}
                    className={`${msg.position === 'right' ? 'ml-2' : 'mr-2'} ${
                      msg.position === 'right' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  />
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      msg.position === 'right'
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-800 shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>

        {/* 输入区域 */}
        <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
          <div className="flex gap-2 px-4">
            <Input.Search
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入消息..."
              onSearch={handleSend}
              enterButton={
                <div
                  className={`flex items-center justify-center w-12 h-[44px] rounded-r-xl transition-all duration-200 ${
                    sending || !inputValue.trim()
                      ? 'bg-gray-200 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 active:scale-95'
                  }`}
                >
                  <SendOutlined className="text-white text-lg" />
                </div>
              }
              disabled={sending}
              className="flex-1"
              addonBefore={
                <Select
                  value={model}
                  onChange={setModel}
                  style={{ width: 140 }}
                  options={models.map(m => ({ value: m.id, label: m.name }))}
                  placeholder="选择模型"
                  bordered={false}
                  className="flex-shrink-0"
                />
              }
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;