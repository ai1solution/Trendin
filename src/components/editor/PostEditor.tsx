import { Copy, Check, Linkedin, Pen, Hash, Type } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import React from 'react';
import { trackEvent } from '../../lib/posthog';
import { cn } from '../../lib/utils'; // Ensure cn is available

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

    if (!selectedDraft) return (
        <div className="flex items-center justify-center h-full bg-gray-50/50">
            <div className="text-center text-gray-400">
                <p>Select a draft to start editing</p>
            </div>
        </div>
    );

    const charCount = selectedDraft.content.length;


    return (
        <div className="flex flex-col h-full bg-[#f8f9fb]">
            {/* Professional Toolbar */}
            <div className="px-6 py-3 bg-white border-b border-gray-200/60 sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 rounded-lg">
                            <Pen className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">Editor</span>
                    </div>
                    <div className="h-4 w-px bg-gray-200" />
                    <div className="flex items-center gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors" title="Bold">
                            <span className="font-bold text-xs">B</span>
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors" title="Italic">
                            <span className="italic font-serif text-xs">I</span>
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors" title="Add Hashtags">
                            <Hash className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400 px-2 transition-opacity duration-300 opacity-60">
                        Autosaved
                    </span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:text-gray-900 transition-all active:scale-95 shadow-sm"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
            </div>

            {/* Editor Surface */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col relative group transition-shadow duration-300 hover:shadow-md">
                    <textarea
                        value={selectedDraft.content}
                        onChange={(e) => updatePostContent(e.target.value)}
                        className="flex-1 w-full p-8 text-lg leading-relaxed resize-none outline-none text-gray-800 font-sans placeholder:text-gray-300 bg-transparent"
                        placeholder="Start writing your viral post..."
                        spellCheck={false}
                    />

                    {/* Bottom fade for extensive scrolling hints if needed, or just cleaner styling */}
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">Pro tip: Use short paragraphs for better readability on mobile.</p>
            </div>

            {/* Footer Status Bar */}
            <div className="px-6 py-3 bg-white border-t border-gray-200/60">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                        <div className="flex items-center gap-2" title="Character Count">
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                charCount > 3000 ? "bg-red-500" : charCount > 1500 ? "bg-amber-500" : "bg-green-500"
                            )} />
                            <span>{charCount} / 3000 chars</span>
                        </div>
                        <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                            <Type className="w-3.5 h-3.5" />
                            <span>{selectedDraft.content.split(/\s+/).filter(w => w.length > 0).length} words</span>
                        </div>
                    </div>

                    <button
                        onClick={handleLinkedinCopy}
                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white transition-all shadow-lg rounded-xl bg-[#0a66c2] hover:bg-[#004182] hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 group"
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
