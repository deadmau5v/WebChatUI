import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';

const Chat: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ollamaUrl = searchParams.get('url') || 'http://localhost:11434';
  const apiKey = searchParams.get('api_key');
  const defaultModel = searchParams.get('default_model');

  return (
    <ChatInterface
      config={{
        ollamaUrl: decodeURIComponent(ollamaUrl),
        apiKey: apiKey || undefined,
        defaultModel: defaultModel || undefined
      }}
    />
  );
};

export default Chat;