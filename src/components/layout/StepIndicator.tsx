import { useAppStore, type AppMode } from '../../store/useAppStore';
import { ChevronLeft } from 'lucide-react';

export const StepIndicator = () => {
    const { mode, setMode } = useAppStore();

    const steps = [
        { id: 'landing', label: 'Topic', shortLabel: 'Topic', mode: 'landing' as AppMode },
        { id: 'generating', label: 'Generate', shortLabel: 'Generate', mode: 'selection' as AppMode },
        { id: 'editor', label: 'Refine', shortLabel: 'Refine', mode: 'editor' as AppMode },
    ];

    const activeIndex =
        mode === 'landing' ? 0 :
            (mode === 'generating' || mode === 'selection') ? 1 :
                mode === 'editor' ? 2 : 0;

    // Don't show on landing page
    if (mode === 'landing') return null;

    const handleStepClick = (index: number, stepMode: AppMode) => {
        // Only allow clicking on completed steps or current step
        if (index <= activeIndex) {
            setMode(stepMode);
        }
    };

    const handleBack = () => {
        if (activeIndex === 1) {
            setMode('landing');
        } else if (activeIndex === 2) {
            setMode('selection');
        }
    };

    return (
        <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-4 py-2 sm:py-3 px-2 sm:px-4 bg-white/90 backdrop-blur-sm border-b border-gray-100 overflow-x-auto">
            {/* Back Button */}
            <button
                onClick={handleBack}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm flex-shrink-0"
            >
                <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline">Back</span>
            </button>

            {/* Step Progress - Scrollable on mobile */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                {steps.map((step, index) => {
                    const isActive = index === activeIndex;
                    const isCompleted = index < activeIndex;
                    const isClickable = index <= activeIndex;

                    return (
                        <div key={step.id} className="flex items-center gap-1.5 sm:gap-2">
                            <button
                                onClick={() => handleStepClick(index, step.mode)}
                                disabled={!isClickable}
                                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg transition-all ${isActive
                                        ? 'bg-linkedin-50 border border-linkedin-200'
                                        : isCompleted
                                            ? 'hover:bg-gray-50 border border-transparent cursor-pointer'
                                            : 'border border-transparent cursor-not-allowed opacity-50'
                                    }`}
                            >
                                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${isCompleted ? 'bg-green-500' :
                                        isActive ? 'bg-linkedin-500 scale-125' :
                                            'bg-gray-300'
                                    }`} />
                                <span className={`text-[10px] sm:text-xs font-bold transition-colors whitespace-nowrap ${isActive ? 'text-linkedin-700' :
                                        isCompleted ? 'text-gray-700' :
                                            'text-gray-400'
                                    }`}>
                                    {step.label}
                                </span>
                            </button>
                            {index < steps.length - 1 && (
                                <div className={`w-4 sm:w-8 h-0.5 transition-colors ${index < activeIndex ? 'bg-green-500' : 'bg-gray-200'
                                    }`} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
