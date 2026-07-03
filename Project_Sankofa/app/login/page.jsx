'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/dashboard');
  };
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      
      {/* LEFT SIDE: Visual Brand Panel (Hidden on mobile) */}
      <div className="hidden w-3/5 relative bg-slate-900 lg:flex flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-900 to-emerald-950/30 z-0" />
        
        {/* Top Branding Logo */}
        <div className="relative z-10 flex items-center space-x-2 text-white font-bold text-xl tracking-tight">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-sm">
            ⚡
          </div>
          <span>LightHub.edu</span>
        </div>

        {/* Center Mockup / Marketing Hook */}
        <div className="relative z-10 max-w-xl my-auto space-y-6">
          <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/30">
            Powered by Next-Gen AI
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Upload your PDFs. <br />
            Let AI detect knowledge gaps. <br />
            Study smarter.
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Connect your course materials, interact with an isolated LLM vector workspace for each class, and generate instant emergency summaries when you hit Panic Mode.
          </p>
        </div>

        {/* Bottom Footer Note */}
        <div className="relative z-10 text-xs text-slate-500">
          &copy; 2026 LightHub.edu. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Form Panel */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:w-2/5 lg:flex-none lg:px-20 xl:px-24 bg-white shadow-2xl z-10">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Get ready to crush your upcoming exams.
            </p>
          </div>

          <div className="mt-8">
            {/* Social Authentication Button */}
            <div>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all duration-200"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-sm font-semibold leading-6">Sign in with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white px-4 text-slate-500">Or continue with email</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
                    Email address
                  </label>
                  <div className="mt-1.5">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@university.edu"
                        className="block w-full rounded-xl border-0 py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all duration-150"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-900">
                      Password
                    </label>
                    <div className="text-sm">
                      <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div className="mt-1.5">
                    <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="block w-full rounded-xl border-0 py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all duration-150"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 transition-all duration-200"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
            
          </div>
        </div>
      </div>

    </div>
  );
}