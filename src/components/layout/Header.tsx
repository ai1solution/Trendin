import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const Header = () => {
    const { setMode, mode } = useAppStore();
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-white/90 backdrop-blur-xl border-b border-gradient-to-r from-blue-200/30 via-purple-200/20 to-pink-200/30 shadow-lg shadow-blue-500/5'
                    : 'bg-white/70 backdrop-blur-md border-b border-slate-200/40'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Gradient Border Top */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

            <div className="container px-4 mx-auto md:px-6">
                <div className="flex items-center justify-between h-16 md:h-14">
                    {/* Logo */}
                    <button
                        onClick={() => setMode('landing')}
                        className="flex items-center gap-3 group relative"
                    >
                        {/* Animated glow on hover */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500" />

                        <div className="relative w-9 h-9 md:w-8 md:h-8 transition-transform group-hover:scale-110 duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-linkedin-500 to-purple-600 rounded-lg blur-sm opacity-50 group-hover:opacity-70 transition-opacity" />
                            <img
                                src="/logo.png"
                                alt="Trendin"
                                className="relative w-full h-full object-contain drop-shadow-lg"
                            />
                            {/* Sparkle effect */}
                            <motion.div
                                className="absolute -top-1 -right-1 text-yellow-400"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 90, 0],
                                    opacity: [0.7, 1, 0.7]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Sparkles className="w-3 h-3" />
                            </motion.div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xl md:text-lg font-bold bg-gradient-to-r from-linkedin-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent font-display group-hover:from-linkedin-600 group-hover:via-purple-600 group-hover:to-indigo-600 transition-all duration-300">
                                Trendin
                            </span>
                            {mode !== 'landing' && (
                                <span className="text-[10px] font-medium text-slate-500 -mt-0.5">
                                    AI-Powered Posts
                                </span>
                            )}
                        </div>
                    </button>

                    {/* Status Indicator (for non-landing modes) */}
                    {mode !== 'landing' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200/50"
                        >
                            <div className="relative flex w-2 h-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </div>
                            <span className="text-xs font-semibold text-emerald-700">
                                AI Active
                            </span>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.header>
    );
};
