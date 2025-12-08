import React from 'react';
import { Send, Bot, User, Sparkles, Zap, Code2, Wand2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

export const AIChat = () => {
    const { chatMessages, sendChatMessage, isUpdating } = useAppStore();
    const [input, setInput] = React.useState('');
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleSend = () => {
        if (!input.trim() || isUpdating) return;
        sendChatMessage(input);
        setInput('');
    };

    const quickActions = [
        { label: 'Make it shorter', icon: Zap },
        { label: 'Add emojis', icon: Sparkles },
        { label: 'More professional', icon: Code2 },
    ];

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 via-white to-linkedin-50">
            {/* Modern Tech Header with Gradient */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-500 via-linkedin-500 to-success-500">
                <div className="flex items-center gap-2.5">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-sm">
                        <Wand2 className="w-4 h-4" />
                        <div className="absolute -inset-1 bg-white/20 rounded-xl blur animate-pulse-slow" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold font-display text-white">AI Assistant</h3>
                        <p className="text-xs font-medium text-white/80">Powered by advanced AI</p>
                    </div>
                </div>
            </div>

            {/* Messages with Tech Gradient Background */}
            <div
                ref={scrollRef}
                className="flex-1 p-5 space-y-5 overflow-y-auto custom-scrollbar bg-gradient-to-br from-gray-50/50 to-purple-50/30"
            >
                {/* Welcome Message Empty State */}
                {chatMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-80">
                        <div className="relative p-4 mb-4 rounded-2xl bg-gradient-to-br from-purple-100 to-linkedin-100">
                            <Bot className="w-10 h-10 text-purple-600" />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-linkedin-400/20 rounded-2xl blur-xl" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">AI Assistant Ready</p>
                        <p className="text-xs text-gray-500 max-w-[200px]">Ask me to refine, shorten, or enhance your post!</p>
                    </div>
                )}

                {chatMessages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "flex gap-3 text-sm",
                            msg.role === 'user' ? "ml-auto flex-row-reverse max-w-[85%]" : "max-w-[90%]"
                        )}
                    >
                        <div className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm",
                            msg.role === 'user'
                                ? "bg-gradient-to-br from-linkedin-600 to-linkedin-500 text-white"
                                : "bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-glow-purple"
                        )}>
                            {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                        </div>
                        <div className={cn(
                            "px-4 py-3 shadow-sm font-medium leading-relaxed",
                            msg.role === 'user'
                                ? "bg-gradient-to-br from-linkedin-600 to-linkedin-500 text-white rounded-2xl rounded-tr-md"
                                : "bg-white text-gray-700 rounded-2xl rounded-tl-md border border-purple-100"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isUpdating && (
                    <div className="flex gap-3 max-w-[90%]">
                        <div className="flex items-center justify-center flex-shrink-0 w-7 h-7 bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-sm rounded-lg">
                            <Bot className="w-3.5 h-3.5" />
                        </div>
                        <div className="px-4 py-3 bg-white border border-purple-100 shadow-sm rounded-2xl rounded-tl-md">
                            <div className="flex gap-1.5">
                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions with Vibrant Colors */}
            {chatMessages.length === 0 && (
                <div className="px-4 py-3 border-t border-gray-100 bg-white">
                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Quick Actions</p>
                    <div className="flex flex-wrap gap-2">
                        {quickActions.map((action) => (
                            <button
                                key={action.label}
                                onClick={() => sendChatMessage(action.label)}
                                disabled={isUpdating}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-100 rounded-lg hover:bg-gradient-to-r hover:from-purple-600 hover:to-linkedin-600 hover:text-white active:scale-95 transition-all disabled:opacity-50"
                            >
                                <action.icon className="w-3 h-3" />
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input with Gradient Focus */}
            <div className="p-4 border-t border-gray-100 bg-white">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask AI to refine your post..."
                        className="w-full pl-4 pr-12 py-3 text-sm font-medium bg-gray-50 border border-gray-200 outline-none rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-gray-400"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input || isUpdating}
                        className="absolute right-2 p-2 text-white transition-all rounded-lg bg-gradient-to-r from-purple-600 to-linkedin-600 hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
