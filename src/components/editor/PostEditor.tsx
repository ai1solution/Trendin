import { Copy, Check, Linkedin, Pen } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import React from 'react';
import { trackEvent } from '../../lib/posthog';

export const PostEditor = () => {
    const { selectedDraft, updatePostContent } = useAppStore();
    const [copied, setCopied] = React.useState(false);
    const [linkedinCopied, setLinkedinCopied] = React.useState(false);

    // Copy to clipboard
    const handleCopy = () => {
        if (selectedDraft) {
            navigator.clipboard.writeText(selectedDraft.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // LinkedIn button - copy and show confirmation
    const handleLinkedinCopy = () => {
        if (selectedDraft) {
            // Track copy to LinkedIn
            trackEvent({
                name: 'copy_to_linkedin_clicked',
                properties: {
                    post_length: selectedDraft.content.length,
                    has_hashtags: selectedDraft.hashtags.length > 0
                }
            });

            navigator.clipboard.writeText(selectedDraft.content);
            setLinkedinCopied(true);
            setTimeout(() => setLinkedinCopied(false), 2000);
        }
    };

    if (!selectedDraft) return null;

    const charCount = selectedDraft.content.length;
    const isOptimalLength = charCount >= 100 && charCount <= 300;

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-linkedin-50">
                        <Pen className="w-4 h-4 text-linkedin-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold font-display text-linkedin-text">Post Editor</h3>
                        <p className="text-xs font-medium text-gray-500">Refine and perfect your content</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-2.5 text-gray-500 transition-all rounded-xl hover:bg-linkedin-50 hover:text-linkedin-600 active:scale-95"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check className="w-4 h-4 text-success-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-gray-50/50">
                <textarea
                    value={selectedDraft.content}
                    onChange={(e) => updatePostContent(e.target.value)}
                    className="w-full h-full text-base leading-loose resize-none outline-none text-linkedin-text bg-transparent font-sans placeholder:text-gray-300 selection:bg-linkedin-100"
                    placeholder="Start writing your LinkedIn post..."
                    spellCheck={false}
                />
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${isOptimalLength ? 'bg-success-500' : charCount > 300 ? 'bg-energy-500' : 'bg-gray-400'}`} />
                        <span className="text-xs font-semibold text-gray-600">
                            {charCount} characters
                        </span>
                        {isOptimalLength && (
                            <span className="px-2 py-0.5 text-[10px] font-bold text-success-700 uppercase bg-success-50 rounded border border-success-100">
                                Optimal
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleLinkedinCopy}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white transition-all shadow-lg rounded-xl bg-gradient-linkedin hover:shadow-xl hover:shadow-linkedin-500/25 active:scale-95 group"
                    >
                        {linkedinCopied ? (
                            <>
                                <Check className="w-4 h-4" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Linkedin className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
                                Post to LinkedIn
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
