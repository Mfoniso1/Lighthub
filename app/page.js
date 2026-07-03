import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Decorative background grids/glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 left-1/4 right-1/4 h-[400px] bg-gradient-to-b from-indigo-500/20 via-emerald-500/10 to-transparent blur-[120px] rounded-full" />

      {/* Top Header Navigation */}
      <header className="relative z-10 border-b border-slate-900 bg-slate-950/70 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 flex items-center justify-center shadow-lg text-white font-bold">
                ⚡
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                LightHub.edu
              </span>
            </div>
            <div>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 py-20 text-center max-w-4xl mx-auto space-y-10">
        <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
          Designed for African Universities
        </span>
        
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
          From Incomplete Lectures <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            to Exam Readiness.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          LightHub.edu is your AI Academic Survival Copilot. Upload lecturer PDFs, screenshots, past questions, and notes. Our engine detects syllabus coverage gaps and prepares you for exams within 48 hours.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md pt-4">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/30 transition-all duration-200 hover:-translate-y-0.5"
          >
            Enter Study Space →
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 px-8 py-4 text-base font-semibold text-slate-300 hover:text-white transition-all duration-200"
          >
            Documentation
          </a>
        </div>

        {/* Feature Grid Mockup */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 w-full text-left">
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-sm">
            <div className="text-2xl mb-3">🔍</div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Gap Detector</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Compares your uploaded class notes against the official university benchmark outline to find untaught modules.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-sm">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Probability Engine</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Analyzes historical past question frequency to estimate the likelihood of topics showing up on your exam.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-sm">
            <div className="text-2xl mb-3">🚨</div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Panic Mode</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Generates a custom 48-hour revision countdown block, high-yield cram sheets, and quizzes to save your grade.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/20 py-8 text-center text-xs text-slate-600">
        &copy; 2026 LightHub.edu. All rights reserved.
      </footer>
    </div>
  );
}
