import React, { useState } from 'react';
import {
  Search,
  Trash2,
  Copy,
  Check,
  Volume2,
  Square,
  Clock,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  Filter
} from 'lucide-react';
import { HistoryRecord } from '../types/faq';
import { loadHistory, deleteHistoryItem, clearHistory } from '../utils/historyStorage';
import { speakAnswer, stopSpeaking, copyToClipboard } from '../utils/speech';
import { ActivePage } from './Navbar';

interface HistoryViewProps {
  onNavigate: (page: ActivePage) => void;
  onSelectQuestionToAsk: (question: string) => void;
  onHistoryUpdated?: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onNavigate,
  onSelectQuestionToAsk,
  onHistoryUpdated,
}) => {
  const [historyList, setHistoryList] = useState<HistoryRecord[]>(() => loadHistory());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const refreshHistory = () => {
    const records = loadHistory();
    setHistoryList(records);
    onHistoryUpdated?.();
  };

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    refreshHistory();
  };

  const handleConfirmClear = () => {
    clearHistory();
    setShowClearModal(false);
    refreshHistory();
  };

  const handleCopy = async (id: string, text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleListen = (id: string, text: string) => {
    if (speakingId === id) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(id);
    speakAnswer(
      text,
      () => setSpeakingId(id),
      () => setSpeakingId(null)
    );
  };

  const formatTimestamp = (ts: number): string => {
    const now = Date.now();
    const diffSec = Math.floor((now - ts) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;

    const date = new Date(ts);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter history items by search query and category
  const filteredList = historyList.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.userQuestion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.matchedQuestion.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Question History
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your recent questions and answers.
          </p>
        </div>

        {historyList.length > 0 && (
          <button
            onClick={() => setShowClearModal(true)}
            className="self-start sm:self-center px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/80">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Clear all question history?
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              This action will remove all previously recorded questions and answers from your local storage. This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition-colors cursor-pointer"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {historyList.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 flex items-center justify-center text-indigo-500 dark:text-cyan-400 mb-4 shadow-sm">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            No questions yet.
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Ask Askora something and your recent questions will appear here.
          </p>
          <button
            onClick={() => onNavigate('chat')}
            className="mt-6 px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Ask Askora →</span>
          </button>
        </div>
      ) : (
        <div className="py-6 space-y-5">
          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Field */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your questions…"
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" />
              {['All', 'Technology', 'College & Education', 'Products & Services'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-indigo-600 text-white dark:bg-cyan-500 dark:text-slate-950'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-xs text-slate-400 dark:text-slate-500 px-1 flex items-center justify-between">
            <span>
              Showing {filteredList.length} of {historyList.length} recorded items
            </span>
          </div>

          {/* List of Items */}
          {filteredList.length === 0 ? (
            <div className="text-center py-12 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No matching questions found for &ldquo;{searchQuery}&rdquo;.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredList.map((item) => {
                const isSpeakingThis = speakingId === item.id;
                const isCopiedThis = copiedId === item.id;

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow space-y-3"
                  >
                    {/* Header Row: Category, Confidence, Timestamp, Delete */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Category */}
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.category}
                        </span>

                        {/* Confidence Badge */}
                        {item.confidence === 'HIGH' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                            HIGH CONFIDENCE
                          </span>
                        )}
                        {item.confidence === 'MEDIUM' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300/40">
                            MEDIUM CONFIDENCE
                          </span>
                        )}
                        {item.confidence === 'LOW' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300/40">
                            LOW CONFIDENCE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Time */}
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(item.timestamp)}
                        </span>

                        {/* Delete Single Item */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          aria-label="Delete History Item"
                          className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          title="Delete this record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Question Row */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Your Question:
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        “{item.userQuestion}”
                      </h3>
                      {item.matchedQuestion && item.matchedQuestion !== 'No match found' && item.matchedQuestion !== item.userQuestion && (
                        <p className="text-xs text-indigo-600 dark:text-cyan-400 mt-1 font-medium">
                          Matched FAQ: &ldquo;{item.matchedQuestion}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Answer Box */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800/60">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Best Answer:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                        {item.answer}
                      </p>
                    </div>

                    {/* Action Buttons: Copy, Listen, Ask Again */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(item.id, item.answer)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          {isCopiedThis ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                Copied ✓
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleListen(item.id, item.answer)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            isSpeakingThis
                              ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-cyan-400 font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {isSpeakingThis ? (
                            <>
                              <Square className="w-3.5 h-3.5 fill-current animate-pulse text-indigo-500" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        onClick={() => onSelectQuestionToAsk(item.userQuestion)}
                        className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Ask Again</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
