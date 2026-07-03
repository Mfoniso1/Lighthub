'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PanicModePage() {
  const [schedule, setSchedule] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [pastQuestionsText, setPastQuestionsText] = useState("");

  useEffect(() => {
    fetchPanicData();
  }, []);

  const fetchPanicData = async () => {
    try {
      setLoading(true);
      const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || '';
      const res = await fetch(`${API_BASE}/api/panic-mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: 'cos141',
          past_questions_text: pastQuestionsText
        })
      });
      if (!res.ok) throw new Error("Failed to load Panic Mode metrics");
      const data = await res.json();
      setSchedule(data.schedule || []);
      setSnippets(data.snippets || []);
      setFlashcards(data.flashcards || []);
      setCardIndex(0);
      setIsFlipped(false);
    } catch (err) {
      console.error("Panic fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextCard = () => {
    if (flashcards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCardIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const toggleTask = (index) => {
    setSchedule(prev => prev.map((item, idx) => 
      idx === index ? { ...item, complete: !item.complete } : item
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      
      {/* EMERGENCY CRISIS HEADER */}
      <header className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 text-white shadow-md sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl animate-pulse">🚨</span>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">PANIC SURVIVAL ROOM: COS 141</h1>
              <p className="text-xxs text-rose-100 font-medium">Vector space summaries generated into urgent revision checklists.</p>
            </div>
          </div>
          <Link 
            href="/course/cos141" 
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition text-center w-full sm:w-auto shrink-0"
          >
            ← Exit Crisis Room
          </Link>
        </div>
      </header>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
          <div className="text-5xl animate-spin text-rose-600">🚨</div>
          <h2 className="text-sm font-black uppercase text-slate-700">Assembling emergency revision guide...</h2>
          <p className="text-xs text-slate-400">Comparing past question patterns and scanning knowledge gaps...</p>
        </div>
      ) : (
        /* CORE THREE-PANEL COMPACT SYSTEM */
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
          
          {/* COLUMN 1: 48-HOUR TIME-BOXED SCHEDULER & CHEAT SHEETS */}
          <main className="flex-1 space-y-6">
            
            {/* Timeline Block */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">48-Hour Survival Countdown</h2>
                <p className="text-xs text-slate-500 mt-0.5">Time-boxed tasks for remaining study sessions.</p>
              </div>

              <div className="relative border-l-2 border-slate-200 ml-2 pl-4 space-y-5">
                {schedule.map((block, idx) => (
                  <div key={idx} className="relative group">
                    <div className={`absolute -left-[23px] top-1.5 h-3 w-3 rounded-full border-2 bg-white transition-all ${
                      block.complete ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 group-hover:border-rose-500'
                    }`} />
                    
                    <div className={`p-3 rounded-xl border transition-all ${
                      block.complete ? 'bg-slate-50/70 border-slate-100 opacity-60' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div>
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
                            {block.time}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 mt-1">{block.phase}</h4>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{block.task}</p>
                        </div>
                        <button 
                          onClick={() => toggleTask(idx)}
                          className={`text-xxs font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg border transition self-start sm:self-auto ${
                            block.complete 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          {block.complete ? '✓ Done' : 'Mark Ready'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick High-Yield Cheat Notes Summary */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">High-Yield Content Snippets</h2>
                <p className="text-xs text-slate-500 mt-0.5">Key term definitions extracted from your vector space.</p>
              </div>
              <div className="space-y-3">
                {snippets.map((summary) => (
                  <div key={summary.id} className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/10">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                      <span className="text-rose-500">📌</span> {summary.topic}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{summary.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* COLUMN 2: PAST QUESTIONS INGESTION & ACTIVE RECALL FLASHCARDS */}
          <aside className="w-full lg:w-[400px] shrink-0 space-y-6">
            
            {/* PAST QUESTIONS BOX */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">Past Question Helper</h2>
                <p className="text-xs text-slate-500 mt-0.5">Paste text or questions to focus the priority schedule.</p>
              </div>
              <textarea
                value={pastQuestionsText}
                onChange={(e) => setPastQuestionsText(e.target.value)}
                placeholder="E.g. UNN Data Structures 2024 Exam: Q1. Explain bios vectors. Q2. What is CMOS clock drift?"
                className="w-full h-24 rounded-xl border-slate-200 text-xs p-3 focus:ring-rose-500 focus:border-rose-500"
              />
              <button
                onClick={fetchPanicData}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Re-generate Crisis Schedule
              </button>
            </div>

            {/* THE FLASHCARD CONTAINER */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">Active Recall Matrix</h2>
                <p className="text-xs text-slate-500 mt-0.5">Test comprehension via interactive self-assessments.</p>
              </div>

              {flashcards.length === 0 ? (
                <div className="text-xs text-slate-450 italic p-6 text-center">No flashcards available.</div>
              ) : (
                <>
                  <div 
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`min-h-[260px] rounded-2xl border cursor-pointer p-5 flex flex-col justify-between shadow-sm transform transition-all duration-300 ${
                      isFlipped 
                        ? 'bg-slate-900 text-white border-slate-800 rotate-1' 
                        : 'bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300 hover:bg-slate-100/30 -rotate-1'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isFlipped ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isFlipped ? '🧠 Core Answer Key' : '❓ Crisis Prompt'}
                      </span>
                      
                      <p className={`mt-6 text-xs font-bold leading-relaxed tracking-tight ${
                        isFlipped ? 'text-slate-200' : 'text-slate-900'
                      }`}>
                        {isFlipped ? flashcards[cardIndex]?.answer : flashcards[cardIndex]?.question}
                      </p>
                    </div>

                    <div className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 pt-4 border-t border-dashed border-slate-300/40">
                      {isFlipped ? 'Tap inside card to hide answer' : 'Tap inside card to reveal answer'}
                    </div>
                  </div>

                  {/* METRIC CARD BAR */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-semibold text-slate-400">
                      Card {cardIndex + 1} of {flashcards.length}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextCard();
                      }}
                      className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm"
                    >
                      Next Card →
                    </button>
                  </div>
                </>
              )}
            </div>
          </aside>

        </div>
      )}
    </div>
  );
}