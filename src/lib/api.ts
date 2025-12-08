export interface PostDraft {
    id: string;
    title: string;
    content: string;
    hashtags: string[];
}

export interface TrendingTopic {
    id: string;
    title: string;
    posts: string;
    difficulty: 'Low' | 'Med' | 'High';
    link?: string; // URL to source article
}

const N8N_GENERATE_URL = 'https://aionesolution-n8n.hf.space/webhook/linkedin-content-automation';
const N8N_REFINE_URL = 'https://aionesolution-n8n.hf.space/webhook/linkedin-content-automation-interact';

export const api = {
    // Fetch real trending topics via Serp API (using Google News for better quality)
    getTrends: async (niche?: string): Promise<TrendingTopic[]> => {
        const apiKey = import.meta.env.VITE_SERP_API_KEY;

        try {
            if (!apiKey || apiKey.includes('placeholder')) {
                console.warn("Serp API Key is missing or placeholder. Returning mock data.");
                // Fallback mock data
                return [
                    { id: '1', title: 'Remote Work Culture', posts: 'via TechCrunch', difficulty: 'Low' },
                    { id: '2', title: 'AI in 2025', posts: 'via Wired', difficulty: 'Med' },
                    { id: '3', title: 'SaaS Growth', posts: 'via Forbes', difficulty: 'High' },
                    { id: '4', title: 'Mental Health', posts: 'via NYT', difficulty: 'Low' },
                    { id: '5', title: 'Productivity Hacks', posts: 'via LifeHacker', difficulty: 'Low' },
                    { id: '6', title: 'Leadership Tips', posts: 'via HBR', difficulty: 'Med' },
                ];
            }

            const url = new URL('https://serpapi.com/search.json');
            url.searchParams.append('engine', 'google_news');
            // Use niche if provided, otherwise use default broad query
            const query = niche ? `${niche} trends` : 'business technology trends';
            url.searchParams.append('q', query);
            url.searchParams.append('gl', 'us');
            url.searchParams.append('hl', 'en');
            url.searchParams.append('api_key', apiKey);

            const response = await fetch(url.toString());

            if (!response.ok) {
                throw new Error('Failed to fetch trends');
            }

            const data = await response.json();
            const newsResults = data?.news_results || [];

            return newsResults.slice(0, 20).map((item: any, index: number) => ({
                id: String(index + 1),
                title: item.title || 'Trending Story',
                posts: item.source?.name ? `via ${item.source.name}` : 'Trending',
                difficulty: index % 3 === 0 ? 'High' : index % 3 === 1 ? 'Med' : 'Low',
                link: item.link || '' // Store the article URL
            }));

        } catch (error) {
            console.error("Failed to fetch trends:", error);
            // Fallback to empty or static list on error to prevent UI crash
            return [];
        }
    },

    // Generate drafts via N8N Webhook
    generateDrafts: async (topic: string): Promise<PostDraft[]> => {
        try {
            const url = new URL(N8N_GENERATE_URL);
            url.searchParams.append('keyword', topic);
            url.searchParams.append('tone', 'Professional');
            url.searchParams.append('length', 'Medium');

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to generate drafts');
            }

            const data = await response.json();

            // Check for payload.output.post_drafts (The structure from user report)
            const deepDrafts = data?.payload?.output?.post_drafts;
            if (Array.isArray(deepDrafts)) {
                return deepDrafts.map((item: any) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    title: item.title,
                    content: item.content,
                    hashtags: item.hashtags || []
                }));
            }

            // Fallbacks for previous known structures
            if (Array.isArray(data)) {
                return data.map((item: any) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    title: item.title,
                    content: item.content,
                    hashtags: item.hashtags || []
                }));
            }

            if (data.output && Array.isArray(data.output)) {
                return data.output.map((item: any) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    title: item.title,
                    content: item.content,
                    hashtags: item.hashtags || []
                }));
            }

            console.warn("Unexpected API response structure:", data);
            return [];

        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    },

    // Update post via N8N Webhook
    updatePost: async (currentContent: string, instruction: string): Promise<string> => {
        try {
            const response = await fetch(N8N_REFINE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: instruction,
                    post: currentContent
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update post');
            }

            const data = await response.json();

            // Handle both object and stringified JSON in payload.output
            let outputData = data?.payload?.output;

            if (typeof outputData === 'string') {
                try {
                    outputData = JSON.parse(outputData);
                } catch (e) {
                    console.error("Failed to parse inner JSON", e);
                    // parsing failed, maybe it's just a raw string message?
                }
            }

            // Valid structure check
            if (outputData?.post_drafts && Array.isArray(outputData.post_drafts) && outputData.post_drafts.length > 0) {
                return outputData.post_drafts[0].content;
            }

            // Check if outputData itself is the string content (edge case)
            if (typeof outputData === 'string') {
                return outputData;
            }

            console.warn("Invalid response format from update API:", data);
            throw new Error("Invalid response format from update API");

        } catch (error) {
            console.error("Refine API Error:", error);
            throw error;
        }
    }
};
