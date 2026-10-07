import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Copy,
  Check,
  Volume2,
  Square,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Bot,
  User,
  Filter,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { ChatMessage, FAQCategory, MatchResult } from '../types/faq';
import { CATEGORIES, STARTER_SUGGESTIONS } from '../data/faqDataset';
import { findBestMatch, getFallbackSuggestions } from '../utils/nlpEngine';
import { speakAnswer, stopSpeaking, startVoiceRecognition, stopVoiceRecognition, copyToClipboard } from '../utils/speech';
import { saveHistory } from '../utils/historyStorage';

interface ChatViewProps {
  initialQuestion?: string | null;
  onClearInitialQuestion?: () => void;
  onHistoryUpdated?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  initialQuestion,
  onClearInitialQuestion,
  onHistoryUpdated,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | 'All Topics'>('All Topics');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, string>>({});
  const [inputError, setInputError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, feedbackGiven]);

  // Handle pre-filled question passed from Home page quick try
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim().length > 0) {
      handleSend(initialQuestion.trim());
      onClearInitialQuestion?.();
    }
  }, [initialQuestion]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopVoiceRecognition();
    };
  }, []);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : inputValue).trim();

    if (!query) {
      setInputError('Please enter a question.');
      setTimeout(() => setInputError(null), 3000);
      return;
    }

    setInputError(null);
    if (textToSend === undefined) {
      setInputValue('');
    }

    // Stop ongoing speech
    stopSpeaking();
    setSpeakingId(null);

    // 1. Add User Message
    const userMsgId = 'msg-user-' + Date.now();
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    // 2. Execute NLP Matching Engine
    const match: MatchResult = findBestMatch(
      query,
      selectedCategory === 'All Topics' ? null : selectedCategory
    );

    const isLowConfidence = match.confidence === 'LOW';

    // 3. Construct Assistant Message
    const assistantMsgId = 'msg-ai-' + (Date.now() + 1);
    const assistantMessage: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      text: isLowConfidence
        ? "I couldn't find a strong answer in my FAQ knowledge base."
        : match.faq.answer,
      timestamp: Date.now(),
      matchResult: match,
      isFallback: isLowConfidence,
      fallbackSuggestions: isLowConfidence
        ? getFallbackSuggestions(selectedCategory === 'All Topics' ? null : selectedCategory)
        : undefined,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);

    // 4. Save to History (only real Q&A pairs)
    saveHistory({
      id: 'hist-' + Date.now(),
      userQuestion: query,
      matchedQuestion: isLowConfidence ? 'No match found' : match.matchedQuestion,
      answer: isLowConfidence
        ? "I couldn't find a strong answer in my FAQ knowledge base."
        : match.faq.answer,
      category: isLowConfidence
        ? (selectedCategory === 'All Topics' ? 'General' : selectedCategory)
        : match.faq.category,
      confidence: match.confidence,
      score: match.score,
      timestamp: Date.now(),
    });

    onHistoryUpdated?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (messageId: string, answerText: string) => {
    const success = await copyToClipboard(answerText);
    if (success) {
      setCopiedId(messageId);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    }
  };

  const handleSpeak = (messageId: string, answerText: string) => {
    if (speakingId === messageId) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }

    setSpeakingId(messageId);
    const started = speakAnswer(
      answerText,
      () => setSpeakingId(messageId),
      () => setSpeakingId(null)
    );

    if (!started) {
      setSpeakingId(null);
      setVoiceToast('Text-to-speech is unavailable in this environment.');
      setTimeout(() => setVoiceToast(null), 3500);
    }
  };

  const handleFeedback = (messageId: string, type: 'helpful' | 'not_helpful') => {
    setFeedbackGiven(prev => ({
      ...prev,
      [messageId]: 'Thanks for your feedback.',
    }));
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopVoiceRecognition();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    const started = startVoiceRecognition(
      (transcript) => {
        setInputValue(transcript);
        setIsListening(false);
        // Auto submit question once dictated
        handleSend(transcript);
      },
      (errorMsg) => {
        setIsListening(false);
        setVoiceToast(errorMsg);
        setTimeout(() => setVoiceToast(null), 4000);
      },
      () => {
        setIsListening(false);
      }
    );

    if (!started) {
      setIsListening(false);
      setVoiceToast('Voice input is not supported in this browser.');
      setTimeout(() => setVoiceToast(null), 4000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col flex-1 min-h-[calc(100vh-8rem)]">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Ask Askora
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Knowledge Base Ready
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Ask your question in your own words.
          </p>
        </div>

        {/* Topic Selector */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 hidden md:inline">
            FAQ Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as FAQCategory | 'All Topics')}
            aria-label="FAQ Category Filter"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="All Topics">All Topics</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Toast notifications */}
      {voiceToast && (
        <div className="my-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>{voiceToast}</span>
          </div>
          <button
            onClick={() => setVoiceToast(null)}
            className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="flex-1 py-6 space-y-6 overflow-y-auto">
        {/* Welcome Message Card */}
        <div className="flex gap-3.5 max-w-2xl">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="p-4 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
              <p className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                Hi! 👋 I&apos;m Askora AI.
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Ask me a question and I&apos;ll find the most relevant answer from my FAQ knowledge base.
              </p>
            </div>

            {/* Starter Suggested Questions */}
            {messages.length === 0 && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-cyan-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Try asking</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {STARTER_SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(suggestion)}
                      className="text-left text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 hover:border-indigo-400 dark:hover:border-cyan-500 shadow-2xs hover:shadow-sm transition-all duration-150 cursor-pointer"
                    >
                      “{suggestion}”
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Chat Messages */}
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="flex justify-end gap-3 max-w-2xl ml-auto">
                <div className="flex flex-col items-end">
                  <div className="px-4 py-3 rounded-2xl rounded-tr-sm bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-600 dark:to-cyan-600 text-white text-sm font-medium leading-relaxed shadow-sm">
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 mr-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              </div>
            );
          }

          // Assistant Response
          const match = msg.matchResult;
          const isFallback = msg.isFallback;
          const feedbackText = feedbackGiven[msg.id];
          const isSpeakingThis = speakingId === msg.id;
          const isCopiedThis = copiedId === msg.id;

          return (
            <div key={msg.id} className="flex gap-3.5 max-w-2xl">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 text-white">
                <Bot className="w-5 h-5" />
              </div>

              <div className="flex-1 space-y-3">
                {/* Main AI Bubble */}
                <div className="p-4 sm:p-5 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3.5">
                  {/* Top Bar with Best Match and Confidence Badge */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Askora AI
                      </span>
                      {!isFallback && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-cyan-400 border border-indigo-200/60 dark:border-indigo-800/60">
                          Best Match
                        </span>
                      )}
                    </div>

                    {/* Confidence Indicator */}
                    {match && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400 font-medium">Match:</span>
                        {match.confidence === 'HIGH' && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                            HIGH
                          </span>
                        )}
                        {match.confidence === 'MEDIUM' && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300/40">
                            MEDIUM
                          </span>
                        )}
                        {match.confidence === 'LOW' && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300/40">
                            LOW
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Matched FAQ Title */}
                  {!isFallback && match && (
                    <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Matched FAQ:
                      </span>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        “{match.matchedQuestion}”
                      </p>
                    </div>
                  )}

                  {/* The Answer Text */}
                  <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                    {msg.text}
                  </div>

                  {/* Fallback Suggested Questions when confidence is LOW */}
                  {isFallback && msg.fallbackSuggestions && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                        Try asking one of these:
                      </p>
                      <div className="space-y-1.5">
                        {msg.fallbackSuggestions.map((faq) => (
                          <button
                            key={faq.id}
                            onClick={() => handleSend(faq.question)}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 hover:border-indigo-400 dark:hover:border-cyan-500 transition-colors duration-150 cursor-pointer flex items-center justify-between group"
                          >
                            <span>“{faq.question}”</span>
                            <span className="text-[11px] text-indigo-500 dark:text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                              Ask →
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions Bar Under Every Answer: Copy, Listen, Helpful, Not Helpful */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {/* Copy Action */}
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        aria-label="Copy Answer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Copy answer to clipboard"
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

                      {/* Listen / TTS Action */}
                      <button
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        aria-label="Listen to Answer"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isSpeakingThis
                            ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-cyan-400 font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title="Listen using text-to-speech"
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

                    {/* Feedback Action: Helpful / Not Helpful */}
                    <div className="flex items-center gap-1">
                      {feedbackText ? (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 px-2 py-0.5">
                          {feedbackText}
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleFeedback(msg.id, 'helpful')}
                            aria-label="Mark Answer as Helpful"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                            title="Helpful"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Helpful</span>
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, 'not_helpful')}
                            aria-label="Mark Answer as Not Helpful"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                            title="Not Helpful"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Not Helpful</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Related Questions Recommendation (Clickable) */}
                {!isFallback && match && match.relatedFaqs && match.relatedFaqs.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-100/60 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
                      You may also want to ask:
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {match.relatedFaqs.map((rel) => (
                        <button
                          key={rel.id}
                          onClick={() => handleSend(rel.question)}
                          className="text-left p-2 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 hover:border-indigo-300 dark:hover:border-cyan-500 shadow-2xs transition-all duration-150 cursor-pointer flex items-center justify-between group"
                        >
                          <span>“{rel.question}”</span>
                          <span className="text-[11px] text-indigo-500 dark:text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                            Ask →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Error Message */}
      {inputError && (
        <div className="mb-2 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs font-medium flex items-center gap-1.5 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{inputError}</span>
        </div>
      )}

      {/* Bottom Sticky Question Input */}
      <div className="sticky bottom-2 z-10 w-full pt-2 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent dark:from-[#090d16] dark:via-[#090d16]/90 dark:to-transparent">
        <div className="relative flex items-center p-1.5 sm:p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg shadow-indigo-500/5 focus-within:border-indigo-500 dark:focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          {/* Voice Input Microphone Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            aria-label={isListening ? 'Stop voice recording' : 'Start voice input'}
            className={`p-2.5 rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-center ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                : 'text-slate-500 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Voice input (Dictate question)'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (inputError) setInputError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? 'Listening to your voice...'
                : 'Ask a question in your own words…'
            }
            className="flex-1 px-3 py-2 text-sm bg-transparent border-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSend()}
            aria-label="Send Question"
            disabled={inputValue.trim().length === 0}
            className={`p-2.5 rounded-xl font-bold transition-all duration-150 flex items-center justify-center cursor-pointer ${
              inputValue.trim().length > 0
                ? 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 hover:scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
            title="Send question (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between px-3 pt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
          <span>Press Enter to send</span>
          <span>TF-IDF + Cosine Matching</span>
        </div>
      </div>
    </div>
  );
};
