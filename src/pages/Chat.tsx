import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';

const Chat: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const ollamaUrl = searchParams.get('base_url') || 'http://localhost:11434';
  const apiKey = searchParams.get('api_key');
  const defaultModel = searchParams.get('default_model');

  return (
    <ChatInterface
      config={{
        ollamaUrl: decodeURIComponent(ollamaUrl),
        apiKey: apiKey || undefined,
        defaultModel: defaultModel || undefined
      }}
      updateUrlParams={(validUrl) => {
        if (validUrl && validUrl !== ollamaUrl) {
          setSearchParams(params => {
            params.set('base_url', validUrl);
            return params;
          });
        }
      }}
    />
  );
};

export default Chat;