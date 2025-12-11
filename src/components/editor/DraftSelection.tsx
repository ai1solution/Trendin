import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Linkedin, Zap, TrendingUp, Wand2, Bot, Sparkles, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { BackgroundTexture } from '../layout/BackgroundTexture';
import { trackEvent } from '../../lib/posthog';
import { cn } from '../../lib/utils';

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
            <div className="container max-w-7xl px-4 py-12 mx-auto relative min-h-[60vh] flex flex-col items-center justify-center">
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

                <div className="flex flex-col items-center justify-center mb-12 text-center relative z-10 w-full max-w-md">
                    <div className="relative w-20 h-20 mb-8">
                        <div className="absolute inset-0 rounded-full bg-linkedin-100 animate-ping opacity-20" />
                        <div className="absolute inset-0 rounded-full bg-purple-100 animate-ping opacity-20 delay-150" />
                        <div className="relative flex items-center justify-center w-20 h-20 text-white rounded-full bg-gradient-to-tr from-linkedin-600 to-purple-600 shadow-xl animate-pulse-slow ring-4 ring-white">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="h-10 mb-2 overflow-hidden flex flex-col items-center">
                        <motion.h2
                            key={loadingStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-2xl font-bold text-gray-900"
                        >
                            {loadingMessages[loadingStep]}
                        </motion.h2>
                    </div>

                    <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                        Powered by AI • Takes ~10 seconds
                    </p>

                    <div className="w-full h-1 mt-8 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-linkedin-500 to-purple-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 10, ease: "linear" }}
                        />
                    </div>
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

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold text-linkedin-700 uppercase bg-linkedin-50 rounded-full ring-1 ring-linkedin-100">
                            <Sparkles className="w-3.5 h-3.5" />
                            AI Generated Content
                        </div>
                        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 font-display">
                            Choose Your Draft
                        </h2>
                        <p className="mt-2 text-lg text-gray-600 max-w-xl">
                            We've created a few variations for you. Select the one that best fits your voice, and we'll help you refine it.
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
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 transition-all bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 active:scale-95 shadow-sm hover:shadow-md"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try New Topic
                    </button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {drafts.map((draft, idx) => (
                        <motion.button
                            key={draft.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            onClick={() => selectDraft(draft)}
                            className="group relative flex flex-col p-6 text-left transition-all bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-xl hover:border-linkedin-200 hover:-translate-y-1 h-full"
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-4">
                                <span className={cn(
                                    "px-3 py-1 text-xs font-bold rounded-lg tracking-wide uppercase",
                                    idx === 0 ? "bg-purple-50 text-purple-700" :
                                        idx === 1 ? "bg-blue-50 text-blue-700" :
                                            "bg-amber-50 text-amber-700"
                                )}>
                                    Option {idx + 1}
                                </span>
                                <div className="p-2 rounded-full bg-gray-50 group-hover:bg-linkedin-50 transition-colors">
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-linkedin-600 transition-colors" />
                                </div>
                            </div>

                            {/* Draft Line Decorator */}
                            <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent group-hover:via-linkedin-200 transition-all" />

                            {/* Content Preview */}
                            <div className="mb-6 flex-grow">
                                <p className="text-[15px] leading-7 text-gray-600 line-clamp-[10] group-hover:text-gray-900 transition-colors font-serif italic">
                                    "{draft.content}"
                                </p>
                            </div>

                            {/* Footer / Hashtags */}
                            <div className="pt-4 mt-auto border-t border-gray-50">
                                {draft.hashtags && draft.hashtags.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {draft.hashtags.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="text-xs font-medium text-linkedin-600 group-hover:text-linkedin-700">
                                                #{tag}
                                            </span>
                                        ))}
                                        {draft.hashtags.length > 3 && (
                                            <span className="text-xs text-gray-400">+{draft.hashtags.length - 3}</span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-300">No hashtags generated</span>
                                )}
                            </div>

                            {/* Selection Overlay Effect */}
                            <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-linkedin-500/10 transition-all pointer-events-none" />
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};
