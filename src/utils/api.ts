import OpenAI from 'openai';

export async function validateOllamaUrl(url: string, apiKey?: string): Promise<{ isValid: boolean; validUrl?: string }> {
  // 首先尝试原始URL
  try {
    const openai = new OpenAI({
      baseURL: url,
      apiKey: apiKey || 'dummy-key',
      dangerouslyAllowBrowser: true
    });

    await openai.models.list();
    return { isValid: true, validUrl: url };
  } catch (error) {
    console.error('原始URL验证失败:', error);
    
    // 如果原始URL失败且不包含/v1，尝试添加/v1后缀
    if (!url.endsWith('/v1') && !url.endsWith('/v1/')) {
      try {
        const urlWithV1 = url.endsWith('/') ? url + 'v1' : url + '/v1';
        console.log('尝试添加/v1后缀:', urlWithV1);
        
        const openaiWithV1 = new OpenAI({
          baseURL: urlWithV1,
          apiKey: apiKey || 'dummy-key',
          dangerouslyAllowBrowser: true
        });

        await openaiWithV1.models.list();
        console.log('添加/v1后缀验证成功');
        return { isValid: true, validUrl: urlWithV1 };
      } catch (v1Error) {
        console.error('添加/v1后缀也验证失败:', v1Error);
      }
    }
    
    return { isValid: false };
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