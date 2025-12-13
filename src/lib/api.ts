export interface PostDraft {
    id: string;
    title: string;
    content: string;
    hashtags: string[];
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface UpdatePostResponse {
    content: string;
    summary_message?: string;
}

export interface Analysis {
    consensus: string;
    gap: string;
}

export interface GenerateResponse {
    drafts: PostDraft[];
    analysis?: Analysis;
}

export interface TrendingTopic {
    id: string;
    title: string;
    snippet?: string;
    source_name?: string;
    link?: string;
    published_date?: string;
    thumbnail_url?: string;
    // Computed/Mocked fields for UI
    volume?: string;
    difficulty?: 'Low' | 'Med' | 'High';
}

const N8N_GENERATE_URL = 'https://aionesolution-trendin.hf.space/webhook/smart-linkedin-agent';
const N8N_REFINE_URL = 'https://aionesolution-trendin.hf.space/webhook/linkedin-content-automation-interact-v2';

// Mock data for trending topics
const getMockDataForNiche = (niche?: string): TrendingTopic[] => {
    const baseTopics: TrendingTopic[] = [
        {
            id: '1',
            title: 'The Future of Remote Work in 2025',
            source_name: 'Forbes',
            volume: '12.5K posts',
            difficulty: 'Med',
            link: 'https://www.forbes.com',
            snippet: 'Remote work is evolving into a hybrid model that prioritizes flexibility and digital collaboration tools.',
            published_date: 'Dec 12, 2025',
            thumbnail_url: 'https://images.unsplash.com/photo-1593642632823-8f785667914d?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: '2',
            title: 'AI Revolutionizing Healthcare Systems',
            source_name: 'TechCrunch',
            volume: '45K posts',
            difficulty: 'High',
            link: 'https://techcrunch.com',
            snippet: 'Artificial intelligence is diagnosing diseases faster and more accurately than ever before.',
            published_date: 'Dec 11, 2025',
            thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: '3',
            title: 'Sustainable Business Practices Gain Momentum',
            source_name: 'Bloomberg',
            volume: '8.2K posts',
            difficulty: 'Med',
            link: 'https://www.bloomberg.com',
            snippet: 'Companies are increasingly adopting green policies to attract eco-conscious consumers and investors.',
            published_date: 'Dec 10, 2025',
            thumbnail_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5afa?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: '4',
            title: 'Cybersecurity Threats in Modern Enterprises',
            source_name: 'Wired',
            volume: '22K posts',
            difficulty: 'High',
            link: 'https://www.wired.com',
            snippet: 'As digital transformation accelerates, so do the sophistication and frequency of cyber attacks.',
            published_date: 'Dec 09, 2025',
            thumbnail_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000'
        },
        {
            id: '5',
            title: 'The Rise of No-Code Development Platforms',
            source_name: 'VentureBeat',
            volume: '15K posts',
            difficulty: 'Low',
            link: 'https://venturebeat.com',
            snippet: 'No-code tools are democratizing software creation, allowing non-engineers to build powerful apps.',
            published_date: 'Dec 08, 2025',
            thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000'
        }
    ];

    if (niche) {
        return baseTopics.map(topic => ({
            ...topic,
            title: `${niche}: ${topic.title}`
        }));
    }

    return baseTopics;
};

export const api = {
    // Fetch trending topics via n8n webhook
    getTrends: async (niche?: string): Promise<TrendingTopic[]> => {
        try {
            const n8nUrl = 'https://aionesolution-trendin.hf.space/webhook/trendin-trends';
            const url = new URL(n8nUrl);

            if (niche) {
                url.searchParams.append('niche', niche);
            }

            const response = await fetch(url.toString());

            if (!response.ok) {
                throw new Error(`N8N API returned ${response.status}`);
            }

            const result = await response.json();

            // Check if response has data
            if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                // Map response to TrendingTopic and add mock values for visual richness
                return result.data.map((item: any) => ({
                    id: item.id || Math.random().toString(36).substr(2, 9),
                    title: item.title,
                    snippet: item.snippet !== 'No summary available.' ? item.snippet : undefined,
                    source_name: item.source_name,
                    link: item.link,
                    published_date: item.published_date,
                    thumbnail_url: item.thumbnail_url,
                    // Mock data for UI polish
                    volume: `${Math.floor(Math.random() * 50 + 10)}K posts`,
                    difficulty: ['Low', 'Med', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Med' | 'High'
                }));
            } else if (result.data && Array.isArray(result.data) && result.data.length > 0) {
                // Fallback for direct array
                return result.data.map((item: any) => ({
                    id: item.id || Math.random().toString(36).substr(2, 9),
                    title: item.title,
                    snippet: item.snippet,
                    source_name: item.source_name,
                    link: item.link,
                    published_date: item.published_date,
                    thumbnail_url: item.thumbnail_url,
                    volume: `${Math.floor(Math.random() * 50 + 10)}K posts`,
                    difficulty: ['Low', 'Med', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Med' | 'High'
                }));
            }

            // Fallback to mock data if no results
            console.warn("No results from n8n webhook, using mock data");
            return getMockDataForNiche(niche);

        } catch (error) {
            console.error("Failed to fetch trends from n8n:", error);
            // Fallback to mock data on error
            return getMockDataForNiche(niche);
        }
    },

    // Generate drafts via N8N Webhook
    generateDrafts: async (topic: string): Promise<GenerateResponse> => {
        try {
            const response = await fetch(N8N_GENERATE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ keyword: topic })
            });

            if (!response.ok) {
                throw new Error('Failed to generate drafts');
            }

            const data = await response.json();

            // Parse schema - handle nested output
            const posts = data.output?.posts || data.posts;
            const analysis = data.output?.analysis || data.analysis;

            if (posts && Array.isArray(posts)) {
                return {
                    drafts: posts.map((post: any) => ({
                        id: Math.random().toString(36).substr(2, 9),
                        title: post.type,
                        content: `${post.hook}\n\n${post.body}`,
                        hashtags: post.hashtags || []
                    })),
                    analysis
                };
            }

            console.warn("Unexpected API response:", data);
            return { drafts: [] };

        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    },

    // Update post via N8N Webhook
    updatePost: async (currentContent: string, instruction: string, chatHistory: ChatMessage[] = []): Promise<UpdatePostResponse> => {
        try {
            const response = await fetch(N8N_REFINE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: instruction,
                    post: currentContent,
                    chat_history: chatHistory
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update post');
            }

            const data = await response.json();

            // Handle array response [ { ok: true, final_post: { output: { ... } } } ]
            let output: any;

            if (Array.isArray(data) && data.length > 0) {
                output = data[0]?.final_post?.output;
            } else if (data?.final_post?.output) {
                // Handle object response { ok: true, final_post: { output: { ... } } }
                output = data.final_post.output;
            }

            if (output) {
                const content = output.content || '';
                const summary_message = output.summary_message;
                return { content, summary_message };
            }

            // Fallback for previous schema or error
            console.warn("Unexpected API response format:", data);
            throw new Error("Invalid response format from update API");

        } catch (error) {
            console.error("Refine API Error:", error);
            throw error;
        }
    }
};
