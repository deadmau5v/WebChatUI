import React from 'react';
import { Input, Select, Button } from 'antd';
import { SendOutlined, ClearOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ModelInfo } from '../types/chat';

// Styled Components
const InputContainer = styled.div`
  padding: 24px;
  border-radius: 0 0 1rem 1rem;
`;

const TopRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
`;

const BottomRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
`;

const ModelSelect = styled(Select)`
  flex: 1;
  
  .ant-select-selector {
    height: 40px !important;
    border-radius: 8px !important;
  }
  
  .ant-select-selection-item {
    line-height: 38px !important;
    font-size: 14px;
  }
`;

const ClearButton = styled(Button)`
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
`;

const StyledInput = styled(Input)`
  flex: 1;
  height: 40px;
  border-radius: 8px;
  font-size: 14px;
`;

const SendButton = styled(Button)`
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:disabled {
    cursor: not-allowed;
  }
`;

// ChatInput 组件属性
interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  sending: boolean;
  model: string;
  onModelChange: (model: string) => void;
  models: ModelInfo[];
  onClearContext: () => void;
}

// ChatInput 组件
const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  onInputChange,
  onSend,
  sending,
  model,
  onModelChange,
  models,
  onClearContext
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !sending && inputValue.trim()) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <InputContainer>
      <TopRow>
        {models.length > 0 && (
          <ModelSelect
            value={model}
            onChange={(value: unknown) => onModelChange(value as string)}
            options={models.map(m => ({ value: m.id, label: m.name }))}
            placeholder="选择模型"
            size="large"
          />
        )}
        <ClearButton
          icon={<ClearOutlined />}
          onClick={onClearContext}
          title="清理上下文"
          size="large"
          style={{ marginLeft: models.length === 0 ? 'auto' : undefined }}
        />
      </TopRow>
      <BottomRow>
        <StyledInput
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="输入消息..."
          onKeyPress={handleKeyPress}
          disabled={sending}
          size="large"
        />
        <SendButton
          icon={<SendOutlined />}
          onClick={onSend}
          disabled={sending || !inputValue.trim()}
          loading={sending}
          size="large"
        />
      </BottomRow>
    </InputContainer>
  );
};

export default ChatInput;