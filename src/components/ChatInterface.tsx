import React from 'react';
import ChatContainer from './ChatContainer';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import LoadingSpinner from './LoadingSpinner';
import { useChatLogic } from '../hooks/useChatLogic';

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
  // 使用自定义 Hook 管理聊天逻辑
  const {
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
  } = useChatLogic(config);

  // 加载状态显示
  if (loading) {
    return <LoadingSpinner />;
  }

  // 渲染聊天界面
  return (
    <ChatContainer>
      <MessageList messages={messages} />
      <ChatInput
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSend={handleSend}
        sending={sending}
        model={model}
        onModelChange={setModel}
        models={models}
        onClearContext={clearContext}
      />
    </ChatContainer>
  );
};

export default ChatInterface;