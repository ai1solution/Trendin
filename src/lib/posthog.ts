import posthog from 'posthog-js';

// Capture browser session information
const captureBrowserInfo = () => {
    return {
        // Screen information
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        screen_color_depth: window.screen.colorDepth,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,

        // Browser information
        user_agent: navigator.userAgent,
        language: navigator.language,
        languages: navigator.languages,
        platform: navigator.platform,

        // Timezone
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezone_offset: new Date().getTimezoneOffset(),

        // Device information
        device_memory: (navigator as any).deviceMemory || 'unknown',
        hardware_concurrency: navigator.hardwareConcurrency || 'unknown',

        // Connection information (if available)
        connection_type: (navigator as any).connection?.effectiveType || 'unknown',
        connection_downlink: (navigator as any).connection?.downlink || 'unknown',
    };
};

// Capture source/referral information
const captureSourceInfo = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer;

    return {
        // Landing page
        landing_page: window.location.href,
        landing_pathname: window.location.pathname,
        landing_search: window.location.search,
        landing_hash: window.location.hash,

        // UTM parameters
        utm_source: urlParams.get('utm_source') || undefined,
        utm_medium: urlParams.get('utm_medium') || undefined,
        utm_campaign: urlParams.get('utm_campaign') || undefined,
        utm_term: urlParams.get('utm_term') || undefined,
        utm_content: urlParams.get('utm_content') || undefined,

        // Referrer information
        referrer: referrer || 'direct',
        referrer_domain: referrer ? new URL(referrer).hostname : 'direct',

        // Other common tracking parameters
        gclid: urlParams.get('gclid') || undefined, // Google Ads
        fbclid: urlParams.get('fbclid') || undefined, // Facebook Ads
        ref: urlParams.get('ref') || undefined, // Generic referral
    };
};

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

            // Capture initial visit information
            captureInitialVisit();
        },
        capture_pageview: true,
        capture_pageleave: true,

        // Enable session recording (optional - remove if privacy concerns)
        // session_recording: {
        //     maskAllInputs: true,
        //     maskTextSelector: '*',
        // },

        // Autocapture settings
        autocapture: {
            dom_event_allowlist: ['click', 'submit'], // Only capture clicks and form submits
            url_allowlist: [], // Capture all URLs
            element_allowlist: ['a', 'button', 'form', 'input', 'select', 'textarea'],
        },

        // Property sanitization
        sanitize_properties: (properties) => {
            // Remove any sensitive data if needed
            return properties;
        },
    });
};

// Capture initial visit with all browser and source info
export const captureInitialVisit = () => {
    try {
        if (posthog.__loaded) {
            const browserInfo = captureBrowserInfo();
            const sourceInfo = captureSourceInfo();

            // Set user properties (these persist across sessions)
            posthog.register({
                ...browserInfo,
            });

            // Track the initial visit event with source information
            posthog.capture('initial_visit', {
                ...sourceInfo,
                visit_timestamp: new Date().toISOString(),
            });

            // Also set person properties (useful for user segmentation)
            posthog.people?.set({
                first_visit: new Date().toISOString(),
                ...browserInfo,
            });

            if (import.meta.env.DEV) {
                console.log('Initial visit captured:', { browserInfo, sourceInfo });
            }
        }
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('Error capturing initial visit:', error);
        }
    }
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
