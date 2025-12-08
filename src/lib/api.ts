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
    link?: string;
}

const N8N_GENERATE_URL = 'https://aionesolution-n8n.hf.space/webhook/linkedin-content-automation';
const N8N_REFINE_URL = 'https://aionesolution-n8n.hf.space/webhook/linkedin-content-automation-interact';

// Mock data for trending topics
const getMockDataForNiche = (niche?: string): TrendingTopic[] => {
    const baseTopics = [
        { id: '1', title: 'The Future of Remote Work in 2025', posts: 'via Forbes', difficulty: 'Med' as const, link: 'https://www.forbes.com' },
        { id: '2', title: 'AI Revolutionizing Healthcare Systems', posts: 'via TechCrunch', difficulty: 'High' as const, link: 'https://techcrunch.com' },
        { id: '3', title: 'Sustainable Business Practices Gain Momentum', posts: 'via Bloomberg', difficulty: 'Med' as const, link: 'https://www.bloomberg.com' },
        { id: '4', title: 'Cybersecurity Threats in Modern Enterprises', posts: 'via Wired', difficulty: 'High' as const, link: 'https://www.wired.com' },
        { id: '5', title: 'The Rise of No-Code Development Platforms', posts: 'via VentureBeat', difficulty: 'Low' as const, link: 'https://venturebeat.com' },
        { id: '6', title: 'Marketing Automation Trends for 2025', posts: 'via HubSpot', difficulty: 'Low' as const, link: 'https://www.hubspot.com' },
        { id: '7', title: 'Financial Technology Breaking Traditional Banking', posts: 'via WSJ', difficulty: 'High' as const, link: 'https://www.wsj.com' },
        { id: '8', title: 'Leadership Strategies for Hybrid Teams', posts: 'via HBR', difficulty: 'Med' as const, link: 'https://hbr.org' },
        { id: '9', title: 'E-commerce Personalization Through AI', posts: 'via Shopify', difficulty: 'Low' as const, link: 'https://www.shopify.com' },
        { id: '10', title: 'Data Privacy Regulations Impact on Business', posts: 'via MIT Tech Review', difficulty: 'High' as const, link: 'https://www.technologyreview.com' },
        { id: '11', title: 'Cloud Computing Cost Optimization Strategies', posts: 'via AWS', difficulty: 'Med' as const, link: 'https://aws.amazon.com' },
        { id: '12', title: 'Mental Health in the Workplace', posts: 'via Psychology Today', difficulty: 'Low' as const, link: 'https://www.psychologytoday.com' },
        { id: '13', title: 'Blockchain Applications Beyond Cryptocurrency', posts: 'via CoinDesk', difficulty: 'High' as const, link: 'https://www.coindesk.com' },
        { id: '14', title: 'Customer Success Metrics That Matter', posts: 'via Gainsight', difficulty: 'Low' as const, link: 'https://www.gainsight.com' },
        { id: '15', title: 'Product Management Best Practices', posts: 'via ProductBoard', difficulty: 'Med' as const, link: 'https://www.productboard.com' },
        { id: '16', title: 'UX Design Trends Shaping Digital Products', posts: 'via Smashing Magazine', difficulty: 'Low' as const, link: 'https://www.smashingmagazine.com' },
        { id: '17', title: 'Sales Enablement Through Technology', posts: 'via Salesforce', difficulty: 'Med' as const, link: 'https://www.salesforce.com' },
        { id: '18', title: 'HR Technology Transforming Recruitment', posts: 'via SHRM', difficulty: 'Med' as const, link: 'https://www.shrm.org' },
        { id: '19', title: 'Real Estate Tech Disrupting Property Markets', posts: 'via Inman', difficulty: 'High' as const, link: 'https://www.inman.com' },
        { id: '20', title: 'Educational Technology Innovations', posts: 'via EdSurge', difficulty: 'Low' as const, link: 'https://www.edsurge.com' },
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
            const n8nUrl = 'https://aionesolution-n8n.hf.space/webhook/trendin-trends';
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
            if (result.data && Array.isArray(result.data) && result.data.length > 0) {
                return result.data;
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

            const deepDrafts = data?.payload?.output?.post_drafts;
            if (Array.isArray(deepDrafts)) {
                return deepDrafts.map((item: any) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    title: item.title,
                    content: item.content,
                    hashtags: item.hashtags || []
                }));
            }

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
            let outputData = data?.payload?.output;

            if (typeof outputData === 'string') {
                try {
                    outputData = JSON.parse(outputData);
                } catch (e) {
                    console.error("Failed to parse inner JSON", e);
                }
            }

            if (outputData?.post_drafts && Array.isArray(outputData.post_drafts) && outputData.post_drafts.length > 0) {
                return outputData.post_drafts[0].content;
            }

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
