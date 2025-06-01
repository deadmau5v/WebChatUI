import React, { useRef, useEffect } from 'react';
import { List, Empty } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ChatMessage } from '../types/chat';
import MessageItem from './MessageItem';

// Styled Components
const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1.5rem 1rem;
  min-height: 0;
  max-height: calc(85vh - 120px);
  
  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    transition: background 0.3s ease;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  
  /* 滚动行为 */
  scroll-behavior: smooth;
`;

// MessageList 组件属性
interface MessageListProps {
  messages: ChatMessage[];
}

// MessageList 组件
const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 当消息更新时自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <MessagesContainer ref={containerRef}>
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
        renderItem={(message, index) => (
          <MessageItem key={message.id || `message-${index}`} message={message} />
        )}
      />
      {/* 用于自动滚动的锚点 */}
      <div ref={messagesEndRef} />
    </MessagesContainer>
  );
};

export default MessageList;