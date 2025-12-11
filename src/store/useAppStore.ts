import { create } from 'zustand';
import { api, type PostDraft, type Analysis, type ChatMessage } from '../lib/api';
import { trackEvent } from '../lib/posthog';

export type AppMode = 'landing' | 'trending' | 'generating' | 'selection' | 'editor';

// ChatMessage is now imported from api.ts

interface AppState {
    mode: AppMode;
    topic: string;
    drafts: PostDraft[];
    selectedDraft: PostDraft | null;
    isGenerating: boolean;
    isUpdating: boolean;
    chatMessages: ChatMessage[];
    analysis: Analysis | null;

    // Actions
    setMode: (mode: AppMode) => void;
    setTopic: (topic: string) => void;
    generateDrafts: (topic: string) => Promise<void>;
    selectDraft: (draft: PostDraft) => void;
    setCustomDraft: (content: string) => void;
    updatePostContent: (newContent: string) => void;
    sendChatMessage: (message: string) => Promise<void>;
    reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    mode: 'landing',
    topic: '',
    drafts: [],
    selectedDraft: null,
    isGenerating: false,
    isUpdating: false,
    chatMessages: [],
    analysis: null,

    setMode: (mode) => set({ mode }),
    setTopic: (topic) => set({ topic }),

    generateDrafts: async (topic) => {
        set({ isGenerating: true, mode: 'generating', topic });
        try {
            const { drafts, analysis } = await api.generateDrafts(topic);

            // Track draft generation
            trackEvent({
                name: 'drafts_generated',
                properties: {
                    topic,
                    draft_count: drafts.length,
                    generation_source: 'trending'
                }
            });

            set({ drafts, analysis: analysis || null, isGenerating: false, mode: 'selection' });
        } catch (error) {
            console.error("Failed to generate drafts", error);
            set({ isGenerating: false });
        }
    },

    selectDraft: (draft) => {
        // Track draft selection
        trackEvent({
            name: 'draft_selected',
            properties: {
                draft_title: draft.title,
                draft_index: get().drafts.indexOf(draft)
            }
        });

        // Append hashtags to content if available and NOT already present
        let finalContent = draft.content;
        if (draft.hashtags && draft.hashtags.length > 0) {
            // Filter out undefined/null/empty hashtags and format them
            const formattedHashtags = draft.hashtags
                .filter(tag => tag && typeof tag === 'string' && tag.trim() !== '')
                .map(tag => tag.startsWith('#') ? tag : `#${tag}`);

            if (formattedHashtags.length > 0) {
                const firstHashtag = formattedHashtags[0];

                if (!finalContent.includes(firstHashtag)) {
                    const hashtagString = formattedHashtags.join(' ');
                    finalContent = `${finalContent}\n\n${hashtagString}`;
                }
            }
        }

        set({
            selectedDraft: { ...draft, content: finalContent },
            mode: 'editor',
            chatMessages: [{ role: 'assistant', content: "I'm ready to help you refine this post. What would you like to change?" }]
        });
    },

    setCustomDraft: (content) => {
        // Track custom draft creation
        trackEvent({
            name: 'custom_draft_created',
            properties: {
                has_content: content.trim().length > 0
            }
        });

        set({
            selectedDraft: {
                id: 'custom',
                title: 'Custom Draft',
                content,
                hashtags: []
            },
            mode: 'editor',
            chatMessages: [{ role: 'assistant', content: "I've loaded your draft. How can I help you improve it?" }]
        });
    },

    updatePostContent: (newContent) => {
        const { selectedDraft } = get();
        if (selectedDraft) {
            set({ selectedDraft: { ...selectedDraft, content: newContent } });
        }
    },

    sendChatMessage: async (message) => {
        const { chatMessages, selectedDraft } = get();
        if (!selectedDraft) return;

        // Track AI refinement request
        trackEvent({
            name: 'ai_refinement_requested',
            properties: {
                instruction: message.substring(0, 100), // First 100 chars
                current_post_length: selectedDraft.content.length
            }
        });

        // Add user message
        const newMessages = [...chatMessages, { role: 'user', content: message } as ChatMessage];
        set({ chatMessages: newMessages, isUpdating: true });

        try {
            // Call API update with chat history
            // We now get an object: { content: string, summary_message?: string }
            const result = await api.updatePost(selectedDraft.content, message, chatMessages);
            let updatedContentString = result.content;
            const apiSummary = result.summary_message;

            // Re-append hashtags if they were lost during refinement
            if (selectedDraft.hashtags && selectedDraft.hashtags.length > 0) {
                const formattedHashtags = selectedDraft.hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`);
                const firstHashtag = formattedHashtags[0];

                if (!updatedContentString.includes(firstHashtag)) {
                    const hashtagString = formattedHashtags.join(' ');
                    updatedContentString = `${updatedContentString}\n\n${hashtagString}`;
                }
            }

            // Determine assistant response
            let finalAssistantMessage = apiSummary; // Use API summary if available

            if (!finalAssistantMessage || finalAssistantMessage.trim() === '') {
                // Fallback to randomized AI responses for variety if no summary
                const responses = [
                    "I've updated the post based on your request.",
                    "Great! I've made those changes to your post.",
                    "Done! Your post has been refined.",
                    "Perfect! I've applied your suggestions.",
                    "Updated! Check out the new version.",
                    "All set! I've enhanced your post as requested.",
                ];
                finalAssistantMessage = responses[Math.floor(Math.random() * responses.length)];
            }

            // Update post content
            set((state) => ({
                selectedDraft: state.selectedDraft ? { ...state.selectedDraft, content: updatedContentString } : null,
                isUpdating: false,
                chatMessages: [...newMessages, { role: 'assistant', content: finalAssistantMessage as string }]
            }));
        } catch (error) {
            console.error("Failed to update post", error);
            const errorResponses = [
                "Sorry, I couldn't update the post. Please try again.",
                "Oops! Something went wrong. Mind trying that again?",
                "I encountered an issue. Let's give it another shot.",
            ];
            const randomError = errorResponses[Math.floor(Math.random() * errorResponses.length)];
            set({ isUpdating: false, chatMessages: [...newMessages, { role: 'assistant', content: randomError }] });
        }
    },

    reset: () => set({
        mode: 'landing',
        topic: '',
        drafts: [],
        selectedDraft: null,
        chatMessages: []
    })
}));
