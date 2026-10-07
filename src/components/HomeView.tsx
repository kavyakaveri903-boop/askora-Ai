import React, { useRef } from 'react';
import { ArrowRight, Brain, Target, Link as LinkIcon, ShieldCheck, Sparkles, MessageSquare, ChevronDown } from 'lucide-react';
import { AbstractNetworkCanvas } from './AbstractNetworkCanvas';
import { AskoraIntelligenceFlow } from './AskoraIntelligenceFlow';
import { ActivePage } from './Navbar';

interface HomeViewProps {
  onNavigate: (page: ActivePage) => void;
  onAskDirectly: (question: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onAskDirectly }) => {
  const howItWorksRef = useRef<HTMLDivElement | null>(null);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sampleQuestions = [
    'I forgot my password. What should I do?',
    'How do I register?',
    'What are the requirements?',
    'Where can I get support?',
    'Can I get a refund?'
  ];

  return (
    <div className="w-full flex flex-col items-center pb-20">
      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 md:pt-20 pb-12 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-bold text-indigo-700 dark:text-cyan-300 shadow-sm mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
          <span>AI-POWERED FAQ ASSISTANT</span>
        </div>

        {/* Brand Callout */}
        <p className="text-xs font-extrabold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-2">
          ✦ ASKORA AI
        </p>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl leading-[1.12]">
          Ask Naturally.{' '}
          <span className="block mt-1 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Get the Answer That Fits.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
          An intelligent FAQ assistant that understands your question and finds the most relevant answer from its knowledge base.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('chat')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-base text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer group hover:scale-[1.02]"
          >
            <span>Ask Askora</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={scrollToHowItWorks}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-base text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>How It Works</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Quick Sample Questions Chips */}
        <div className="mt-10 flex flex-col items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Quick Try Samples
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onAskDirectly(q)}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-cyan-500 hover:text-indigo-600 dark:hover:text-cyan-400 shadow-sm transition-all duration-150 cursor-pointer flex items-center gap-1.5 group"
              >
                <MessageSquare className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-cyan-400" />
                <span>“{q}”</span>
              </button>
            ))}
          </div>
        </div>

        {/* Abstract AI Knowledge Network Visual */}
        <div className="w-full mt-12 md:mt-16">
          <AbstractNetworkCanvas />
        </div>
      </section>

      {/* 4 Feature Cards */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 border-t border-slate-200/60 dark:border-slate-900">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Engineered for Precision & Retrieval
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Real TF-IDF and Cosine Vectorization designed to solve user problems effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🧠</span> Intent-Aware Matching
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Find relevant answers even when questions are phrased differently.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
              Tokenization + Stemming
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🎯</span> Best Match
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Retrieve the closest answer from the FAQ knowledge base.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
              Cosine Similarity Score
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <LinkIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🔗</span> Related Questions
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Explore useful questions connected to your topic.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-mono text-purple-600 dark:text-purple-400">
              Cluster Recommendations
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🛡️</span> Smart Fallback
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Askora avoids guessing when it cannot find a reliable answer.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
              Confidence Thresholds
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS Section — Replaced with Distinctive Askora Intelligence Flow */}
      <section ref={howItWorksRef} id="how-it-works" className="w-full">
        <AskoraIntelligenceFlow />

        {/* Bottom CTA Banner */}
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="mt-4 p-8 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-purple-500/10 border border-indigo-200/60 dark:border-indigo-900/60 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Ready to test Askora AI?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Test password reset, admissions, software access, refunds, and more.
              </p>
            </div>
            <button
              onClick={() => onNavigate('chat')}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <span>Ask Askora →</span>
            </button>
          </div>

          {/* Project Internship Footer Note */}
          <div className="mt-12 text-center text-xs text-slate-400 dark:text-slate-500">
            <p>CodeAlpha Artificial Intelligence Internship • Task 2 – Chatbot for FAQs</p>
            <p className="mt-1 font-mono text-[11px]">Local NLP Engine • Zero External Paid APIs • TF-IDF & Cosine Similarity</p>
          </div>
        </div>
      </section>
    </div>
  );
};
