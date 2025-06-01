// 定义聊天消息类型
export interface ChatMessage {
  type: 'text';
  content: string;
  position?: 'left' | 'right';
  user?: {
    avatar?: string;
    name?: string;
  };
}

// Ollama API 响应类型
export interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

// 聊天配置类型
export interface ChatConfig {
  ollamaUrl: string;
  apiKey?: string;
  defaultModel?: string;
}

// 模型信息类型
export interface ModelInfo {
  id: string;
  name: string;
  created: number;
  modified: number;
  size: number;
  digest: string;
}

// API 错误类型
export interface ApiError {
  message: string;
  code?: string;
}