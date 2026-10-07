import React, { useState } from 'react';
import { Sparkles, MessageSquare, History, Home as HomeIcon, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type ActivePage = 'home' | 'chat' | 'history';

interface NavbarProps {
  currentPage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onScrollToHowItWorks: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onScrollToHowItWorks,
  historyCount,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const handleHowItWorksClick = () => {
    setMobileMenuOpen(false);
    onScrollToHowItWorks();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#090d16]/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 dark:from-white dark:via-cyan-200 dark:to-indigo-300 bg-clip-text text-transparent">
                ASKORA AI
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-300/40 dark:border-cyan-700/50">
                NLP
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block -mt-0.5">
              Ask Naturally. Get the Right Answer.
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/70 dark:bg-slate-900/60 p-1.5 rounded-full border border-slate-200/60 dark:border-slate-800/80">
          <button
            onClick={() => handleNav('home')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 cursor-pointer ${
              currentPage === 'home'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={handleHowItWorksClick}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-150 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            How It Works
          </button>
          <button
            onClick={() => handleNav('chat')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 cursor-pointer ${
              currentPage === 'chat'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Ask AI
          </button>
          <button
            onClick={() => handleNav('history')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 cursor-pointer ${
              currentPage === 'history'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            History
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Action: Theme Toggle & Ask CTA */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150 cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <button
            onClick={() => handleNav('chat')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 shadow-sm shadow-indigo-500/25 transition-all duration-150 cursor-pointer"
          >
            Ask Askora
            <span className="text-white/80">→</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-lg px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => handleNav('home')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
              currentPage === 'home'
                ? 'bg-indigo-50 dark:bg-slate-800/80 text-indigo-600 dark:text-cyan-400'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={handleHowItWorksClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <Sparkles className="w-4 h-4 text-indigo-500 dark:text-cyan-400" />
            How It Works
          </button>
          <button
            onClick={() => handleNav('chat')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
              currentPage === 'chat'
                ? 'bg-indigo-50 dark:bg-slate-800/80 text-indigo-600 dark:text-cyan-400'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Ask AI
          </button>
          <button
            onClick={() => handleNav('history')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${
              currentPage === 'history'
                ? 'bg-indigo-50 dark:bg-slate-800/80 text-indigo-600 dark:text-cyan-400'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <History className="w-4 h-4" />
              Question History
            </div>
            {historyCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
