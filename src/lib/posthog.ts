import posthog from 'posthog-js';

// Initialize PostHog
export const initPostHog = () => {
    const apiKey = import.meta.env.VITE_POSTHOG_KEY;
    const host = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

    if (!apiKey) {
        console.warn('PostHog API key not configured');
        return;
    }

    posthog.init(apiKey, {
        api_host: host,
        loaded: () => {
            if (import.meta.env.DEV) {
                console.log('PostHog loaded');
            }
        },
        capture_pageview: true,
        capture_pageleave: true,
    });
};

// Analytics event types
export type AnalyticsEvent =
    | { name: 'trending_topic_clicked'; properties: { topic_title: string; topic_difficulty: string; niche?: string } }
    | { name: 'niche_filter_selected'; properties: { niche: string; is_custom: boolean } }
    | { name: 'custom_niche_entered'; properties: { niche: string } }
    | { name: 'draft_selected'; properties: { draft_title: string; draft_index: number } }
    | { name: 'try_again_clicked'; properties: {} }
    | { name: 'post_edited'; properties: { edit_type: string } }
    | { name: 'copy_to_linkedin_clicked'; properties: { post_length: number; has_hashtags: boolean } }
    | { name: 'back_to_drafts_clicked'; properties: {} }
    | { name: 'ai_refinement_requested'; properties: { instruction: string; current_post_length: number } }
    | { name: 'ai_suggestion_applied'; properties: { suggestion_type: string } }
    | { name: 'drafts_generated'; properties: { topic: string; draft_count: number; generation_source: 'trending' | 'custom' } }
    | { name: 'custom_draft_created'; properties: { has_content: boolean } };

// Track events
export const trackEvent = <T extends AnalyticsEvent>(event: T) => {
    try {
        if (posthog.__loaded) {
            posthog.capture(event.name, event.properties);
        }
    } catch (error) {
        // Silently fail - analytics shouldn't break the app
        if (import.meta.env.DEV) {
            console.error('Analytics error:', error);
        }
    }
};

// Identify user (optional - only if you have user IDs)
export const identifyUser = (userId: string, traits?: Record<string, any>) => {
    try {
        if (posthog.__loaded) {
            posthog.identify(userId, traits);
        }
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('Analytics identify error:', error);
        }
    }
};

// Reset user (on logout)
export const resetUser = () => {
    try {
        if (posthog.__loaded) {
            posthog.reset();
        }
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('Analytics reset error:', error);
        }
    }
};

export default posthog;
