import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  Bot,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Info
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import api from '../services/api';

export default function StudentAiPage() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am StudentAI, your intelligent academic co-pilot. I analyze institutional databases, attendance telemetries, continuous assessment marks, and risk benchmarks in real-time.",
      suggestedQueries: [
        'Which students have attendance below 75%?',
        'Which students are at risk?',
        'Show students whose marks declined.',
        'Which assignments are due this week?'
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryToSend) => {
    const query = (queryToSend || inputQuery).trim();
    if (!query) return;

    // Add user message
    const userMsgId = 'usr_' + Date.now();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: query }]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.post('/ai/query', { query });
      if (res.data.success) {
        const aiMsgId = 'ai_' + Date.now();
        setMessages(prev => [
          ...prev,
          {
            id: aiMsgId,
            sender: 'ai',
            text: res.data.summary,
            title: res.data.title,
            data: res.data.data,
            recommendation: res.data.recommendation,
            suggestedQueries: res.data.suggestedQueries,
            source: res.data.source
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'ai',
          text: 'I encountered an issue querying the academic database. Please try again or rephrase your request.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto w-full">
      {/* Top Banner with Architecture Transparency Note */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-royal-950/40 border border-royal-600/20 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-royal-400 shrink-0" />
          <span className="text-slate-300 font-medium">
            <strong>StudentAI Intelligence:</strong> Operating via structured multi-factor analytical engine connected to <code className="text-royal-300">db.json</code>.
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-royal-400" />
          <span>LLM API pluggable via server <code className="text-royal-300">.env</code></span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <GlassCard className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-royal-600/25 border border-royal-500/40 flex items-center justify-center text-royal-300 shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-royal-600 to-royal-800 text-white shadow-md shadow-royal-950/40'
                  : 'bg-white/[0.03] border border-white/5 text-slate-200'
              }`}
            >
              {msg.title && (
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                  <h4 className="font-bold text-white text-sm">{msg.title}</h4>
                  {msg.source && <span className="text-[10px] text-royal-400 font-mono">{msg.source}</span>}
                </div>
              )}

              <p className="whitespace-pre-line">{msg.text}</p>

              {/* Data Table / Cards if returned */}
              {msg.data && Array.isArray(msg.data) && msg.data.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
                  {msg.data.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-semibold text-white">{item.name || item.title || item.day}</span>
                        {item.registerNumber && <span className="text-slate-400 ml-2 font-mono">{item.registerNumber}</span>}
                        {item.department && <p className="text-[11px] text-slate-500">{item.department}</p>}
                        {item.subject && <p className="text-[11px] text-slate-400">{item.subject}</p>}
                      </div>

                      <div className="text-right shrink-0">
                        {item.attendance && <span className="text-rose-400 font-semibold">{item.attendance}</span>}
                        {item.riskScore && <span className="text-amber-400 font-mono font-bold">{item.riskScore}</span>}
                        {item.status && <StatusBadge type="risk" value={item.status} size="small" />}
                        {item.deadline && <span className="text-royal-300 font-mono text-[11px]">{item.deadline}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendation Callout */}
              {msg.recommendation && (
                <div className="mt-3.5 p-3 rounded-xl bg-royal-950/50 border border-royal-600/30 text-royal-200 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-royal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block mb-0.5">Automated Intelligence Recommendation</span>
                    <p className="text-[11px] text-slate-300">{msg.recommendation}</p>
                  </div>
                </div>
              )}

              {/* Follow-up suggestions */}
              {msg.suggestedQueries && msg.suggestedQueries.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/5">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-2">Suggested Inquiries:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedQueries.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="px-2.5 py-1 rounded-lg bg-royal-600/15 hover:bg-royal-600/30 border border-royal-500/20 text-royal-300 text-[11px] font-medium transition-colors text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-royal-600/25 border border-royal-500/40 flex items-center justify-center text-royal-300 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-2 text-xs text-slate-400">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-royal-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-royal-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-royal-400 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="ml-1">Analyzing database records...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </GlassCard>

      {/* Input Bar */}
      <div className="mt-4 relative">
        <textarea
          rows="2"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask StudentAI about attendance below 75%, at-risk students, marks decline..."
          className="glass-input w-full rounded-2xl pl-4 pr-14 py-3 text-xs text-white resize-none shadow-xl focus:ring-1 focus:ring-royal-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || loading}
          className="btn-primary absolute right-3 bottom-3 p-2 rounded-xl text-white disabled:opacity-40 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

