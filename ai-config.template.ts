// ============================================
// 🔑 AI API CONFIGURATION TEMPLATE
// ============================================
// 
// INSTRUCTIONS:
// 1. Copy this file and rename it to: ai-config.ts
// 2. Follow the instructions in AI_SETUP_GUIDE.md
// 3. Add your API key in the ai-config.ts file
// 4. DO NOT commit ai-config.ts to Git (it's in .gitignore)
//
// This template file can be safely committed to Git
// ============================================

export const AI_CONFIG = {
  provider: 'openai',
  apiKey: 'YOUR_API_KEY_HERE', // 👈 GET KEY FROM: https://platform.openai.com/api-keys
  apiUrl: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-3.5-turbo',
  maxTokens: 150,
  temperature: 0.3,
};

export const isAIConfigured = (): boolean => {
  return AI_CONFIG.apiKey !== 'YOUR_API_KEY_HERE' && 
         AI_CONFIG.apiKey !== null && 
         AI_CONFIG.apiKey !== '';
};

export const getProviderName = (): string => {
  switch (AI_CONFIG.provider) {
    case 'openai':
      return 'OpenAI ChatGPT';
    case 'claude':
      return 'Claude (Anthropic)';
    case 'gemini':
      return 'Google Gemini';
    case 'fallback':
      return 'Keyword Matching (No AI)';
    default:
      return 'Unknown';
  }
};
