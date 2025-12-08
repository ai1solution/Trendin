import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Bot, Sparkles, Binary, Share2, ThumbsUp } from 'lucide-react';

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
            type: i % 5 // 0: Linkedin, 1: Bot, 2: Binary, 3: Share/Like, 4: Sparkles
        }));
    }, []);

    const getIcon = (type: number) => {
        switch (type) {
            case 0: return <Linkedin className="w-full h-full text-linkedin-300/20" />;
            case 1: return <Bot className="w-full h-full text-purple-300/20" />;
            case 2: return <Binary className="w-full h-full text-gray-400/10" />;
            case 3: return type % 2 === 0 ? <Share2 className="w-full h-full text-blue-300/20" /> : <ThumbsUp className="w-full h-full text-blue-300/20" />;
            default: return <Sparkles className="w-full h-full text-yellow-300/20" />;
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
            {/* Gradient Mesh Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30" />

            {/* Animated Orbs */}
            <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-linkedin-100/30 rounded-full blur-[100px] animate-pulse-slow" />
            <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-100/30 rounded-full blur-[100px] animate-float-slow" />
            <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

            {/* Floating Icons */}
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
                        ease: "linear"
                    }}
                >
                    {getIcon(el.type)}
                </motion.div>
            ))}

            {/* Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#0A66C2 1px, transparent 1px), linear-gradient(90deg, #0A66C2 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />
        </div>
    );
};
