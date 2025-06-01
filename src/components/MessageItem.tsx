import React from 'react';
import { Avatar, List, Collapse } from 'antd';
import { UserOutlined, RobotOutlined, BulbOutlined } from '@ant-design/icons';
import styled, { keyframes, css } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChatMessage } from '../types/chat';

// Styled Components
const StyledMessageItem = styled(List.Item)<{ $position: 'left' | 'right' }>`
  display: flex;
  justify-content: ${props => props.$position === 'right' ? 'flex-end' : 'flex-start'};
  border-bottom: none !important;
  padding: 0.75rem 0 !important;
  margin-bottom: 0.5rem;
`;

const MessageWrapper = styled.div<{ $position: 'left' | 'right' }>`
  display: flex;
  align-items: flex-start;
  max-width: 70%;
  flex-direction: ${props => props.$position === 'right' ? 'row-reverse' : 'row'};
  margin: 0.5rem 0;
  margin-left: ${props => props.$position === 'right'? 'auto' : '0'};
`;

const MessageAvatar = styled(Avatar)<{ $position: 'left' | 'right' }>`
  margin: ${props => props.$position === 'right' ? '0 0 0 0.5rem' : '0 0.5rem 0 0'};
  background-color: ${props => props.$position === 'right' ? '#10b981' : '#3b82f6'};
  transition: transform 0.2s;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
`;

// 流式输出动画
const streamingAnimation = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

const MessageBubble = styled.div<{ $position: 'left' | 'right'; $isStreaming?: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background-color: ${props => props.$position === 'right' ? '#10b981' : '#ffffff'};
  color: ${props => props.$position === 'right' ? '#ffffff' : '#1f2937'};
  box-shadow: ${props => props.$position === 'left' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(16, 185, 129, 0.2)'};
  border: ${props => props.$position === 'left' ? '1px solid #e5e7eb' : '1px solid rgba(255, 255, 255, 0.2)'};
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.$position === 'left' ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 4px 12px rgba(16, 185, 129, 0.3)'};
  }
  
  /* Markdown样式 */
  .markdown-content {
    margin: 0;
    
    p {
      margin: 0.5rem 0;
      line-height: 1.5;
      
      &:first-child {
        margin-top: 0;
      }
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    h1, h2, h3, h4, h5, h6 {
      margin: 0.8rem 0 0.4rem 0;
      font-weight: 600;
    }
    
    ul, ol {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
    }
    
    li {
      margin: 0.2rem 0;
    }
    
    blockquote {
      margin: 0.5rem 0;
      padding-left: 1rem;
      border-left: 3px solid ${props => props.$position === 'right' ? 'rgba(255,255,255,0.3)' : '#e5e7eb'};
      font-style: italic;
    }
    
    code {
      background-color: ${props => props.$position === 'right' ? 'rgba(255,255,255,0.2)' : '#f3f4f6'};
      color: ${props => props.$position === 'right' ? '#ffffff' : '#1f2937'};
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 0.9em;
    }
    
    pre {
      margin: 0.5rem 0;
      border-radius: 0.5rem;
      overflow: hidden;
      
      code {
        background: none;
        padding: 0;
        color: inherit;
      }
    }
    
    table {
      border-collapse: collapse;
      margin: 0.5rem 0;
      width: 100%;
    }
    
    th, td {
      border: 1px solid ${props => props.$position === 'right' ? 'rgba(255,255,255,0.3)' : '#e5e7eb'};
      padding: 0.5rem;
      text-align: left;
    }
    
    /* 支持Markdown表格对齐语法 */
    th[align="center"], td[align="center"] {
      text-align: center;
    }
    
    th[align="right"], td[align="right"] {
      text-align: right;
    }
    
    th[align="left"], td[align="left"] {
      text-align: left;
    }
    
    th {
      background-color: ${props => props.$position === 'right' ? 'rgba(255,255,255,0.1)' : '#f9fafb'};
      font-weight: 600;
    }
  }
  
  ${props => props.$isStreaming && css`
    &::after {
      content: '●';
      position: absolute;
      right: 0.5rem;
      bottom: 0.2rem;
      color: #10b981;
      animation: ${streamingAnimation} 1.5s infinite;
      font-size: 0.8rem;
    }
  `}
`;

// MessageItem 组件属性
interface MessageItemProps {
  message: ChatMessage;
}

const { Panel } = Collapse;

// 思考内容的样式
const ThinkingPanel = styled(Panel)`
  &.ant-collapse-item {
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;
    border: 1px solid #e5e7eb;
    background-color: #f9fafb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .ant-collapse-header {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: #6b7280 !important;
    padding: 8px 12px !important;
    background-color: #f3f4f6;
  }
  
  .ant-collapse-content {
    border-top: 1px solid #e5e7eb;
    background-color: #f9fafb;
  }
  
  .ant-collapse-content-box {
    padding: 12px !important;
    font-style: italic;
    color: #4b5563;
    white-space: pre-wrap;
    line-height: 1.5;
  }
`;

// 提取思考内容和主要内容
interface ProcessedContent {
  mainContent: string;
  thinkingContent: string[];
}

// 处理消息内容，提取思考内容
// 返回分离的思考内容和主要内容
const processContent = (content: string, isStreaming?: boolean): ProcessedContent => {
  const thinkingContent: string[] = [];
  
  // 检查是否是流式传输中的思考内容
  // 如果正在流式传输，且消息以<think>开头，但没有结束标签
  if (isStreaming && content.trim().startsWith('<think>') && !content.includes('</think>')) {
    // 去除开始的<think>标签
    const streamingThinkContent = content.replace('<think>', '').trim();
    if (streamingThinkContent) {
      thinkingContent.push(streamingThinkContent);
    }
    return { mainContent: '', thinkingContent };
  }
  
  // 正常处理完整的<think>标签
  const mainContent = content.replace(/<think>(.*?)<\/think>/gs, (_, thinkContent) => {
    thinkingContent.push(thinkContent.trim());
    return ''; // 在主要内容中移除<think>标签
  });
  
  return { mainContent, thinkingContent };
};

// 思考内容组件
interface ThinkingContentProps {
  thinkingContent: string[];
  isStreaming: boolean | undefined;
}

const ThinkingContent: React.FC<ThinkingContentProps> = ({ thinkingContent, isStreaming }) => {
  // 如果没有思考内容或内容为空，不渲染任何内容
  if (thinkingContent.length === 0 || thinkingContent.every(content => !content.trim())) return null;
  
  // 如果还在流式传输中，自动展开思考内容
  // 如果传输完成，默认折叠
  const defaultActiveKey = isStreaming ? ['thinking'] : [];
  
  // 识别流式输出状态的处理样式
  const panelStyle = isStreaming ? {
    borderLeft: '3px solid #10b981',
    transition: 'border-color 0.3s ease'
  } : {};
  
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    color: isStreaming ? '#10b981' : '#6b7280'
  };
  
  return (
    <Collapse 
      ghost={false}
      defaultActiveKey={defaultActiveKey}
      style={{ marginBottom: '12px' }}
    >
      <ThinkingPanel 
        style={panelStyle}
        header={
          <div style={headerStyle}>
            <BulbOutlined style={{ 
              marginRight: '8px',
              animation: isStreaming ? 'pulse 2s infinite' : 'none'
            }} />
            {
              isStreaming ? 
              <span>正在思考中...</span> :
              <span>思考过程</span>
            }
          </div>
        } 
        key="thinking"
      >
        {thinkingContent.map((content, index) => (
          <div key={index}>{content}</div>
        ))}
      </ThinkingPanel>
    </Collapse>
  );
};

// MessageItem 组件
const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const position = message.position || 'left';
  const rawContent = message.content || (message.isStreaming ? '正在思考...' : '');
  const { mainContent, thinkingContent } = processContent(rawContent, message.isStreaming);

  return (
    <StyledMessageItem $position={position}>
      <MessageWrapper $position={position}>
        <MessageAvatar
          icon={position === 'right' ? <UserOutlined /> : <RobotOutlined />}
          $position={position}
        />
        <MessageBubble $position={position} $isStreaming={message.isStreaming}>
          <div className="markdown-content">
            {/* 渲染思考内容组件 - 放在主要内容上方 */}
            <ThinkingContent 
              thinkingContent={thinkingContent} 
              isStreaming={message.isStreaming} 
            />
            
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  
                  return !inline && language ? (
                    <SyntaxHighlighter
                      style={oneDark as any}
                      language={language}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        borderRadius: '0.5rem',
                        fontSize: '0.9em'
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {mainContent}
            </ReactMarkdown>
          </div>
        </MessageBubble>
      </MessageWrapper>
    </StyledMessageItem>
  );
};

export default MessageItem;