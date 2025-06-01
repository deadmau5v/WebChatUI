import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ChatWrapper = styled.div`
  width: 100%;
  max-width: 56rem;
  margin: 0 auto;
`;

const ChatCard = styled(Card)`
  width: 100%;
  height: 85vh;
  max-height: 700px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  border: 1px solid #e8e8e8;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
  
  .ant-card-body {
    padding: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`;

// ChatContainer 组件属性
interface ChatContainerProps {
  children: React.ReactNode;
}

// ChatContainer 组件
const ChatContainer: React.FC<ChatContainerProps> = ({ children }) => {
  return (
    <Container>
      <ChatWrapper>
        <ChatCard>
          {children}
        </ChatCard>
      </ChatWrapper>
    </Container>
  );
};

export default ChatContainer;