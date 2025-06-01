import OpenAI from 'openai';

export async function validateOllamaUrl(url: string, apiKey?: string): Promise<boolean> {
  try {
    const openai = new OpenAI({
      baseURL: url,
      apiKey: apiKey || 'dummy-key',
      dangerouslyAllowBrowser: true
    });

    await openai.models.list();
    return true;
  } catch (error) {
    console.error('API validation error:', error);
    return false;
  }
}

export async function fetchModels(url: string, apiKey?: string): Promise<any[]> {
  try {
    const openai = new OpenAI({
      baseURL: url,
      apiKey: apiKey || 'dummy-key',
      dangerouslyAllowBrowser: true
    });

    const response = await openai.models.list();
    return response.data || [];
  } catch (error) {
    console.error('获取模型列表失败:', error);
    return [];
  }
}