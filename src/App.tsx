import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar, ActivePage } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ChatView } from './components/ChatView';
import { HistoryView } from './components/HistoryView';
import { loadHistory } from './utils/historyStorage';

function MainApp() {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState<ActivePage>('home');
  const [initialQuestion, setInitialQuestion] = useState<string | null>(null);
  const [historyCount, setHistoryCount] = useState<number>(0);

  const updateHistoryCount = () => {
    const list = loadHistory();
    setHistoryCount(list.length);
  };

  useEffect(() => {
    updateHistoryCount();
  }, []);

  const handleAskDirectly = (question: string) => {
    setInitialQuestion(question);
    setCurrentPage('chat');
  };

  const handleScrollToHowItWorks = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById('how-it-works');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      const el = document.getElementById('how-it-works');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''} bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200`}>
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onScrollToHowItWorks={handleScrollToHowItWorks}
        historyCount={historyCount}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {currentPage === 'home' && (
          <HomeView
            onNavigate={(page) => setCurrentPage(page)}
            onAskDirectly={handleAskDirectly}
          />
        )}

        {currentPage === 'chat' && (
          <ChatView
            initialQuestion={initialQuestion}
            onClearInitialQuestion={() => setInitialQuestion(null)}
            onHistoryUpdated={updateHistoryCount}
          />
        )}

        {currentPage === 'history' && (
          <HistoryView
            onNavigate={(page) => setCurrentPage(page)}
            onSelectQuestionToAsk={handleAskDirectly}
            onHistoryUpdated={updateHistoryCount}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
