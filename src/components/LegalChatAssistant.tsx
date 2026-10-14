import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Send, Bot, User, Copy, Check, Sparkles, Scale, RefreshCw } from 'lucide-react';

interface LegalChatAssistantProps {
  language: 'ar' | 'en';
  onShowToast: (message: string) => void;
  onDraftRequest?: (prompt: string) => void;
}

export const LegalChatAssistant: React.FC<LegalChatAssistantProps> = ({
  language,
  onShowToast,
  onDraftRequest,
}) => {
  const isRtl = language === 'ar';
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: isRtl
        ? `مرحباً بك! أنا مستشارك القانوني الذكي المتخصص في القوانين المصرية (القانون المدني رقم 131 لسنة 1948، قانون التجارة رقم 17 لسنة 1999، قانون العمل 12 لسنة 2003، وقواعد محكمة النقض).

تفضل بطرح أي استفسار حول صياغة العقود، شروط الفسخ، التعويضات والشرط الجزائي، أو الأعراف التجارية السائدة في السوق المصري.`
        : `Welcome! I am your AI Legal Consultant specialized in Egyptian Law (Civil Code 131/1948, Commercial Code 17/1999, Labor Law 12/2003, and Court of Cassation precedents).

Feel free to ask any question regarding contract clauses, rescission, liquidated damages, or Egyptian commercial customs.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      proactiveSuggestions: isRtl
        ? [
            'هل يجوز للمؤجر طرد المستأجر فوراً إذا وضع الصيغة التنفيذية؟',
            'ما شروط صحة بند عدم المنافسة في عقد العمل المصري؟',
            'كيف يصاغ الشرط الفاسخ الصريح لسلب القاضي سلطته التقديرية؟'
          ]
        : [
            'Can a landlord evict a tenant immediately using an executive formula?',
            'What are the validity rules for non-compete clauses under Egyptian law?',
            'How to formulate an explicit rescission clause to divest judicial delay?'
          ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat-legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-6),
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get answer');
      }

      const assistantMsg: ChatMessage = {
        id: 'reply-' + Date.now(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        proactiveSuggestions: data.proactiveSuggestions || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: isRtl
          ? 'عذراً، حدث خطأ أثناء معالجة الاستشارة. يرجى إعادة المحاولة.'
          : 'Sorry, an error occurred while processing your legal inquiry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast(isRtl ? 'تم نسخ الإجابة القانونية بنجاح' : 'Legal response copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestedQuestions = [
    isRtl ? 'ما هو الفرق بين العربون ومقدم الثمن وفق المادة 103 مدني؟' : 'What is the legal difference between Earnest Money (Arboun) and Advance Payment?',
    isRtl ? 'هل يسقط حق المؤجر في التعويض إذا لم يوجه إنذاراً رسمياً؟' : 'Does a landlord forfeit damages without formal summons under Article 219?',
    isRtl ? 'كيف تحمي بند التحكيم CRCICA من الدفع بعدم الاختصاص؟' : 'How to formulate a binding CRCICA arbitration clause in Egypt?',
    isRtl ? 'ما هي الحالات التي يجوز فيها تخفيض الشرط الجزائي طبقاً للمادة 224 مدني؟' : 'When can an Egyptian judge reduce liquidated damages under Article 224?'
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col h-[750px]">
      
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{isRtl ? 'المستشار القانوني الذكي (أحكام القانون المصري)' : 'Egyptian Legal AI Consultant'}</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isRtl ? 'مستند إلى القانون المدني 131/1948 وأحكام محكمة النقض' : 'Grounded in Egyptian Civil Code & Cassation Precedents'}
            </p>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          AI Legal Advisor
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? (isRtl ? 'mr-auto flex-row-reverse' : 'ml-auto flex-row-reverse') : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-slate-900 text-white dark:bg-amber-600'
                    : 'bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Content */}
              <div className="space-y-2 flex-1">
                <div
                  className={`p-4 rounded-xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white dark:bg-amber-600 dark:text-white rounded-tr-none'
                      : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none font-legal text-sm'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-700/40 text-[10px] text-slate-400 font-sans">
                    <span className="font-mono tabular-nums">{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopyText(msg.id, msg.content)}
                        className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title={isRtl ? 'نسخ الإجابة' : 'Copy'}
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500 font-medium">{isRtl ? 'تم النسخ' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{isRtl ? 'نسخ' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Smart Proactive Suggestions */}
                {!isUser && msg.proactiveSuggestions && msg.proactiveSuggestions.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{isRtl ? 'إجراءات استباقية مقترحة:' : 'Suggested Proactive Actions:'}</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.proactiveSuggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => {
                            if (sug.includes('صياغة') || sug.includes('draft')) {
                              onDraftRequest?.(sug);
                            }
                            handleSendMessage(sug);
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors text-start cursor-pointer font-sans"
                        >
                          → {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 font-sans">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
              <span>{isRtl ? 'المستشار القانوني يفحص أحكام القانون المصري ومحكمة النقض...' : 'Consulting Egyptian statutes and Cassation precedents...'}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40">
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <span className="text-[10px] text-slate-400 shrink-0 font-medium">
            {isRtl ? 'أسئلة سريعة:' : 'Quick queries:'}
          </span>
          {suggestedQuestions.map((q, qIdx) => (
            <button
              key={qIdx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-500 transition-colors shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRtl ? 'اطرح سؤالك القانوني طبقاً لأحكام القانون المصري...' : 'Ask your legal question under Egyptian law...'}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-xl transition-colors disabled:opacity-50 shrink-0 cursor-pointer shadow-xs"
            aria-label="Send"
          >
            <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          {isRtl ? 'تحليلات قانونية استرشادية مبنية على نصوص التشريعات المصرية وأحكام النقض.' : 'Guidance grounded in Egyptian statutory provisions and Supreme Court of Cassation precedents.'}
        </p>
      </div>

    </div>
  );
};
