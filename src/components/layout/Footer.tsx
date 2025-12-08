export const Footer = () => {
    return (
        <footer className="border-t border-gray-100/50 bg-white/80 backdrop-blur-sm mt-16">
            <div className="container px-4 py-8 mx-auto max-w-7xl">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    {/* Brand */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7">
                            <img
                                src="/logo.png"
                                alt="Trendin"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="text-sm font-bold text-linkedin-text font-display">
                            Trendin
                        </span>
                    </div>

                    <p className="text-xs font-medium text-gray-500">
                        © 2025 Trendin. Built for LinkedIn success.
                    </p>
                </div>
            </div>
        </footer>
    );
};
