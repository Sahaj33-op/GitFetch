import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages, systemPrompt, config } = req.body;
    const { provider, apiKey, model } = config;

    let responseText = '';

    if (provider === 'gemini') {
      const key = apiKey || process.env.GEMINI_API_KEY;
      if (!key) throw new Error('API key is required for Gemini');
      
      const ai = new GoogleGenAI({ apiKey: key });
      
      const history = messages.slice(0, -1).map((m: any) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));
      const latestMessage = messages[messages.length - 1].content;

      const response = await ai.models.generateContent({
        model: model || "gemini-3-flash-preview",
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

      const formattedMessages = messages.map((m: any) => ({
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
      
      const formattedMessages = messages.map((m: any) => ({
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

    res.json({ text: responseText });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "An error occurred" });
  }
}
