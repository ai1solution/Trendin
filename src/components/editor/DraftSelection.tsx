import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Linkedin, Zap, TrendingUp, Wand2, Bot, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { BackgroundTexture } from '../layout/BackgroundTexture';
import { trackEvent } from '../../lib/posthog';

export const DraftSelection = () => {
    const { drafts, selectDraft, isGenerating, setMode } = useAppStore();
    const [loadingStep, setLoadingStep] = React.useState(0);

    React.useEffect(() => {
        if (isGenerating) {
            const interval = setInterval(() => {
                setLoadingStep((prev) => (prev + 1) % 4);
            }, 800);
            return () => clearInterval(interval);
        } else {
            setLoadingStep(0);
        }
    }, [isGenerating]);

    const loadingMessages = [
        "Analyzing trends...",
        "Crafting viral content...",
        "Optimizing engagement...",
        "Perfecting tone..."
    ];

    // Enhanced floating icons with variety
    const floatingIcons = useMemo(() => {
        return Array.from({ length: 18 }, (_, i) => ({
            id: i,
            type: i % 4 === 0 ? 'linkedin' : i % 4 === 1 ? 'wand' : i % 4 === 2 ? 'bot' : 'sparkle',
            size: Math.random() * 20 + 15,
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 5,
            duration: Math.random() * 10 + 15,
        }));
    }, []);

    if (isGenerating) {
        return (
            <div className="container max-w-7xl px-4 py-12 mx-auto relative">
                {/* Enhanced Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 via-white to-linkedin-50/15" />
                    <BackgroundTexture type="grid" opacity={0.02} scale={50} />
                </div>

                {/* Floating mixed icons */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.12]">
                    {floatingIcons.map((icon) => (
                        <motion.div
                            key={icon.id}
                            className="absolute text-purple-500"
                            style={{
                                left: `${icon.left}%`,
                                top: `${icon.top}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                rotate: [0, 10, -10, 0],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: icon.duration,
                                delay: icon.delay,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            {icon.type === 'linkedin' && <Linkedin size={icon.size} />}
                            {icon.type === 'wand' && <Wand2 size={icon.size} className="text-linkedin-400" />}
                            {icon.type === 'bot' && <Bot size={icon.size} className="text-success-400" />}
                            {icon.type === 'sparkle' && <Sparkles size={icon.size} className="text-energy-400" />}
                        </motion.div>
                    ))}
                </div>

                <div className="flex flex-col items-center justify-center mb-12 text-center relative z-10">
                    <div className="relative w-16 h-16 mb-6">
                        <div className="absolute inset-0 rounded-full bg-linkedin-100 animate-ping opacity-20" />
                        <div className="relative flex items-center justify-center w-16 h-16 text-white rounded-full bg-gradient-linkedin shadow-lg animate-pulse-slow">
                            <TrendingUp className="w-7 h-7" />
                        </div>
                    </div>
                    <motion.h2
                        key={loadingStep}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-extrabold font-display text-linkedin-text mb-2"
                    >
                        {loadingMessages[loadingStep]}
                    </motion.h2>
                    <p className="text-sm font-medium text-gray-600">Powered by AI • Takes ~10 seconds</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-7xl px-4 py-12 mx-auto relative">
            {/* Enhanced Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 via-white to-linkedin-50/15" />
                <BackgroundTexture type="grid" opacity={0.02} scale={50} />
            </div>

            {/* Gentle floating icons for selection state */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.08]">
                {floatingIcons.slice(0, 12).map((icon) => (
                    <motion.div
                        key={icon.id}
                        className="absolute"
                        style={{
                            left: `${icon.left}%`,
                            top: `${icon.top}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: icon.duration,
                            delay: icon.delay,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {icon.type === 'linkedin' && <Linkedin size={icon.size} className="text-linkedin-400" />}
                        {icon.type === 'wand' && <Wand2 size={icon.size} className="text-purple-400" />}
                        {icon.type === 'bot' && <Bot size={icon.size} className="text-success-400" />}
                        {icon.type === 'sparkle' && <Sparkles size={icon.size} className="text-energy-400" />}
                    </motion.div>
                ))}
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight font-display text-linkedin-text">
                            Choose Your Draft
                        </h2>
                        <p className="mt-1 text-base font-medium text-gray-600">
                            Select a post to refine with AI
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            trackEvent({
                                name: 'try_again_clicked',
                                properties: {}
                            });
                            setMode('landing');
                            setTimeout(() => {
                                document.getElementById('trending-section')?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 transition-all bg-white border border-gray-200 rounded-lg hover:border-linkedin-300 hover:text-linkedin-600 active:scale-95"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {drafts.map((draft, idx) => (
                        <motion.button
                            key={draft.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            onClick={() => selectDraft(draft)}
                            className="relative p-5 text-left transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-card hover:border-linkedin-200 active:scale-[0.98] group"
                        >
                            {/* Subtle glow on hover */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-linkedin-500/0 group-hover:from-purple-500/5 group-hover:to-linkedin-500/5 transition-all" />

                            <div className="relative flex items-start justify-between mb-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linkedin-50 group-hover:bg-linkedin-100 transition-colors">
                                    <Zap className="w-4 h-4 text-linkedin-600" />
                                </div>
                                <span className="px-2 py-1 text-[10px] font-bold text-linkedin-700 uppercase bg-linkedin-50 rounded">
                                    Draft {idx + 1}
                                </span>
                            </div>

                            <div className="mb-3">
                                <p className="text-sm leading-[1.6] text-gray-900 whitespace-pre-wrap line-clamp-8" style={{ fontFamily: '-apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif' }}>
                                    {draft.content}
                                </p>
                            </div>

                            {draft.hashtags && draft.hashtags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {draft.hashtags.slice(0, 3).map((tag, i) => (
                                        <span key={i} className="px-2 py-0.5 text-[11px] font-semibold text-linkedin-600 bg-linkedin-50 rounded">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};
