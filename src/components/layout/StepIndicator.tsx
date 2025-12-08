import { useAppStore } from '../../store/useAppStore';

export const StepIndicator = () => {
    const mode = useAppStore((state) => state.mode);

    const steps = [
        { id: 'landing', label: 'Topic' },
        { id: 'generating', label: 'Generate' },
        { id: 'editor', label: 'Refine' },
    ];

    const activeIndex =
        mode === 'landing' ? 0 :
            (mode === 'generating' || mode === 'selection') ? 1 :
                mode === 'editor' ? 2 : 0;

    // Don't show on landing page
    if (mode === 'landing') return null;

    return (
        <div className="flex items-center justify-center gap-2 py-2">
            {steps.map((step, index) => {
                const isActive = index === activeIndex;
                const isCompleted = index < activeIndex;

                return (
                    <div key={step.id} className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full transition-all ${isCompleted ? 'bg-success-500' :
                                    isActive ? 'bg-linkedin-500 scale-125' :
                                        'bg-gray-300'
                                }`} />
                            <span className={`text-xs font-medium transition-colors ${isActive ? 'text-linkedin-600' :
                                    isCompleted ? 'text-gray-600' :
                                        'text-gray-400'
                                }`}>
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="w-4 h-px bg-gray-200" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
