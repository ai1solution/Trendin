import { create } from 'zustand';
import { api, type PostDraft } from '../lib/api';

export type AppMode = 'landing' | 'trending' | 'generating' | 'selection' | 'editor';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface AppState {
    mode: AppMode;
    topic: string;
    drafts: PostDraft[];
    selectedDraft: PostDraft | null;
    isGenerating: boolean;
    isUpdating: boolean;
    chatMessages: ChatMessage[];

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

    setMode: (mode) => set({ mode }),
    setTopic: (topic) => set({ topic }),

    generateDrafts: async (topic) => {
        set({ isGenerating: true, mode: 'generating', topic });
        try {
            const drafts = await api.generateDrafts(topic);
            set({ drafts, isGenerating: false, mode: 'selection' });
        } catch (error) {
            console.error("Failed to generate drafts", error);
            set({ isGenerating: false });
            // Ideally handle error state here
        }
    },

    selectDraft: (draft) => {
        set({
            selectedDraft: draft,
            mode: 'editor',
            chatMessages: [{ role: 'assistant', content: "I'm ready to help you refine this post. What would you like to change?" }]
        });
    },

    setCustomDraft: (content) => {
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

        // Add user message
        const newMessages = [...chatMessages, { role: 'user', content: message } as ChatMessage];
        set({ chatMessages: newMessages, isUpdating: true });

        try {
            // Call API update
            const updatedContent = await api.updatePost(selectedDraft.content, message);

            // Randomized AI responses for variety
            const responses = [
                "I've updated the post based on your request.",
                "Great! I've made those changes to your post.",
                "Done! Your post has been refined.",
                "Perfect! I've applied your suggestions.",
                "Updated! Check out the new version.",
                "All set! I've enhanced your post as requested.",
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            // Update post content
            set((state) => ({
                selectedDraft: state.selectedDraft ? { ...state.selectedDraft, content: updatedContent } : null,
                isUpdating: false,
                chatMessages: [...newMessages, { role: 'assistant', content: randomResponse }]
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
