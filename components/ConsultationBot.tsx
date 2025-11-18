
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Sparkles, Loader2, Calendar, ArrowRight } from 'lucide-react';
import { Message } from '../types';
import { streamChatResponse } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';

const StarterQuestion = ({ text, onClick }: { text: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="text-left p-3 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm hover:border-brand-400 hover:text-brand-600 hover:shadow-sm transition-all"
  >
    {text}
  </button>
);

export const ConsultationBot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hello! I'm your AI consultant for Start-up Nation 2025 and Digitalizare IMM. I can help you check eligibility, calculate budgets, or understand eligible expenses. What would you like to know?",
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Create placeholder for AI response
    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMessageId,
      role: 'model',
      content: '',
      timestamp: Date.now(),
      isTyping: true
    }]);

    try {
      await streamChatResponse(
        [...messages, userMessage],
        text,
        (streamedText) => {
          setMessages(prev => prev.map(msg =>
            msg.id === aiMessageId
              ? { ...msg, content: streamedText, isTyping: false }
              : msg
          ));
        },
        user?.id
      );
    } catch (error) {
      setMessages(prev => prev.map(msg =>
        msg.id === aiMessageId
          ? { ...msg, content: "I apologize, but I'm having trouble connecting to the Start-up Nation database right now. Please try again in a moment.", isTyping: false }
          : msg
      ));
    } finally {
      setIsLoading(false);
      // Trigger CTA after 3 questions
      if (newCount === 3) {
        setTimeout(() => {
          const ctaMessage: Message = {
            id: 'cta-' + Date.now(),
            role: 'model',
            content: "You've asked some great questions! Getting the details right for your Start-up Nation application is critical for approval.\n\nWould you like a human expert to double-check your eligibility and help you build a winning strategy?",
            timestamp: Date.now(),
            isCTA: true
          };
          setMessages(prev => [...prev, ctaMessage]);
        }, 800);
      }
    }
  };

  const openBookingLink = () => {
    window.open('https://calendly.com', '_blank');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Start-up Consultant AI</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-xs text-slate-500">Online & Ready</p>
            </div>
          </div>
        </div>
        <button
          onClick={openBookingLink}
          className="hidden md:block px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
        >
          Book Free 15min Call
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/30">
        {messages.map((msg) => {
          if (msg.isCTA) {
            return (
              <div key={msg.id} className="flex gap-4 animate-fade-in my-6">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-brand-100 text-brand-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="max-w-[85%] md:max-w-[75%]">
                  <div className="bg-white border border-brand-200 rounded-xl p-5 shadow-md shadow-brand-100/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 rounded-full -mr-8 -mt-8 opacity-50" />
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Free Expert Consultation</h3>
                      <p className="text-slate-600 mb-4 text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <button
                        onClick={openBookingLink}
                        className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-2.5 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm group"
                      >
                        Book Free 15-min Call
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 px-1 mt-1 block">
                    Recommended Step
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user'
                  ? 'bg-slate-200 text-slate-600'
                  : 'bg-brand-100 text-brand-600'
                }`}>
                {msg.role === 'user' ? <UserIcon className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>

              <div className={`max-w-[80%] space-y-1`}>
                <div className={`p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                  }`}>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed">
                    {msg.content || (msg.isTyping && <span className="animate-pulse">Thinking...</span>)}
                  </div>
                </div>
                <span className="text-xs text-slate-400 px-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Starter Questions (only show if few messages) */}
        {messages.length < 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 ml-12 max-w-2xl">
            <StarterQuestion text="Am I eligible if I have an SRL from 2021?" onClick={() => handleSend("Am I eligible if I have an SRL from 2021?")} />
            <StarterQuestion text="What budget can I get for IT equipment?" onClick={() => handleSend("What budget can I get for IT equipment?")} />
            <StarterQuestion text="How much own contribution (co-financing) is needed?" onClick={() => handleSend("How much own contribution is needed?")} />
            <StarterQuestion text="Can I buy an electric car with the grant?" onClick={() => handleSend("Can I buy an electric car with the grant?")} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Ask about Start-up Nation 2025..."
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm placeholder:text-slate-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-2 p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-3">
          AI can make mistakes. Always verify official information at startup-nation.ro.
        </p>
      </div>
    </div>
  );
};
