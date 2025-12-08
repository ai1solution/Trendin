import { Rocket, Zap, TrendingUp, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { BackgroundTexture } from '../layout/BackgroundTexture';

const ExistingPostInput = () => {
    const [content, setContent] = useState('');
    const { setCustomDraft } = useAppStore();

    const handleEdit = () => {
        if (content.trim()) {
            setCustomDraft(content);
        }
    };

    return (
        <div className="relative w-full max-w-lg mx-auto mt-6 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-linkedin-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
            <div className="relative flex items-center bg-white rounded-xl shadow-sm border border-gray-100">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your existing post to refine with AI..."
                    className="flex-1 px-4 py-3 text-sm bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 focus:ring-0"
                    onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                />
                <button
                    onClick={handleEdit}
                    disabled={!content.trim()}
                    className="m-1 px-4 py-2 text-sm font-bold text-white bg-gray-900 rounded-lg hover:bg-linkedin-600 disabled:opacity-50 disabled:hover:bg-gray-900 transition-colors flex items-center gap-2"
                >
                    <PenTool className="w-3.5 h-3.5" />
                    Refine
                </button>
            </div>
        </div>
    );
};

export const Hero = () => {
    // Generate sparkle particles
    const sparkles = useMemo(() => {
        return Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 2 + Math.random() * 3,
            duration: 3 + Math.random() * 4,
            delay: Math.random() * 5,
        }));
    }, []);

    return (
        <section className="relative px-4 pt-20 pb-16 overflow-hidden md:pt-24 md:pb-20">
            {/* Enhanced Background Layers */}
            <div className="absolute inset-0 -z-10">
                {/* Gradient Mesh Base */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-linkedin-50/10 to-purple-50/15" />

                {/* Floating Abstract Shapes - Enhanced */}
                <div className="absolute inset-0 overflow-hidden opacity-60">
                    <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-linkedin-400/30 to-linkedin-200/10 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-purple-400/25 to-purple-200/10 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-success-400/20 to-success-200/10 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 right-1/3 w-36 h-36 bg-gradient-to-br from-energy-400/15 to-energy-200/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }} />
                </div>

                {/* Sparkle Particles Layer */}
                <div className="absolute inset-0 overflow-hidden">
                    {sparkles.map((sparkle) => (
                        <motion.div
                            key={sparkle.id}
                            className="absolute bg-linkedin-400/40 rounded-full"
                            style={{
                                left: `${sparkle.x}%`,
                                top: `${sparkle.y}%`,
                                width: sparkle.size,
                                height: sparkle.size,
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: sparkle.duration,
                                repeat: Infinity,
                                delay: sparkle.delay,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>

                {/* Dot Pattern Texture */}
                <BackgroundTexture type="dots" opacity={0.03} scale={40} />
            </div>

            <div className="container relative z-10 mx-auto text-center max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Badge with Premium Glow */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/80 backdrop-blur-sm border border-linkedin-100/50 shadow-soft"
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(10, 102, 194, 0.3)' }}
                    >
                        <TrendingUp className="w-4 h-4 text-success-500" />
                        <span className="text-sm font-bold text-gray-700">Join 10,000+ Professionals</span>
                    </motion.div>

                    {/* Main Headline with Shimmer Effect */}
                    <h1 className="mb-5 text-4xl font-extrabold tracking-tight md:text-6xl font-display lg:text-7xl leading-[1.05] text-linkedin-text">
                        Turn Ideas into{' '}
                        <span className="relative inline-block">
                            <span className="text-gradient-linkedin">
                                Viral LinkedIn Posts
                            </span>
                            {/* Animated Underline */}
                            <motion.div
                                className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-linkedin rounded-full"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            />
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="max-w-2xl mx-auto mb-8 text-lg md:text-xl leading-relaxed text-gray-700 font-medium">
                        Create high-impact posts <span className="font-bold text-linkedin-600">10× faster</span>.
                        Get more reach, visibility, and leads.
                    </p>

                    {/* Premium CTA with Glow */}
                    <div className="flex flex-col items-center gap-6">
                        <motion.button
                            onClick={() => {
                                document.getElementById('trending-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-white transition-all rounded-xl bg-gradient-linkedin overflow-hidden shadow-glow-linkedin"
                            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(10, 102, 194, 0.4)' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 bg-shimmer-gradient animate-shimmer-fast opacity-0 group-hover:opacity-100 transition-opacity" />

                            <Rocket className="relative w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <span className="relative">Create New Post</span>
                            <Zap className="relative w-5 h-5 fill-white/20 group-hover:fill-white/40 transition-all" />
                        </motion.button>

                        <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                            <span className="w-12 h-px bg-gray-200"></span>
                            OR
                            <span className="w-12 h-px bg-gray-200"></span>
                        </div>

                        {/* Edit Existing Draft Input */}
                        <ExistingPostInput />
                    </div>

                    {/* Stats Bar with Glassmorphism */}
                    <motion.div
                        className="flex flex-wrap items-center justify-center gap-8 mt-12 md:gap-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        {[
                            { value: '2M+', label: 'Posts Created', gradient: 'from-success-500 to-success-600' },
                            { value: '89%', label: 'Higher Engagement', gradient: 'from-linkedin-500 to-linkedin-600' },
                            { value: '10×', label: 'Faster Creation', gradient: 'from-energy-500 to-energy-600' },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-soft"
                                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)' }}
                            >
                                <span className={`text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${stat.gradient} font-display`}>
                                    {stat.value}
                                </span>
                                <span className="text-xs font-semibold text-gray-600">{stat.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
