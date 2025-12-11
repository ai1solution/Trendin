import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Bot, Sparkles, TrendingUp, Zap, Star, Heart } from 'lucide-react';

export const FloatingBackground = () => {
    // Generate random positions and animations for background elements
    const elements = React.useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            scale: 0.5 + Math.random() * 0.5,
            duration: 15 + Math.random() * 20,
            delay: Math.random() * 5,
            type: i % 7 // Variety of icons
        }));
    }, []);

    const getIcon = (type: number) => {
        switch (type) {
            case 0: return <Linkedin className="w-full h-full text-cyan-400/30" />;
            case 1: return <Bot className="w-full h-full text-purple-400/30" />;
            case 2: return <Sparkles className="w-full h-full text-yellow-400/30" />;
            case 3: return <TrendingUp className="w-full h-full text-emerald-400/30" />;
            case 4: return <Zap className="w-full h-full text-pink-400/30" />;
            case 5: return <Star className="w-full h-full text-amber-400/30" />;
            default: return <Heart className="w-full h-full text-rose-400/30" />;
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
            {/* Vibrant Gradient Mesh Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-cyan-100" />

            {/* Radial gradient overlays for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-200/60 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-cyan-200/60 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-pink-100/40 to-transparent" />

            {/* Large Animated Gradient Orbs */}
            <div className="absolute -top-[30%] -left-[20%] w-[70%] h-[70%] bg-gradient-to-br from-violet-300/50 to-purple-400/40 rounded-full blur-[140px] animate-float-slow" />
            <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] bg-gradient-to-bl from-cyan-300/50 to-blue-400/40 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            <div className="absolute -bottom-[20%] left-[10%] w-[65%] h-[65%] bg-gradient-to-tr from-fuchsia-300/50 to-pink-400/40 rounded-full blur-[130px] animate-float-slow" style={{ animationDelay: '1s' }} />

            {/* Accent colored smaller orbs */}
            <div className="absolute top-[20%] left-[60%] w-[30%] h-[30%] bg-gradient-to-br from-yellow-300/40 to-amber-400/30 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
            <div className="absolute bottom-[30%] right-[50%] w-[25%] h-[25%] bg-gradient-to-br from-emerald-300/40 to-teal-400/30 rounded-full blur-[70px] animate-float-slow" style={{ animationDelay: '4s' }} />

            {/* Vibrant Dot Pattern */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: 'radial-gradient(circle, #a855f7 2px, transparent 2px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Floating Icons - More visible */}
            {elements.map((el) => (
                <motion.div
                    key={el.id}
                    className="absolute"
                    style={{
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        width: el.scale * 40 + 20 + 'px',
                        height: el.scale * 40 + 20 + 'px',
                    }}
                    animate={{
                        y: [0, -50, 0],
                        rotate: [0, 10, -10, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: el.duration,
                        repeat: Infinity,
                        delay: el.delay,
                        ease: "easeInOut"
                    }}
                >
                    {getIcon(el.type)}
                </motion.div>
            ))}

            {/* Diagonal colorful grid lines */}
            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: 'linear-gradient(to right, #8b5cf6 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)',
                    backgroundSize: '80px 80px'
                }}
            />

            {/* Subtle noise texture for depth */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />
        </div>
    );
};
