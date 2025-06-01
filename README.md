# WebChatUI

一个现代化的 AI 聊天界面，支持连接各种 AI 服务提供商（如 Ollama、OpenAI 兼容的 API）。

## ✨ 功能特性

### 🎯 核心功能
- **多模型支持**: 支持连接 Ollama 和其他 OpenAI 兼容的 AI 服务
- **实时流式对话**: 支持流式响应，实时显示 AI 回复
- **Markdown 渲染**: 完整支持 Markdown 语法，包括代码高亮、表格、数学公式等
- **响应式设计**: 适配桌面和移动设备
- **上下文管理**: 支持清理对话上下文，切换模型自动清理

### 🎨 界面特性
- **现代化 UI**: 基于 Ant Design 的美观界面
- **深色/浅色主题**: 自适应系统主题
- **消息气泡**: 清晰的对话气泡设计
- **自动滚动**: 新消息自动滚动到底部
- **代码高亮**: 支持多种编程语言的语法高亮
- **表格对齐**: 支持 Markdown 表格的左对齐、居中对齐、右对齐

### 🔧 高级功能
- **配置分享**: 生成分享链接，快速分享 AI 服务配置
- **URL 参数**: 支持通过 URL 参数预设配置
- **API 密钥支持**: 支持需要认证的 AI 服务
- **模型选择**: 动态加载和切换可用模型
- **错误处理**: 友好的错误提示和重试机制

## 🛠️ 技术栈

### 前端框架
- **React 18**: 现代化的前端框架
- **TypeScript**: 类型安全的开发体验
- **Vite**: 快速的构建工具
- **React Router**: 客户端路由管理

### UI 组件
- **Ant Design**: 企业级 UI 设计语言
- **Styled Components**: CSS-in-JS 样式解决方案
- **Ant Design Icons**: 丰富的图标库

### Markdown 支持
- **React Markdown**: Markdown 渲染引擎
- **Remark GFM**: GitHub 风格 Markdown 支持
- **React Syntax Highlighter**: 代码语法高亮

### AI 集成
- **OpenAI SDK**: 统一的 AI API 客户端
- **流式响应**: 支持 Server-Sent Events

## 🚀 快速开始

### 环境要求
- Node.js 16+
- pnpm (推荐) 或 npm

### 安装依赖
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 启动开发服务器
```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev
```

访问 `http://localhost:5173` 即可使用。

### 构建生产版本
```bash
# 使用 pnpm
pnpm build

# 或使用 npm
npm run build
```

## 📖 使用说明

### 1. 配置 AI 服务
在主页填写以下信息：
- **服务器地址**: AI 服务的 API 地址（如 `http://localhost:11434` 用于本地 Ollama）
- **API Key** (可选): 如果服务需要认证
- **默认模型** (可选): 预设的默认模型名称

### 2. 生成分享链接
点击「生成分享链接」按钮，可以创建包含当前配置的分享链接，方便团队协作或保存配置。

### 3. 开始对话
配置完成后点击「开始聊天」，即可进入聊天界面与 AI 进行对话。

### 4. Markdown 支持
支持完整的 Markdown 语法，包括：
- **文本格式**: 粗体、斜体、删除线、行内代码
- **结构化内容**: 标题、列表、引用块
- **代码块**: 支持语法高亮的代码块
- **表格**: 支持对齐的表格
- **链接和图片**: 支持链接和图片显示

## 🔧 配置说明

### URL 参数
支持通过 URL 参数预设配置：
- `base_url`: AI 服务地址
- `api_key`: API 密钥
- `default_model`: 默认模型

示例：
```
http://localhost:5173/?base_url=http://localhost:11434&default_model=llama2
```

### 支持的 AI 服务
- **Ollama**: 本地部署的开源 AI 模型服务
- **OpenAI API**: OpenAI 官方 API
- **其他兼容服务**: 任何兼容 OpenAI API 格式的服务

## 🏗️ 项目结构

```
src/
├── components/          # React 组件
│   ├── ChatContainer.tsx    # 聊天容器组件
│   ├── ChatInput.tsx        # 聊天输入组件
│   ├── ChatInterface.tsx    # 聊天界面主组件
│   ├── LoadingSpinner.tsx   # 加载动画组件
│   ├── MessageItem.tsx      # 消息项组件
│   └── MessageList.tsx      # 消息列表组件
├── hooks/               # 自定义 Hooks
│   └── useChatLogic.ts      # 聊天逻辑 Hook
├── pages/               # 页面组件
│   ├── Chat.tsx             # 聊天页面
│   └── Home.tsx             # 主页
├── types/               # TypeScript 类型定义
│   └── chat.ts              # 聊天相关类型
├── utils/               # 工具函数
│   └── api.ts               # API 相关工具
└── theme/               # 主题配置
    └── themeConfig.ts       # Ant Design 主题配置
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发规范
- 使用 TypeScript 进行类型安全的开发
- 遵循 React Hooks 最佳实践
- 使用 Styled Components 进行样式管理
- 保持代码注释的中文化

### 提交规范
- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 样式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## 📄 许可证

MIT License

## 🔗 相关链接

- [Ollama](https://ollama.ai/) - 本地 AI 模型服务
- [OpenAI API](https://platform.openai.com/) - OpenAI 官方 API
- [Ant Design](https://ant.design/) - 企业级 UI 设计语言
- [React](https://reactjs.org/) - 用户界面库

---

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/deadmau5v/WebChatUI)