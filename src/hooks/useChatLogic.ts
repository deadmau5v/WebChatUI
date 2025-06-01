import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import OpenAI from 'openai';
import { ChatMessage, ModelInfo } from '../types/chat';
import { fetchModels } from '../utils/api';

// 配置接口
interface ChatConfig {
  ollamaUrl: string;
  apiKey?: string;
  defaultModel?: string;
}

// Hook 返回值接口
interface UseChatLogicReturn {
  messages: ChatMessage[];
  inputValue: string;
  setInputValue: (value: string) => void;
  model: string;
  setModel: (model: string) => void;
  models: ModelInfo[];
  loading: boolean;
  sending: boolean;
  handleSend: () => Promise<void>;
  clearContext: () => void;
}

// 聊天逻辑 Hook
export const useChatLogic = (config: ChatConfig): UseChatLogicReturn => {
  // 状态管理
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [model, setModel] = useState<string>('');
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [openai, setOpenai] = useState<OpenAI | null>(null);

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

  // 清理上下文函数
  const clearContext = useCallback(() => {
    setMessages([]);
    message.success('上下文已清理');
  }, []);

  // 监听模型变化，自动清理上下文
  const [previousModel, setPreviousModel] = useState<string>('');
  
  useEffect(() => {
    if (model && previousModel && model !== previousModel && messages.length > 0) {
      clearContext();
    }
    setPreviousModel(model);
  }, [model, messages.length, previousModel, clearContext]);

  // 发送消息处理函数
  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || !openai || sending) return;

    const userMessage: ChatMessage = {
      type: 'text',
      content: inputValue,
      position: 'right',
      id: Date.now().toString(),
    };

    const currentInput = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSending(true);

    // 创建助手消息占位符
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: ChatMessage = {
      type: 'text',
      content: '',
      position: 'left',
      id: assistantMessageId,
      isStreaming: true,
    };
    
    setMessages(prev => [...prev, assistantMessage]);

    try {
      // 构建完整的对话历史
      const conversationHistory = messages.map(msg => ({
        role: msg.position === 'right' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
      
      // 添加当前用户消息
      conversationHistory.push({ role: 'user', content: currentInput });

      const stream = await openai.chat.completions.create({
        model: model,
        messages: conversationHistory,
        stream: true, // 启用流式输出
      });

      let fullContent = '';
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullContent += content;
          
          // 更新消息内容
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: fullContent }
              : msg
          ));
        }
      }
      
      // 流式输出完成，移除流式标记
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, isStreaming: false }
          : msg
      ));
      
    } catch (error) {
      message.error('发送消息失败，请稍后重试');
      console.error('Error:', error);
      
      // 移除失败的助手消息
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
    } finally {
      setSending(false);
    }
  }, [inputValue, openai, sending, model, messages]);

  return {
    messages,
    inputValue,
    setInputValue,
    model,
    setModel,
    models,
    loading,
    sending,
    handleSend,
    clearContext
  };
};