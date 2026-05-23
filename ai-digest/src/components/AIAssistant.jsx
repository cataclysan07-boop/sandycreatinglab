import { useState, useRef, useEffect } from 'react';

const SUGGESTED = [
  '今日哪条最值得我立即行动？',
  'Shopify模式适合我们公司吗？',
  '如何评估团队的AI校准信任度？',
  '怎么向董事会汇报AI ROI分化趋势？',
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '你好，我是今日日报的AI助手。\n我已阅读今天全部10条要情，可以帮你深度解读、分析对你业务的影响，或给出行动建议。\n\n有什么想聊的？',
      }]);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = async (text) => {
    const userText = text ?? input.trim();
    if (!userText || streaming) return;

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    setStreaming(true);

    const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const { text, error } = JSON.parse(data);
            if (error) throw new Error(error);
            if (text) {
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: updated[updated.length - 1].content + text,
                };
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: '抱歉，连接出现问题，请稍后重试。' };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 cursor-pointer"
        style={{
          background: open ? 'rgba(99,102,241,0.9)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
        }}>
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
            <path d="M4 4l12 12M16 4L4 16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
              fill="white" opacity="0"/>
            <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H6l-2 2V4h16v10z"
              fill="white"/>
          </svg>
        )}
        {/* Unread dot */}
        {!open && messages.length === 0 && (
          <span className="absolute top-1 right-1 w-3 h-3 rounded-full border-2"
            style={{ background: '#10b981', borderColor: '#0a0a0f' }} />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: '360px',
            height: '520px',
            background: '#111118',
            border: '1px solid rgba(99,102,241,0.25)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
          }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ background: 'rgba(99,102,241,0.1)', borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              AI
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold leading-none">日报AI助手</div>
              <div className="text-white/40 text-xs mt-0.5">已读今日全部10条要情</div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
              <span className="text-xs" style={{ color: '#10b981' }}>在线</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: 'none' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="rounded-2xl px-3.5 py-2.5 max-w-[85%]"
                  style={{
                    background: msg.role === 'user'
                      ? 'rgba(99,102,241,0.25)'
                      : 'rgba(255,255,255,0.05)',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    color: msg.role === 'user' ? '#c7d2fe' : 'rgba(255,255,255,0.85)',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                  {msg.content}
                  {msg.role === 'assistant' && streaming && i === messages.length - 1 && msg.content === '' && (
                    <span className="inline-flex gap-1 items-center">
                      {[0, 1, 2].map(d => (
                        <span key={d} className="w-1 h-1 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.4)', animation: `pulse 1.2s ${d * 0.2}s infinite` }} />
                      ))}
                    </span>
                  )}
                  {msg.role === 'assistant' && streaming && i === messages.length - 1 && msg.content !== '' && (
                    <span className="inline-block w-0.5 h-3.5 ml-0.5 rounded-full"
                      style={{ background: '#818cf8', animation: 'pulse 1s infinite', verticalAlign: 'text-bottom' }} />
                  )}
                </div>
              </div>
            ))}

            {/* Suggestions (show after first assistant message, before user has sent anything) */}
            {messages.length === 1 && !streaming && (
              <div className="space-y-1.5 pt-1">
                {SUGGESTED.map(s => (
                  <button key={s}
                    onClick={() => send(s)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer"
                    style={{
                      background: 'rgba(99,102,241,0.08)',
                      color: 'rgba(255,255,255,0.5)',
                      border: '1px solid rgba(99,102,241,0.15)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
                      e.currentTarget.style.color = '#a5b4fc';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="问任何关于今日要情的问题…"
                rows={1}
                className="flex-1 resize-none rounded-xl px-3 py-2.5 text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  maxHeight: '96px',
                  scrollbarWidth: 'none',
                }}
                onInput={e => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                }}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || streaming}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all cursor-pointer"
                style={{
                  background: input.trim() && !streaming ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.06)',
                  opacity: input.trim() && !streaming ? 1 : 0.4,
                }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}
