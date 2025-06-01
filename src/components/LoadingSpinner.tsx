import React from 'react';
import { Spin } from 'antd';
import styled from 'styled-components';

// Styled Components
const LoadingContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
`;

// LoadingSpinner 组件
const LoadingSpinner: React.FC = () => {
  return (
    <LoadingContainer>
      <Spin size="large" />
    </LoadingContainer>
  );
};

export default LoadingSpinner;