import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const Header = () => {
    const { setMode } = useAppStore();
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-soft'
                : 'bg-white/80 backdrop-blur-md border-b border-gray-100/50'
            }`}>
            <div className="container px-4 mx-auto md:px-6">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <button
                        onClick={() => setMode('landing')}
                        className="flex items-center gap-2.5 group"
                    >
                        <div className="relative w-8 h-8 transition-transform group-hover:scale-105">
                            <img
                                src="/logo.png"
                                alt="Trendin"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-linkedin-text font-display group-hover:text-linkedin-500 transition-colors">
                            Trendin
                        </span>
                    </button>

                    {/* Desktop CTA */}
                    <div className="hidden md:block">
                        <button
                            onClick={() => {
                                document.getElementById('trending-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-5 py-2 text-sm font-bold text-white transition-all rounded-lg bg-gradient-linkedin hover:shadow-lg hover:shadow-linkedin-500/20 active:scale-95 hover:scale-105"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
