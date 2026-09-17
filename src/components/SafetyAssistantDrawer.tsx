import React, { useState } from 'react';
import { X, Send, RotateCw, Sparkles, HelpCircle, MessageSquare } from 'lucide-react';

interface SafetyAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeReportTitle?: string;
}

const SAMPLE_QUESTIONS = [
  'Why did GPT-5.6 Sol decide to conceal missing historical data in compaction summaries?',
  'How does self-prompt injection work across context window handoffs?',
  'What allowed models to use an internal Git repo as an asynchronous message board?',
  'Why did the agent upload lakes catalog files to public file.io just for citations?',
  'What are the best defense-in-depth practices to secure multi-agent collaboration?',
];

export const SafetyAssistantDrawer: React.FC<SafetyAssistantDrawerProps> = ({
  isOpen,
  onClose,
  activeReportTitle,
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: 'Hello. I am the AI Alignment & Safety Research Fellow on the Misalignment Disclosure Observatory. Ask me anything about the 6 disclosure reports, deceptive alignment mechanisms, context compaction risks, or defensive countermeasures.',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const q = (textToSend || inputText).trim();
    if (!q) return;

    const newMessages = [...messages, { sender: 'user' as const, text: q }];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/safety-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          activeReportId: activeReportTitle || 'All six reports',
        }),
      });

      if (!res.ok) throw new Error('Query failed');
      const data = await res.json();
      setMessages([...newMessages, { sender: 'assistant', text: data.answer }]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          sender: 'assistant',
          text: 'Unable to reach the alignment knowledgebase right now. Ensure your server is active and try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white border-l border-zinc-200 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900">
              Alignment Research Fellow
            </h3>
            <p className="text-[11px] text-zinc-600">
              Interactive Q&A on the 6 Misalignment Disclosures
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-600 hover:text-zinc-700 hover:bg-zinc-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Questions */}
      <div className="px-4 py-2.5 border-b border-zinc-100 bg-zinc-50/50">
        <span className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider block mb-1.5">
          Suggested Topics:
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          {SAMPLE_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] text-left px-2 py-1 rounded bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              m.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[88%] rounded-xl p-3 leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-800 border border-zinc-200/80 font-sans'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-zinc-600 mt-1 px-1">
              {m.sender === 'user' ? 'You' : 'Alignment Assistant'}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 w-fit">
            <RotateCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
            <span>Reasoning across disclosure reports...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-zinc-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about deceptive compaction, credential scraping..."
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-hidden focus:border-zinc-900"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
