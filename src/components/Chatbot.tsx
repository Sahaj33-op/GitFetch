import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Minimize2, Maximize2, Settings, Save } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Provider = 'gemini' | 'openai' | 'anthropic' | 'groq' | 'mistral' | 'openrouter' | 'ollama';

interface ChatConfig {
  provider: Provider;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

const DEFAULT_MODELS: Record<Provider, string> = {
  gemini: 'gemini-3-flash-preview',
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-sonnet-20241022',
  groq: 'llama3-8b-8192',
  mistral: 'mistral-large-latest',
  openrouter: 'google/gemini-2.5-pro',
  ollama: 'llama3.2',
};

const PROVIDER_NAMES: Record<Provider, string> = {
  gemini: 'Google Gemini',
  openai: 'OpenAI',
  anthropic: 'Anthropic Claude',
  groq: 'Groq',
  mistral: 'Mistral AI',
  openrouter: 'OpenRouter',
  ollama: 'Ollama (Local)',
};

const PROVIDER_NOTES: Record<Provider, string> = {
  gemini: 'Leave empty to use the default app key. Requires a Google AI Studio API key otherwise.',
  openai: 'Requires an OpenAI API key. Examples: gpt-4o, gpt-4o-mini',
  anthropic: 'Requires an Anthropic API key. Examples: claude-3-5-sonnet-20241022, claude-3-haiku-20240307',
  groq: 'Requires a Groq API key for fast inference. Examples: llama3-8b-8192, mixtral-8x7b-32768',
  mistral: 'Requires a Mistral API key. Examples: mistral-large-latest, mistral-small-latest',
  openrouter: 'Requires an OpenRouter API key. Examples: google/gemini-2.5-pro, anthropic/claude-3.5-sonnet',
  ollama: 'Ensure Ollama is running locally and CORS is enabled (e.g., OLLAMA_ORIGINS="*").',
};

interface ChatbotProps {
  profileData: any;
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function Chatbot({ profileData }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<ChatConfig>(() => {
    const saved = localStorage.getItem('chatConfig');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return { provider: 'gemini', apiKey: '', model: DEFAULT_MODELS.gemini };
  });

  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hi! I've analyzed this GitHub profile. What would you like to know about their projects, experience, or stats?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('chatConfig', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    if (messagesEndRef.current && !showSettings) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, showSettings]);

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
      if (!isOpen) setIsOpen(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = e.target.value as Provider;
    setConfig(prev => ({
      ...prev,
      provider,
      model: DEFAULT_MODELS[provider],
      baseUrl: provider === 'ollama' ? 'http://localhost:11434' : prev.baseUrl
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const reducedProfileData = {
        user: profileData.user,
        repos: profileData.repos?.map((r: any) => ({
          name: r.name,
          description: r.description,
          language: r.language,
          stars: r.stargazers_count,
          forks: r.forks_count,
          topics: r.topics
        })).slice(0, 50),
        orgs: profileData.orgs?.map((o: any) => o.login),
      };

      const systemPrompt = `You are an AI assistant analyzing a GitHub profile. 
The user has extracted data for a GitHub profile and wants to ask questions about it.

Here is the profile data (in JSON format):
\`\`\`json
${JSON.stringify(reducedProfileData, null, 2)}
\`\`\`

Answer the user's questions accurately based ONLY on this profile data. Be helpful, concise, and encourage best practices. Formulate your response in Markdown formatting.`;

      let responseText = '';

      if (config.provider === 'ollama') {
        const baseUrl = config.baseUrl || 'http://localhost:11434';
        const response = await fetch(`${baseUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: config.model || 'llama3.2',
            messages: [
              { role: 'system', content: systemPrompt },
              ...newMessages.map(m => ({ role: m.role === 'model' ? 'assistant' : m.role, content: m.content }))
            ],
            stream: false
          })
        });
        if (!response.ok) throw new Error('Ollama connection failed.');
        const data = await response.json();
        responseText = data.message.content;
      } else {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages,
            systemPrompt,
            config
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to get response');
        }

        const data = await response.json();
        responseText = data.text;
      }

      setMessages(prev => [...prev, { role: 'model', content: responseText || "Sorry, I couldn't generate a response." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: `**Error:** ${error instanceof Error ? error.message : "Something went wrong"}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen && !isMinimized) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all hover:scale-105 z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 flex items-center justify-center group"
        aria-label="Open AI Assistant"
      >
        <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <div className={`fixed z-50 bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out border border-gray-200
      ${isMinimized 
        ? 'right-0 bottom-0 w-full h-16 md:right-6 md:bottom-6 md:w-[450px] rounded-t-2xl md:rounded-2xl' 
        : 'inset-0 w-full h-[100dvh] md:inset-auto md:right-6 md:bottom-6 md:w-[450px] md:h-[650px] md:max-h-[800px] md:rounded-2xl'
      }`}>
      {/* Header */}
      <div className="bg-gray-900 text-white flex items-center justify-between shrink-0 cursor-pointer" 
           style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))', paddingBottom: '1rem', paddingLeft: '1rem', paddingRight: '1rem' }}
           onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Profile Assistant</h3>
            <p className="text-xs text-gray-400">Powered by {PROVIDER_NAMES[config.provider]}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); if (isMinimized) setIsMinimized(false); }}
            className={`p-1.5 hover:bg-gray-800 rounded-md transition-colors ${showSettings ? 'text-white bg-gray-800' : 'text-gray-300'}`}
          >
            <Settings className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); if (showSettings) setShowSettings(false); }}
            className="p-1.5 hover:bg-gray-800 rounded-md transition-colors text-gray-300"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); setIsMinimized(false); setShowSettings(false); }}
            className="p-1.5 hover:bg-red-500 rounded-md transition-colors text-gray-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && showSettings && (
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col gap-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Chat Settings</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AI Provider</label>
                <select 
                  value={config.provider}
                  onChange={handleProviderChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {Object.entries(PROVIDER_NAMES).map(([key, name]) => (
                    <option key={key} value={key}>{name}</option>
                  ))}
                </select>
              </div>

              {config.provider !== 'ollama' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input 
                    type="password"
                    value={config.apiKey}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${PROVIDER_NAMES[config.provider]} key...`}
                  />
                  <p className="text-xs text-gray-500 mt-1">Stored locally in your browser.</p>
                </div>
              )}

              {config.provider === 'ollama' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ollama Base URL
                  </label>
                  <input 
                    type="text"
                    value={config.baseUrl}
                    onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="http://localhost:11434"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
                <input 
                  type="text"
                  value={config.model}
                  onChange={(e) => setConfig({ ...config, model: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-blue-800">
                <p className="font-medium mb-1">Provider Note</p>
                <p className="text-blue-700">{PROVIDER_NOTES[config.provider]}</p>
              </div>
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-gray-200">
             <button 
               onClick={() => setShowSettings(false)}
               className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex justify-center items-center gap-2 font-medium"
             >
               <Save className="w-4 h-4" /> Save & Close
             </button>
          </div>
        </div>
      )}

      {!isMinimized && !showSettings && (
        <>
          {/* Output Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                )}
                <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed overflow-hidden
                  ${msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-sm' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {msg.role === 'model' ? (
                    <div className="markdown-body text-sm !bg-transparent !p-0">
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </Markdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div className="px-4 py-3 bg-white border border-gray-200 rounded-2xl rounded-bl-sm flex items-center gap-1 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="bg-white border-t border-gray-200 shrink-0"
                style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))', paddingTop: '1rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about this profile..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
