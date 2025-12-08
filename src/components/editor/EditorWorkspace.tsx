import { PostEditor } from './PostEditor';
import { AIChat } from './AIChat';
import { useState, useMemo } from 'react';
import { MessageSquare, Edit3, ArrowLeft, Code2, Pen } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { motion } from 'framer-motion';
import { BackgroundTexture } from '../layout/BackgroundTexture';
import { trackEvent } from '../../lib/posthog';

export const EditorWorkspace = () => {
    const { setMode } = useAppStore();
    const [activeTab, setActiveTab] = useState<'editor' | 'chat'>('editor');

    // Very subtle floating icons for professional workspace feel
    const floatingIcons = useMemo(() => {
        return Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            type: i % 3 === 0 ? 'code' : i % 3 === 1 ? 'edit' : 'pen',
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: 20 + Math.random() * 15,
            delay: Math.random() * 8,
        }));
    }, []);

    return (
        <div className="container max-w-7xl px-4 py-4 mx-auto relative">
            {/* Enhanced Professional Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-linkedin-50/10" />
                <BackgroundTexture type="noise" opacity={0.015} />

                {/* Very subtle floating icons */}
                <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
                    {floatingIcons.map((item) => (
                        <motion.div
                            key={item.id}
                            className="absolute text-gray-400"
                            style={{
                                left: `${item.x}%`,
                                top: `${item.y}%`,
                            }}
                            animate={{
                                y: [0, -15, 0],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                                duration: item.duration,
                                delay: item.delay,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            {item.type === 'code' && <Code2 className="w-8 h-8" />}
                            {item.type === 'edit' && <Edit3 className="w-8 h-8" />}
                            {item.type === 'pen' && <Pen className="w-8 h-8" />}
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="relative z-10">
                {/* Back Button with Premium Style */}
                <button
                    onClick={() => {
                        trackEvent({
                            name: 'back_to_drafts_clicked',
                            properties: {}
                        });
                        setMode('selection');
                    }}
                    className="flex items-center gap-2 mb-4 px-3 py-2 text-sm font-medium text-gray-600 hover:text-linkedin-600 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-lg hover:border-linkedin-200 hover:shadow-soft transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Drafts
                </button>

                {/* Mobile Tab Switcher with Glassmorphism */}
                <div className="flex gap-2 mb-3 p-1 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl lg:hidden shadow-soft">
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'editor'
                            ? 'bg-gradient-linkedin text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Edit3 className="w-4 h-4" />
                        Post Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'chat'
                            ? 'bg-gradient-linkedin text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        AI Assistant
                    </button>
                </div>

                {/* Desktop: Side-by-side | Mobile: Tabbed - Enhanced with Glassmorphism */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Post Editor */}
                    <div className={`lg:col-span-2 ${activeTab === 'editor' ? 'block' : 'hidden lg:block'}`}>
                        <div className="h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)] overflow-hidden rounded-2xl shadow-float border border-gray-100 bg-white/95 backdrop-blur-sm">
                            <PostEditor />
                        </div>
                    </div>

                    {/* AI Chat */}
                    <div className={`lg:col-span-1 ${activeTab === 'chat' ? 'block' : 'hidden lg:block'}`}>
                        <div className="h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)] overflow-hidden rounded-2xl shadow-float border border-gray-100 bg-white/95 backdrop-blur-sm">
                            <AIChat />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
