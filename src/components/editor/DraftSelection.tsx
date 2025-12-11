import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Linkedin, Zap, TrendingUp, Wand2, Bot, Sparkles, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { BackgroundTexture } from '../layout/BackgroundTexture';
import { trackEvent } from '../../lib/posthog';
import { cn } from '../../lib/utils';

export const DraftSelection = () => {
    const { drafts, selectDraft, isGenerating, setMode, analysis } = useAppStore();
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
        <div className="container max-w-7xl px-3 sm:px-4 py-6 sm:py-12 mx-auto relative min-h-[calc(100vh-10rem)]">
            {/* Soothing Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100/70 via-fuchsia-50/50 to-cyan-100/70" />
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #d946ef 1.5px, transparent 1.5px)',
                        backgroundSize: '35px 35px'
                    }}
                />
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
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 sm:mb-3 text-[10px] sm:text-xs font-semibold text-indigo-700 uppercase bg-indigo-50/80 rounded-full border border-indigo-100">
                            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            AI Generated Content
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                            Choose Your Draft
                        </h2>
                        <p className="mt-1.5 sm:mt-2 text-sm sm:text-lg text-slate-600 max-w-xl">
                            We've created variations for you. Select one and we'll help refine it.
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
                        className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 transition-all bg-white/90 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-white active:scale-95 shadow-sm hover:shadow-md"
                    >
                        <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Try New Topic</span>
                        <span className="sm:hidden">New Topic</span>
                    </button>
                </div>

                {/* Analysis Section - Collapsible */}
                {analysis && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 sm:mb-8"
                    >
                        <button
                            onClick={() => {
                                const section = document.getElementById('analysis-section');
                                if (section) {
                                    const isHidden = section.style.display === 'none';
                                    section.style.display = isHidden ? 'grid' : 'none';
                                    const icon = document.getElementById('analysis-toggle-icon');
                                    if (icon) {
                                        icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
                                    }
                                }
                            }}
                            className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 group hover:bg-white/50 px-3 py-2 rounded-lg transition-all"
                        >
                            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <h2 className="text-base sm:text-xl font-bold text-slate-900">Strategic Analysis</h2>
                            <ChevronRight
                                id="analysis-toggle-icon"
                                className="w-4 h-4 text-slate-400 transition-transform rotate-90 ml-auto"
                            />
                        </button>

                        <div id="analysis-section" className="grid gap-3 sm:gap-6 sm:grid-cols-2" style={{ display: 'none' }}>
                            {/* Consensus Card */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50/50 border border-blue-100/70 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                                <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-5">
                                    <TrendingUp className="w-16 h-16 sm:w-24 sm:h-24 text-blue-600" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                        <div className="p-1.5 sm:p-2 bg-blue-100/60 rounded-lg">
                                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                        </div>
                                        <h3 className="text-sm sm:text-lg font-bold text-slate-900">Market Consensus</h3>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                                        "{analysis.consensus}"
                                    </p>
                                </div>
                            </div>

                            {/* Gap Card */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-white to-purple-50/50 border border-purple-100/70 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                                <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-5">
                                    <Zap className="w-16 h-16 sm:w-24 sm:h-24 text-purple-600" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                        <div className="p-1.5 sm:p-2 bg-purple-100/60 rounded-lg">
                                            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                        </div>
                                        <h3 className="text-sm sm:text-lg font-bold text-slate-900">The Opportunity Gap</h3>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                                        "{analysis.gap}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {drafts.map((draft, idx) => (
                        <motion.button
                            key={draft.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            onClick={() => selectDraft(draft)}
                            className="group relative flex flex-col p-4 sm:p-6 text-left transition-all bg-white/95 backdrop-blur-sm border border-slate-200/60 shadow-md rounded-xl sm:rounded-2xl hover:shadow-2xl hover:shadow-purple-500/10 hover:border-indigo-300 hover:-translate-y-1 active:scale-[0.98] h-full"
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <span className={cn(
                                    "px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold rounded-lg tracking-wide uppercase",
                                    idx === 0 ? "bg-purple-50 text-purple-700 border border-purple-100" :
                                        idx === 1 ? "bg-blue-50 text-blue-700 border border-blue-100" :
                                            "bg-amber-50 text-amber-700 border border-amber-100"
                                )}>
                                    {draft.title ? draft.title : `Option ${idx + 1}`}
                                </span>
                                <div className="p-1.5 sm:p-2 rounded-full bg-slate-50 group-hover:bg-indigo-50 transition-colors">
                                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                </div>
                            </div>

                            {/* Draft Line Decorator */}
                            <div className="absolute top-0 left-6 right-6 sm:left-8 sm:right-8 h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent group-hover:via-indigo-200 transition-all" />

                            {/* Content Preview */}
                            <div className="mb-4 sm:mb-6 flex-grow">
                                {(() => {
                                    // Split content to separate hook from body
                                    const parts = draft.content.split('\n\n');
                                    const hook = parts[0];
                                    const body = parts.slice(1).join('\n\n');

                                    return (
                                        <div className="space-y-2 sm:space-y-3">
                                            {/* Hook */}
                                            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed border-l-2 border-indigo-500 pl-2.5 sm:pl-3">
                                                {hook}
                                            </p>

                                            {/* Body */}
                                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line line-clamp-4">
                                                {body}
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Footer / Hashtags */}
                            <div className="pt-3 sm:pt-4 mt-auto border-t border-slate-100">
                                {draft.hashtags && draft.hashtags.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {draft.hashtags.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="text-[10px] sm:text-xs font-medium text-indigo-600 group-hover:text-indigo-700">
                                                #{tag}
                                            </span>
                                        ))}
                                        {draft.hashtags.length > 3 && (
                                            <span className="text-[10px] sm:text-xs text-slate-400">+{draft.hashtags.length - 3}</span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-[10px] sm:text-xs text-slate-300">No hashtags</span>
                                )}
                            </div>

                            {/* Selection Overlay Effect */}
                            <div className="absolute inset-0 rounded-xl sm:rounded-2xl ring-2 ring-transparent group-hover:ring-indigo-500/20 transition-all pointer-events-none" />
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};
