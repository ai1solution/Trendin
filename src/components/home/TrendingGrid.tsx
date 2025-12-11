import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, LineChart, BarChart3, X, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { api, type TrendingTopic } from '../../lib/api';
import { BackgroundTexture } from '../layout/BackgroundTexture';
import { trackEvent } from '../../lib/posthog';

const POPULAR_NICHES = [
    'Technology',
    'Marketing',
    'Finance',
    'Healthcare',
    'Education',
    'Real Estate',
    'E-commerce',
    'Sustainability',
    'AI & Machine Learning',
    'Data Science',
    'Cybersecurity',
    'Cloud Computing',
    'Blockchain',
    'Leadership',
    'Entrepreneurship',
    'Product Management',
    'Design',
    'Sales',
    'Customer Success',
    'Human Resources'
];

export const TrendingGrid = () => {
    const { generateDrafts } = useAppStore();
    const [selectedNiche, setSelectedNiche] = React.useState<string>('');
    const [customNiche, setCustomNiche] = React.useState('');
    const [trendingTopics, setTrendingTopics] = React.useState<TrendingTopic[]>([]);
    const [isLoadingTrends, setIsLoadingTrends] = React.useState(false);

    // Fetch trends based on selected niche
    const fetchTrends = async (niche?: string) => {
        setIsLoadingTrends(true);
        try {
            const trends = await api.getTrends(niche);
            setTrendingTopics(trends);
        } finally {
            setIsLoadingTrends(false);
        }
    };

    // Initial load - fetch general trends
    useEffect(() => {
        fetchTrends();
    }, []);

    // Refetch when niche changes
    useEffect(() => {
        const activeNiche = customNiche || selectedNiche;
        if (activeNiche) {
            fetchTrends(activeNiche);
        } else {
            fetchTrends();
        }
    }, [selectedNiche, customNiche]);

    // Generate floating chart icons
    const floatingIcons = useMemo(() => {
        return Array.from({ length: 10 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            icon: i % 3 === 0 ? 'trending' : i % 3 === 1 ? 'line' : 'bar',
            duration: 15 + Math.random() * 10,
            delay: Math.random() * 5,
        }));
    }, []);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'High': return 'bg-energy-50 text-energy-700 border-energy-200';
            case 'Med': return 'bg-linkedin-50 text-linkedin-700 border-linkedin-200';
            default: return 'bg-success-50 text-success-700 border-success-200';
        }
    };

    const handleNicheSelect = (niche: string) => {
        setSelectedNiche(niche);
        setCustomNiche(''); // Clear custom when selecting predefined

        // Track niche selection
        trackEvent({
            name: 'niche_filter_selected',
            properties: { niche, is_custom: false }
        });
    };

    const handleClearFilter = () => {
        setSelectedNiche('');
        setCustomNiche('');
    };

    const handleCustomNicheApply = () => {
        if (customNiche.trim()) {
            trackEvent({
                name: 'custom_niche_entered',
                properties: { niche: customNiche }
            });
            fetchTrends(customNiche);
        }
    };

    const activeFilter = customNiche || selectedNiche;

    return (
        <section id="trending-section" className="relative container max-w-7xl px-4 py-12 mx-auto overflow-hidden">
            {/* Enhanced Background */}
            <div className="absolute inset-0 -z-10">
                {/* Gradient Base */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-success-50/10 to-transparent" />

                {/* Floating Chart Icons */}
                <div className="absolute inset-0 overflow-hidden opacity-[0.05]">
                    {floatingIcons.map((item) => (
                        <motion.div
                            key={item.id}
                            className="absolute text-success-600"
                            style={{
                                left: `${item.x}%`,
                                top: `${item.y}%`,
                            }}
                            animate={{
                                x: [0, 30, 0],
                                y: [0, -40, 0],
                                rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                                duration: item.duration,
                                repeat: Infinity,
                                delay: item.delay,
                                ease: "easeInOut"
                            }}
                        >
                            {item.icon === 'trending' && <TrendingUp className="w-12 h-12" />}
                            {item.icon === 'line' && <LineChart className="w-12 h-12" />}
                            {item.icon === 'bar' && <BarChart3 className="w-12 h-12" />}
                        </motion.div>
                    ))}
                </div>

                {/* Subtle wave pattern */}
                <BackgroundTexture type="grid" opacity={0.015} scale={60} />
            </div>

            <div className="relative z-10">
                <div className="mb-8 text-center">
                    <h2 className="mb-3 text-3xl font-extrabold tracking-tight font-display text-linkedin-text">
                        Browse Trending Topics
                    </h2>
                    <p className="max-w-2xl mx-auto text-base font-medium text-gray-600">
                        Select any topic below to instantly <span className="text-linkedin-600 font-bold">generate viral-ready posts</span> for your audience.
                    </p>
                </div>

                {/* Niche Filter Section */}
                <div className="max-w-5xl mx-auto mb-8">
                    <div className="flex flex-col gap-4">
                        {/* Popular Niche Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <span className="text-sm font-semibold text-gray-600 mr-2">Filter by niche:</span>
                            {POPULAR_NICHES.map((niche) => (
                                <button
                                    key={niche}
                                    onClick={() => handleNicheSelect(niche)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${selectedNiche === niche
                                        ? 'bg-gradient-linkedin text-white shadow-md'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-linkedin-300 hover:text-linkedin-600'
                                        }`}
                                >
                                    {niche}
                                </button>
                            ))}
                        </div>

                        {/* Custom Niche Input */}
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-sm font-semibold text-gray-600">Or custom:</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter your own niche..."
                                    value={customNiche}
                                    onChange={(e) => {
                                        setCustomNiche(e.target.value);
                                        setSelectedNiche(''); // Clear predefined when typing custom
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && customNiche.trim()) {
                                            fetchTrends(customNiche);
                                        }
                                    }}
                                    className="w-64 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-linkedin-500 focus:border-transparent"
                                />
                                {customNiche && (
                                    <button
                                        onClick={handleCustomNicheApply}
                                        className="px-4 py-2 text-sm font-bold text-white bg-gradient-linkedin rounded-lg hover:shadow-lg transition-all"
                                    >
                                        Apply
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Active Filter Display */}
                        {activeFilter && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center justify-center gap-2"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-linkedin-50 border border-linkedin-200 rounded-full">
                                    <TrendingUp className="w-4 h-4 text-linkedin-600" />
                                    <span className="text-sm font-semibold text-linkedin-900">
                                        Showing: <span className="font-bold">{activeFilter}</span>
                                    </span>
                                    <button
                                        onClick={handleClearFilter}
                                        className="ml-1 p-0.5 hover:bg-linkedin-100 rounded-full transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5 text-linkedin-600" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {isLoadingTrends && (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-3 text-linkedin-600">
                            <div className="w-6 h-6 border-2 border-linkedin-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm font-semibold">Loading trends...</span>
                        </div>
                    </div>
                )}

                {/* Trending Topics Grid */}
                {!isLoadingTrends && (
                    <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {trendingTopics.map((topic, idx) => (
                            <motion.div
                                key={topic.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.02 }}
                                onClick={() => {
                                    // Track trending topic click
                                    trackEvent({
                                        name: 'trending_topic_clicked',
                                        properties: {
                                            topic_title: topic.title,
                                            topic_difficulty: topic.difficulty,
                                            niche: activeFilter
                                        }
                                    });
                                    generateDrafts(topic.title);
                                }}
                                className="card-interactive p-4 text-left group bg-white hover:bg-white flex flex-col relative cursor-pointer ring-1 ring-gray-100 hover:ring-linkedin-300 transition-all hover:shadow-lg hover:-translate-y-1 rounded-xl"
                            >
                                {/* Animated "Hot" Badge */}
                                {idx < 3 && (
                                    <motion.div
                                        className="inline-flex items-center gap-1 px-2 py-0.5 mb-2 text-[10px] font-bold text-white uppercase rounded bg-gradient-to-r from-energy-500 to-energy-600 self-start shadow-sm"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Zap className="w-2.5 h-2.5 fill-white" />
                                        Hot
                                    </motion.div>
                                )}

                                {/* Hover Prompt Overlay */}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                    <div className="flex items-center gap-1 text-xs font-bold text-linkedin-600 bg-linkedin-50 px-2 py-1 rounded-full shadow-sm">
                                        <Sparkles className="w-3 h-3" />
                                        Generate
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>

                                <div className="text-left flex-1 mt-1">
                                    <h3 className="mb-2 text-sm font-bold leading-tight text-linkedin-text line-clamp-3 group-hover:text-linkedin-700 transition-colors">
                                        {topic.title}
                                    </h3>
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                                    {/* Clickable Source Link */}
                                    {topic.link ? (
                                        <a
                                            href={topic.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-semibold text-gray-500 hover:text-linkedin-600 transition-colors flex items-center gap-1 z-10"
                                            onClick={(e) => e.stopPropagation()}
                                            title="View Source"
                                        >
                                            {topic.posts}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : (
                                        <span className="text-xs font-semibold text-gray-500">{topic.posts}</span>
                                    )}
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${getDifficultyColor(topic.difficulty)}`}>
                                        {topic.difficulty}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
