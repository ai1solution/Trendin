import { PostEditor } from './PostEditor';
import { AIChat } from './AIChat';
import { useState } from 'react';
import { MessageSquare, Edit3, ChevronLeft, Layout } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { BackgroundTexture } from '../layout/BackgroundTexture';
import { trackEvent } from '../../lib/posthog';

export const EditorWorkspace = () => {
    const { setMode } = useAppStore();
    const [activeTab, setActiveTab] = useState<'editor' | 'chat'>('editor');

    return (
        <div className="container max-w-7xl px-4 py-6 mx-auto relative flex flex-col">
            {/* Enhanced Professional Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[#f8f9fb]" />
                <BackgroundTexture type="dots" opacity={0.03} />
            </div>

            <div className="relative z-10 flex-1 flex flex-col">
                {/* Navigation Bar */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => {
                            trackEvent({
                                name: 'back_to_drafts_clicked',
                                properties: {}
                            });
                            setMode('selection');
                        }}
                        className="group flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl hover:border-gray-300 hover:text-gray-900 hover:shadow-sm transition-all"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        Back to Drafts
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/50 border border-gray-200/50 rounded-lg">
                            <Layout className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-500">Split View Active</span>
                        </div>
                    </div>
                </div>

                {/* Mobile Tab Switcher */}
                <div className="flex p-1 mb-6 bg-gray-100/80 backdrop-blur-sm rounded-xl lg:hidden">
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'editor'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Edit3 className="w-4 h-4" />
                        Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'chat'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        AI Assistant
                    </button>
                </div>

                {/* Workspace Grid */}
                <div className="flex-1 grid grid-cols-1 gap-6 lg:grid-cols-12 h-full min-h-[600px]">
                    {/* Post Editor */}
                    <div className={`lg:col-span-8 flex flex-col ${activeTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
                        <div className="flex-1 overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm hover:shadow-md transition-shadow duration-500 relative">
                            <PostEditor />
                        </div>
                    </div>

                    {/* AI Chat */}
                    <div className={`lg:col-span-4 flex flex-col ${activeTab === 'chat' ? 'flex' : 'hidden lg:flex'}`}>
                        <div className="flex-1 overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm hover:shadow-md transition-shadow duration-500 relative">
                            <AIChat />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

