import React from 'react';
import { Send, Bot, User, Sparkles, Zap, Code2, Wand2, Copy, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';
import ReactMarkdown from 'react-markdown';

export const AIChat = () => {
    const { chatMessages, sendChatMessage, isUpdating } = useAppStore();
    const [input, setInput] = React.useState('');
    const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatMessages, isUpdating]);

    const handleSend = () => {
        if (!input.trim() || isUpdating) return;
        sendChatMessage(input);
        setInput('');
    };

    const handleCopy = (content: string, index: number) => {
        navigator.clipboard.writeText(content);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const quickActions = [
        { label: 'Make it shorter', icon: Zap },
        { label: 'Add emojis', icon: Sparkles },
        { label: 'More professional', icon: Code2 },
    ];

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-[#f8f9fb] to-[#ffffff]">
            {/* Modern Header - Minimalist & Premium */}
            <div className="px-6 py-4 border-b border-gray-100/80 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-linkedin-400 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm text-linkedin-600">
                            <Wand2 className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold font-display text-gray-800">AI Companion</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex w-2 h-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-medium text-gray-500">Online & Ready</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div
                ref={scrollRef}
                className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar"
            >
                {/* Welcome State */}
                {chatMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500/20 to-linkedin-500/20 rounded-full blur-xl animate-pulse-slow" />
                            <div className="relative p-6 bg-white rounded-3xl shadow-float border border-white/50">
                                <Bot className="w-12 h-12 text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-linkedin-600" style={{ stroke: "url(#gradient)" }} />
                                {/* Define gradient for SVG stroke if strictly needed, or just use class text colors. Keeping it simple via class for now. */}
                                <Bot className="w-12 h-12 text-linkedin-600" />
                            </div>
                        </div>
                        <div className="space-y-2 max-w-xs mx-auto">
                            <h2 className="text-lg font-bold text-gray-800">How can I help you today?</h2>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                I can help you refine your posts, fix grammar, generate hashtags, or change the tone.
                            </p>
                        </div>
                    </div>
                )}

                {/* Messages */}
                {chatMessages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "group flex gap-4 text-sm animate-in slide-in-from-bottom-2 duration-300",
                            msg.role === 'user' ? "flex-row-reverse" : ""
                        )}
                    >
                        {/* Avatar */}
                        <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-black/5 mt-1",
                            msg.role === 'user'
                                ? "bg-white text-linkedin-600"
                                : "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
                        )}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>

                        {/* Content */}
                        <div className={cn(
                            "relative max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm text-sm leading-relaxed",
                            msg.role === 'user'
                                ? "bg-linkedin-600 text-white rounded-tr-sm"
                                : "bg-white border border-gray-100 text-gray-700 rounded-tl-sm"
                        )}>
                            {msg.role === 'assistant' ? (
                                <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 text-gray-700">
                                    <ReactMarkdown
                                        components={{
                                            code({ node, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '')
                                                return match ? (
                                                    <div className="relative my-2 rounded-lg overflow-hidden bg-gray-900 text-gray-100 p-3 text-xs font-mono">
                                                        {children}
                                                    </div>
                                                ) : (
                                                    <code className="bg-gray-100 px-1 py-0.5 rounded text-pink-500 font-mono text-xs" {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            }
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                            )}

                            {/* Copy Button for Assistant */}
                            {msg.role === 'assistant' && (
                                <button
                                    onClick={() => handleCopy(msg.content, idx)}
                                    className="absolute -bottom-6 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-linkedin-600"
                                >
                                    {copiedIndex === idx ? (
                                        <>
                                            <Check className="w-3 h-3" /> Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3 h-3" /> Copy
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Loading State */}
                {isUpdating && (
                    <div className="flex gap-4 max-w-[90%] animate-in fade-in duration-300">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-sm mt-1">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="px-5 py-4 bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm">
                            <div className="flex gap-1.5 items-center">
                                <span className="text-xs font-medium text-gray-400 mr-2">Thinking</span>
                                <span className="w-1.5 h-1.5 bg-linkedin-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 bg-linkedin-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 bg-linkedin-400 rounded-full animate-bounce" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions & Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                {/* Scrollable Chips */}
                {chatMessages.length === 0 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                        {quickActions.map((action) => (
                            <button
                                key={action.label}
                                onClick={() => sendChatMessage(action.label)}
                                disabled={isUpdating}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-linkedin-50 hover:text-linkedin-600 hover:border-linkedin-200 transition-all whitespace-nowrap active:scale-95"
                            >
                                <action.icon className="w-3.5 h-3.5" />
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="relative flex items-end gap-2 p-1.5 bg-gray-50 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-linkedin-100 focus-within:border-linkedin-300 transition-all shadow-inner">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Type a message..."
                        className="w-full pl-3 py-2.5 text-sm bg-transparent border-none outline-none resize-none max-h-32 text-gray-700 placeholder:text-gray-400 font-medium"
                        rows={1}
                        style={{ minHeight: '44px' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isUpdating}
                        className="p-2.5 mb-0.5 text-white transition-all rounded-xl bg-gradient-to-br from-linkedin-600 to-linkedin-500 hover:shadow-lg hover:shadow-linkedin-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="mt-2 text-center">
                    <p className="text-[10px] text-gray-400 font-medium">AI can make mistakes. Please double check responses.</p>
                </div>
            </div>
        </div>
    );
};

