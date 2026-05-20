import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

export interface ReducedProfileData {
  user: any;
  repos?: {
    name: string;
    description: string | null;
    language: string | null;
    stars: number;
    forks: number;
    topics?: string[];
  }[];
  orgs?: string[];
}

export const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).min(1, "At least one message is required"),
  profileData: z.any().optional(),
  config: z.object({
    provider: z.enum(['gemini', 'openai', 'anthropic', 'groq', 'mistral', 'openrouter']),
    apiKey: z.string().optional(),
    model: z.string().optional(),
    baseUrl: z.string().optional(),
  }),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

const buildSystemPrompt = (profileData: ReducedProfileData) => {
  return `You are an AI assistant analyzing a GitHub profile. 
The user has extracted data for a GitHub profile and wants to ask questions about it.

Here is the profile data (in JSON format):
\`\`\`json
${JSON.stringify(profileData, null, 2)}
\`\`\`

Answer the user's questions accurately based ONLY on this profile data. Be helpful, concise, and encourage best practices. Formulate your response in Markdown formatting.`;
};

export async function processChatRequest(reqBody: unknown) {
  const parsed = ChatRequestSchema.safeParse(reqBody);
  if (!parsed.success) {
    throw new Error(`Invalid request body: ${parsed.error.message}`);
  }

  const { messages, profileData, config } = parsed.data;
  const { provider, apiKey, model } = config;

  const systemPrompt = profileData ? buildSystemPrompt(profileData as ReducedProfileData) : 'You are a helpful AI assistant. Formulate your response in Markdown formatting.';
  let responseText = '';

  if (provider === 'gemini') {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) throw new Error('API key is required for Gemini');
    
    const ai = new GoogleGenAI({ apiKey: key });
    
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));
    const latestMessage = messages[messages.length - 1].content;

    const response = await ai.models.generateContent({
      model: model || "gemini-2.5-flash",
      contents: [
        ...history,
        { role: "user", parts: [{ text: latestMessage }] }
      ],
      config: {
        systemInstruction: systemPrompt,
      }
    });
    responseText = response.text || '';

  } else if (['openai', 'groq', 'mistral', 'openrouter'].includes(provider)) {
    if (!apiKey) throw new Error(`API key is required for ${provider}`);
    
    let endpoint = '';
    if (provider === 'openai') endpoint = 'https://api.openai.com/v1/chat/completions';
    if (provider === 'groq') endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    if (provider === 'mistral') endpoint = 'https://api.mistral.ai/v1/chat/completions';
    if (provider === 'openrouter') endpoint = 'https://openrouter.ai/api/v1/chat/completions';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    if (provider === 'openrouter') {
       headers['HTTP-Referer'] = 'https://gitfetch-sahaj33.vercel.app';
       headers['X-Title'] = 'GitHub Profile Extractor';
    }

    const formattedMessages = messages.map((m) => ({
      role: m.role === 'model' ? 'assistant' : m.role,
      content: m.content
    }));

    const body = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...formattedMessages
      ]
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API error: ${response.status} ${err}`);
    }

    const data = await response.json();
    responseText = data.choices?.[0]?.message?.content || '';

  } else if (provider === 'anthropic') {
    if (!apiKey) throw new Error('API key is required for Anthropic');
    
    const formattedMessages = messages.map((m) => ({
      role: m.role === 'model' ? 'assistant' : m.role,
      content: m.content
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-sonnet-20241022',
        system: systemPrompt,
        messages: formattedMessages,
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API error: ${response.status} ${err}`);
    }

    const data = await response.json();
    responseText = data.content?.[0]?.text || '';
  } else {
    throw new Error(`Unsupported provider: ${provider}`);
  }

  return responseText;
}
