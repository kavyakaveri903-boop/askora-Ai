import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Brain,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Link as LinkIcon
} from 'lucide-react';
import { AIKnowledgePath } from './AIKnowledgePath';

export const AskoraIntelligenceFlow: React.FC = () => {
  // Interactive Demo State
  const [demoState, setDemoState] = useState<'idle' | 'understanding' | 'matching' | 'resolved'>('resolved');
  const [activeScenario, setActiveScenario] = useState<'password' | 'unrelated'>('password');
  const [activePathStep, setActivePathStep] = useState<number>(4);

  // Auto-progression or replay for Demo
  const triggerDemo = (scenario: 'password' | 'unrelated') => {
    setActiveScenario(scenario);
    setDemoState('understanding');
    setActivePathStep(1);

    setTimeout(() => {
      setDemoState('matching');
      setActivePathStep(2);

      setTimeout(() => {
        setDemoState('resolved');
        setActivePathStep(scenario === 'password' ? 4 : 3);
      }, 1000);
    }, 1000);
  };

  useEffect(() => {
    // initial state is resolved
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 border-t border-slate-200/80 dark:border-slate-800/80">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-cyan-300 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
          <span>ASKORA INTELLIGENCE FLOW</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How Askora Delivers the Right Answer
        </h2>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Unlike static keyword-matching bots, Askora analyzes sentence structure, intent, and semantic similarity to connect your natural question to verified knowledge.
        </p>
      </div>

      {/* UNIQUE VISUAL: Animated AI Knowledge Path with flowing glowing particles */}
      <AIKnowledgePath activeStep={activePathStep} />

      {/* The 5-Step Askora Intelligence Flow */}
      <div className="mt-12 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
          <span className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
            05 Core Stages of Cognitive Retrieval
          </span>
          <span className="text-xs font-semibold text-indigo-600 dark:text-cyan-400">
            Intelligent Pipeline
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* 01 — ASK NATURALLY */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300">
                01 — ASK NATURALLY
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
                Ask in your own words
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                User can ask the question in their own words. No rigid syntax required.
              </p>
            </div>
            <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 italic font-medium">
              “I forgot my password. What can I do?”
            </div>
          </div>

          {/* 02 — UNDERSTAND INTENT */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                02 — UNDERSTAND INTENT
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
                NLP Intent Parsing
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Askora analyzes the user&apos;s wording using tokenization, stop-word removal, and stem unification.
              </p>
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
              <Brain className="w-3.5 h-3.5" />
              <span>Intent: Password Reset</span>
            </div>
          </div>

          {/* 03 — FIND THE BEST MATCH */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                03 — FIND BEST MATCH
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
                TF-IDF + Cosine Matching
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Compares the question vector with the FAQ knowledge base.
              </p>
            </div>
            {/* Visual: User Question ↓ FAQ Knowledge Base ↓ Best Match */}
            <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/60 dark:border-slate-800 text-[11px] text-center font-medium space-y-1">
              <div className="text-slate-700 dark:text-slate-300 font-bold">User Question</div>
              <div className="text-indigo-500 dark:text-cyan-400 font-bold">↓</div>
              <div className="text-slate-600 dark:text-slate-400 text-[10px]">FAQ Knowledge Base</div>
              <div className="text-indigo-500 dark:text-cyan-400 font-bold">↓</div>
              <div className="text-purple-600 dark:text-purple-400 font-bold">Best Match</div>
            </div>
          </div>

          {/* 04 — CONFIDENCE CHECK */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400/50 dark:border-emerald-600/50 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                  04 — CONFIDENCE CHECK
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                  Unique
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
                Match Strength Guard
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Askora guards against hallucination by categorizing confidence:
              </p>
            </div>
            <div className="mt-3 space-y-1.5 text-[10px] font-medium">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                <span>🟢</span>
                <span className="font-bold">HIGH MATCH:</span>
                <span>Strong answer found</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300">
                <span>🟡</span>
                <span className="font-bold">MEDIUM:</span>
                <span>Possible answer found</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300">
                <span>🔴</span>
                <span className="font-bold">LOW MATCH:</span>
                <span>No reliable answer</span>
              </div>
            </div>
          </div>

          {/* 05 — SMART ANSWER */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300">
                05 — SMART ANSWER
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
                Answer & Related Topics
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Returns the verified answer, then proactively recommends:
              </p>
            </div>
            <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/60 dark:border-slate-800 text-[11px] space-y-1">
              <span className="font-bold text-indigo-600 dark:text-cyan-400 block">
                “You may also want to ask:”
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[10px]">
                Displays 2–3 related FAQ questions to explore next.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* UNIQUE FEATURE CALLOUT: "Why Askora is Different" */}
      <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border-2 border-indigo-200 dark:border-indigo-800/80 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              Why Askora is Different
            </h3>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            Askora doesn&apos;t require exact FAQ wording and doesn&apos;t guess when it isn&apos;t confident. It finds the closest knowledge match, evaluates the match strength, and guides the user toward better questions.
          </p>
        </div>

        {/* 3 Highlighted Labels */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full lg:w-auto">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 shadow-2xs text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="text-base">🧠</span>
            <span>Understands natural questions</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 shadow-2xs text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="text-base">🎯</span>
            <span>Checks answer confidence</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 shadow-2xs text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="text-base">🔗</span>
            <span>Suggests related questions</span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE DEMO: "See Askora in Action" */}
      <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-cyan-300">
                Example AI Flow
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                See Askora in Action
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Visual simulation of the internal natural language retrieval pipeline.
            </p>
          </div>

          {/* Scenario Selectors */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerDemo('password')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeScenario === 'password'
                  ? 'bg-indigo-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>Scenario A: Strong Match</span>
            </button>
            <button
              onClick={() => triggerDemo('unrelated')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeScenario === 'unrelated'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>Scenario B: Low Match Fallback</span>
            </button>
            <button
              onClick={() => triggerDemo(activeScenario)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
              title="Replay Flow"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Demo Content Simulation */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* User Question */}
          <div className="md:col-span-5 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              User asks:
            </span>
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 shadow-xs">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {activeScenario === 'password'
                  ? '“I can’t remember my password.”'
                  : '“Can you bake a chocolate cake for me?”'}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                Natural colloquial phrasing (not standard keyword)
              </span>
            </div>

            {/* Animation Steps */}
            <div className="space-y-2 pt-2">
              <div
                className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium transition-all ${
                  demoState === 'understanding' || demoState === 'matching' || demoState === 'resolved'
                    ? 'bg-indigo-100/70 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-400'
                }`}
              >
                <Brain className={`w-4 h-4 ${demoState === 'understanding' ? 'animate-spin' : ''}`} />
                <span>Understanding...</span>
                {(demoState === 'matching' || demoState === 'resolved') && (
                  <span className="ml-auto text-[10px] font-bold text-indigo-600 dark:text-indigo-300">
                    {activeScenario === 'password' ? 'Intent: Password Reset' : 'Intent: Unrecognized'}
                  </span>
                )}
              </div>

              <div
                className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium transition-all ${
                  demoState === 'matching' || demoState === 'resolved'
                    ? 'bg-purple-100/70 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
                    : 'text-slate-400'
                }`}
              >
                <Search className={`w-4 h-4 ${demoState === 'matching' ? 'animate-bounce' : ''}`} />
                <span>Finding best match...</span>
                {demoState === 'resolved' && (
                  <span className="ml-auto text-[10px] font-bold text-purple-600 dark:text-purple-300">
                    Vectorized
                  </span>
                )}
              </div>

              <div
                className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold transition-all ${
                  demoState === 'resolved'
                    ? activeScenario === 'password'
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                    : 'text-slate-400'
                }`}
              >
                {activeScenario === 'password' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>High Match ✓</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>Low Match • Safeguard Triggered</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Divider Arrow */}
          <div className="hidden md:flex md:col-span-1 justify-center text-slate-300 dark:text-slate-700 text-2xl font-bold">
            ➔
          </div>

          {/* Assistant Output Result */}
          <div className="md:col-span-6 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Askora Response Output:
            </span>

            {activeScenario === 'password' ? (
              /* Scenario A: Password Reset Success */
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-cyan-400 border border-indigo-200/60 dark:border-indigo-800">
                    Password Reset
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                    🟢 HIGH MATCH
                  </span>
                </div>

                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                  “You can reset your password using the Forgot Password option on the login screen.”
                </p>

                {/* Related Questions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-indigo-500" />
                    Related Questions:
                  </span>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pl-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      <span>How do I change my password?</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      <span>What if I can’t access my email?</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      <span>Where can I update my account details?</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              /* Scenario B: Low Match Fallback */
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-rose-200 dark:border-rose-900/50 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                    Fallback Guard
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300">
                    🔴 LOW MATCH
                  </span>
                </div>

                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                  “I couldn&apos;t find a reliable answer in my FAQ knowledge base.”
                </p>

                {/* Try Asking One of These */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                    Try asking one of these:
                  </span>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pl-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span>Where can I contact support?</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span>How do I reset my password?</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span>What are the requirements?</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
