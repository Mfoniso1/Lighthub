import React from 'react';
import Link from 'next/link';

// Mock data representing the per-course vector namespaces from the architecture
const courses = [
  { id: 'cos141', name: 'Computer Hardware Maintenance', code: 'COS 141', docs: 8, coverage: 75, color: 'from-blue-500 to-indigo-600' },
  { id: 'stat111', name: 'Descriptive Statistics', code: 'STAT 111', docs: 5, coverage: 40, color: 'from-emerald-500 to-teal-600' },
  { id: 'math103', name: 'Mathematical Methods I', code: 'MATH 103', docs: 12, coverage: 90, color: 'from-violet-500 to-purple-600' },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* GLOBAL TOP NAVIGATION */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-sm text-white font-bold">
                ⚡
              </div>
              <span className="font-bold tracking-tight text-slate-900">LightHub.edu</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold text-white shadow-inner">
                ST
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT LAYER */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="md:flex md:items-center md:justify-between border-b border-slate-200 pb-6 mb-8">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Your Study Spaces
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Select a course vector namespace to manage files, detect gaps, or launch Panic Mode.
            </p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <Link
              href="/course/cos141"
              className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all duration-150"
            >
              <span className="mr-2 text-base font-bold">+</span> New Space
            </Link>
          </div>
        </div>

        {/* VECTOR NAMESPACE GRID */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div 
              key={course.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              <div>
                {/* Visual badge top right */}
                <div className={`absolute top-0 right-0 h-2 w-full bg-gradient-to-r ${course.color}`} />
                
                <div className="flex items-center justify-between mt-2">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                    {course.code}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center font-medium">
                    📁 {course.docs} Files Indexed
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-150">
                  {course.name}
                </h3>

                {/* Coverage metric bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
                    <span>Syllabus Coverage</span>
                    <span className="text-slate-900 font-semibold">{course.coverage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${course.coverage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href={`/course/${course.id}`}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-150"
                >
                  Enter Space →
                </Link>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}