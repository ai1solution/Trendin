import { PostEditor } from './PostEditor';
import { AIChat } from './AIChat';
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Edit3, ChevronLeft } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { trackEvent } from '../../lib/posthog';
import { motion } from 'framer-motion';

export const EditorWorkspace = () => {
    const { setMode, isUpdating } = useAppStore();
    const [activeTab, setActiveTab] = useState<'editor' | 'chat'>('editor');
    const prevIsUpdating = useRef(isUpdating);

    // Auto-switch to editor tab when AI finishes responding (mobile only)
    useEffect(() => {
        if (prevIsUpdating.current && !isUpdating && activeTab === 'chat') {
            // Small delay for user to see the response briefly, then switch
            setTimeout(() => {
                setActiveTab('editor');
            }, 800);
        }
        prevIsUpdating.current = isUpdating;
    }, [isUpdating, activeTab]);

    return (
        <div className="container max-w-7xl px-3 sm:px-4 py-4 sm:py-6 mx-auto relative flex flex-col min-h-[calc(100vh-8rem)]">
            {/* Soothing Background Gradient */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/80 via-pink-50/60 to-cyan-100/80" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #a855f7 1.5px, transparent 1.5px)',
                        backgroundSize: '30px 30px'
                    }}
                />
            </div>

            <div className="relative z-10 flex-1 flex flex-col">
                {/* Navigation Bar */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <motion.button
                        onClick={() => {
                            trackEvent({
                                name: 'back_to_drafts_clicked',
                                properties: {}
                            });
                            setMode('selection');
                        }}
                        className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-xl hover:border-slate-300 hover:bg-white hover:shadow-md shadow-sm transition-all active:scale-95"
                        whileHover={{ x: -4 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Back to Drafts</span>
                        <span className="sm:hidden">Back</span>
                    </motion.button>
                </div>

                {/* Mobile Tab Switcher */}
                <div className="flex p-1 mb-4 bg-slate-100/80 backdrop-blur-sm rounded-xl lg:hidden shadow-sm">
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'editor'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-800'
                            }`}
                    >
                        <Edit3 className="w-4 h-4" />
                        <span className="text-xs sm:text-sm">Editor</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'chat'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-800'
                            }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs sm:text-sm">AI Chat</span>
                    </button>
                </div>

                {/* Workspace Grid - Mobile Optimized */}
                <div className="flex-1 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
                    {/* Post Editor */}
                    <motion.div
                        className={`lg:col-span-8 flex flex-col ${activeTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="flex-1 overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/60 bg-white/95 backdrop-blur-sm shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/30 transition-all duration-500">
                            <PostEditor />
                        </div>
                    </motion.div>

                    {/* AI Chat */}
                    <motion.div
                        className={`lg:col-span-4 flex flex-col ${activeTab === 'chat' ? 'flex' : 'hidden lg:flex'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <div className="flex-1 overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/60 bg-white/95 backdrop-blur-sm shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-purple-300/20 transition-all duration-500">
                            <AIChat />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
