import { Header } from './components/layout/Header';
import { Hero } from './components/home/Hero';
import { TrendingGrid } from './components/home/TrendingGrid';
import { DraftSelection } from './components/editor/DraftSelection';
import { EditorWorkspace } from './components/editor/EditorWorkspace';
import { Footer } from './components/layout/Footer';
import { useAppStore } from './store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';

import { StepIndicator } from './components/layout/StepIndicator';
import { FloatingBackground } from './components/layout/FloatingBackground';

function App() {
  const mode = useAppStore((state) => state.mode);

  return (
    <div className="min-h-screen bg-white text-linkedin-text font-sans selection:bg-linkedin-100 selection:text-linkedin-900 relative overflow-hidden">
      <FloatingBackground />

      <Header />

      <main className="relative z-10 pt-14">
        <div className="sticky top-14 z-40 mb-2 pointer-events-none">
          <div className="pointer-events-auto">
            <StepIndicator />
          </div>
        </div>
        <AnimatePresence mode="wait">
          {mode === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero />
              <TrendingGrid />
            </motion.div>
          )}

          {(mode === 'generating' || mode === 'selection') && (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DraftSelection />
            </motion.div>
          )}

          {mode === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EditorWorkspace />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer - only on landing */}
      {mode === 'landing' && <Footer />}
    </div>
  );
}

export default App;
