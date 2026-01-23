import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertCircle, Bot, Database, Eye, EyeOff } from 'lucide-react';
import { GraphRAGClient } from '../utils/graphRAG';
import { GeminiClient } from '../utils/geminiClient';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  status: 'typing' | 'sending' | 'delivered' | 'failed';
  knowledgeGraph?: {
    relevantNodes: Array<{
      name: string;
      label: string;
      format: string;
      type: string;
      similarity: number;
      relationships: Array<{
        type: string;
        target: string;
      }>;
    }>;
  };
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assistantName, setAssistantName] = useState('Gemini Assistant');
  const [showKnowledgeGraph, setShowKnowledgeGraph] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const assistantClient = useRef<GeminiClient | null>(null);
  const graphRAGClient = useRef<GraphRAGClient | null>(null);

  useEffect(() => {
    const initializeClients = async () => {
      try {
        // API Key is now managed server-side via Netlify Functions

        assistantClient.current = new GeminiClient('');
        const assistant = await assistantClient.current.initialize();
        setAssistantName(assistant.name || 'Gemini Assistant');
        await assistantClient.current.createThread();

        graphRAGClient.current = new GraphRAGClient('');
        await graphRAGClient.current.ensureInitialized();
        setIsConnected(true);

      } catch (err) {
        console.error('Failed to initialize clients:', err);
        setError('Failed to initialize chat. Check server connection.');
        setIsConnected(false);
      }
    };

    initializeClients();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // cancelRequest removed


  const regenerateResponse = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    const userMessage = messages[messageIndex - 1];
    if (!userMessage || userMessage.isBot) return;

    setMessages(prev => prev.slice(0, messageIndex));

    const newInput = userMessage.content;
    setInput(newInput);
    await handleSubmit(new Event('submit') as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !assistantClient.current || !graphRAGClient.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isBot: false,
      timestamp: new Date(),
      status: 'sending'
    };

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      isBot: true,
      timestamp: new Date(),
      status: 'typing'
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === userMessage.id
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );

      // Only query Knowledge Graph if the toggle is ON
      const knowledgeGraphPromise = showKnowledgeGraph
        ? graphRAGClient.current.queryKnowledgeGraph(input.trim())
        : Promise.resolve(null);

      for await (const chunk of assistantClient.current.streamMessage(
        input.trim(),
        abortControllerRef.current.signal
      )) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessage.id
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      }

      const kgResult = await knowledgeGraphPromise;

      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMessage.id
            ? {
              ...msg,
              status: 'delivered',
              knowledgeGraph: kgResult?.relevantNodes ? { relevantNodes: kgResult.relevantNodes } : undefined
            }
            : msg
        )
      );
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);

      if (err instanceof Error && err.message === 'Request cancelled') {
        setMessages(prev => prev.filter(msg => msg.id !== botMessage.id));
      } else {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessage.id
              ? { ...msg, status: 'failed', content: 'Failed to generate response' }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const renderKnowledgeGraph = (message: Message) => {
    if (!message.knowledgeGraph || !showKnowledgeGraph) return null;

    return (
      <div className="mt-4 border-t pt-4">
        <div className="flex items-center gap-2 text-slate-500 mb-2">
          <Database className="w-4 h-4" />
          <span className="text-xs font-mono uppercase tracking-wider">Knowledge Graph Context</span>
        </div>
        <div className="space-y-3">
          {message.knowledgeGraph.relevantNodes.map((node, index) => (
            <div key={index} className="bg-slate-50 border border-slate-200 p-3 rounded-none">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-slate-700 font-mono text-xs">{node.label}</span>
                <span className="text-xs text-slate-400 font-mono">
                  {(node.similarity * 100).toFixed(0)}% Match
                </span>
              </div>
              <div className="text-xs text-slate-600 font-mono space-y-1">
                <div>FMT: {node.format}</div>
                <div>TYPE: {node.type}</div>
              </div>
              {node.relationships.length > 0 && (
                <div className="mt-2 border-t border-slate-100 pt-2">
                  <div className="flex flex-wrap gap-2">
                    {node.relationships.map((rel, relIndex) => (
                      <span
                        key={relIndex}
                        className="text-[10px] bg-sage-50 text-sage-700 px-2 py-1 rounded-none border border-sage-100 uppercase tracking-wide"
                      >
                        {rel.type} → {rel.target}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Removed early error return to keep Control Bar visible


  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50/30">
      {/* Control Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-sage-50 p-1.5">
            <Bot className="w-4 h-4 text-sage-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs uppercase tracking-widest text-slate-700">{assistantName}</span>
            <span className="text-[10px] text-slate-400 font-mono">v2.0.0 Academic Edition</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setShowKnowledgeGraph(!showKnowledgeGraph)}
            className={`flex items-center gap-2 text-xs font-mono transition-colors ${showKnowledgeGraph ? 'text-sage-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            title={showKnowledgeGraph ? "Hide Knowledge Graph" : "Show Knowledge Graph"}
          >
            {showKnowledgeGraph ? (
              <Eye className="w-3.5 h-3.5" />
            ) : (
              <EyeOff className="w-3.5 h-3.5" />
            )}
            <span className="uppercase tracking-wide">Graph Context</span>
          </button>
          <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className={`text-[10px] uppercase tracking-widest font-bold ${isConnected ? 'text-slate-600' : 'text-slate-400'}`}>
              {isConnected ? 'Connected' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-6 py-8 min-h-0">
        {error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center bg-white p-12 border border-red-100 shadow-sm rounded-none">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">Connection Error</h3>
              <p className="text-slate-500 font-mono text-xs mb-6 max-w-md">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-xs bg-slate-800 text-white px-4 py-2 hover:bg-slate-700 transition-colors uppercase tracking-wider font-bold"
              >
                Reload Application
              </button>
            </div>
          </div>
        ) : (
          /* Messages Area */
          <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-60">
                <div className="border border-slate-200 p-6 bg-white">
                  <Bot className="w-8 h-8 text-sage-600 mb-4 mx-auto" />
                  <h3 className="text-lg font-light text-slate-900 mb-2">Research Assistant Active</h3>
                  <p className="font-mono text-xs text-slate-500">System Ready for Inquiry</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                  {[
                    "What are the admission rates for Ivy League schools?",
                    "Compare the cost of attendance between public vs private universities.",
                    "Which schools offer the best financial aid?",
                    "How does student debt vary by region?"
                  ].map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="text-left p-4 text-xs font-mono text-slate-600 bg-white border border-slate-200 hover:border-sage-600 hover:bg-slate-50 transition-colors rounded-none"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.isBot ? 'items-start' : 'items-end'}`}
              >
                <div className={`max-w-[85%] relative group ${message.isBot ? '' : ''}`}>
                  {/* Label */}
                  <div className={`mb-2 text-[10px] uppercase tracking-wider font-bold ${message.isBot ? 'text-sage-600' : 'text-slate-400 text-right'
                    }`}>
                    {message.isBot ? 'Gemini Assistant' : 'Researcher'}
                  </div>

                  {/* Card */}
                  <div className={`p-6 shadow-sm rounded-none ${message.isBot
                    ? 'bg-white border-l-4 border-sage-600 text-slate-800'
                    : 'bg-slate-50 border-l-4 border-slate-900 text-slate-800'
                    }`}>
                    <div className="prose prose-sm prose-slate max-w-none font-light leading-relaxed whitespace-pre-wrap">
                      {message.content}
                      {message.status === 'typing' && (
                        <span className="inline-block w-2 h-2 bg-sage-600 animate-pulse ml-1" />
                      )}
                    </div>

                    {message.status === 'failed' && (
                      <div className="mt-4 pt-4 border-t border-red-100 flex items-center gap-2">
                        <span className="text-xs text-red-500 font-mono uppercase">Emission Failed</span>
                        <button
                          onClick={() => regenerateResponse(message.id)}
                          className="text-xs text-sage-600 underline hover:text-sage-800"
                        >
                          Retry
                        </button>
                      </div>
                    )}

                    {message.isBot && renderKnowledgeGraph(message)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <form onSubmit={handleSubmit} className="relative group max-w-4xl mx-auto">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about debt, region, or graduation rates..."
              className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-slate-200 focus:border-sage-600 focus:ring-0 text-2xl font-light py-4 placeholder-slate-300 transition-all resize-none font-sans text-slate-800 rounded-none"
              rows={1}
              disabled={isLoading}
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4">
              {isLoading ? (
                <Loader2 className="w-6 h-6 text-sage-600 animate-spin" />
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-slate-900 text-white p-3 hover:bg-slate-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
                >
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}