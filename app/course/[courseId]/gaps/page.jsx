'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CurriculumGapDetector() {
  const params = useParams();
  const courseId = params?.courseId || 'cos141';

  const defaultSyllabus = 
`Module 1: Low-Level Storage & System Architecture
- Motherboard Bus Architectures (PCIe, SATA)
- BIOS/UEFI Configuration & Boot Flags
- Interrupt Vectors & INT 13h Disk Operations

Module 2: POST Diagnostics & Diagnostic Routine
- Power-On Self-Test (POST) Failure Sequence
- Audible Beep Code Diagnostic Matrices

Module 3: Non-Volatile Memory Registers
- CMOS Battery Voltage Decay & Clock Drift
- NVRAM Variables Configuration Protection`;

  const [syllabusText, setSyllabusText] = useState(defaultSyllabus);
  const [modules, setModules] = useState([]);
  const [coverage, setCoverage] = useState(0);
  const [gapsCount, setGapsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generatingForId, setGeneratingForId] = useState(null);
  
  // State for active popup modal notes
  const [activeNotes, setActiveNotes] = useState(null);
  const [activeNotesTopic, setActiveNotesTopic] = useState("");

  useEffect(() => {
    runGapDetection();
  }, [courseId]);

  const runGapDetection = async () => {
    try {
      setLoading(true);
      const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || '';
      const res = await fetch(`${API_BASE}/api/detect-gaps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: courseId,
          syllabus_text: syllabusText
        })
      });
      if (!res.ok) throw new Error("Failed to scan syllabus");
      const data = await res.json();
      setModules(data.modules || []);
      setCoverage(data.coverage ?? 0);
      setGapsCount(data.gaps_count ?? 0);
    } catch (err) {
      console.error("Gap detection error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePatchGap = async (topicName) => {
    try {
      setGeneratingForId(topicName);
      const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || '';
      const res = await fetch(`${API_BASE}/api/patch-gap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: courseId,
          topic_name: topicName
        })
      });
      if (!res.ok) throw new Error("Failed to patch topic gap");
      const data = await res.json();
      
      // Update UI to mark topic as covered
      setModules(prevModules => 
        prevModules.map(mod => ({
          ...mod,
          topics: mod.topics.map(topic => 
            topic.name === topicName 
              ? { ...topic, status: "covered", source: "✨ Synthesized AI Supplement" } 
              : topic
          )
        }))
      );
      
      // Display generated notes
      setActiveNotesTopic(topicName);
      setActiveNotes(data.notes);
    } catch (err) {
      console.error("Patch gap error:", err);
      alert("Failed to patch gap: " + err.message);
    } finally {
      setGeneratingForId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative">
      
      {/* GLOBAL TOP NAVIGATION */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-sm text-white font-bold">
                ⚡
              </div>
              <span className="font-bold tracking-tight text-slate-900">LightHub.edu — GAP DETECTOR</span>
            </div>
            <Link href={`/course/${courseId}`} className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">
              ← Return to Workspace
            </Link>
          </div>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* TITLE HERO */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Syllabus Mapping Matrix</h1>
            <p className="text-xs text-slate-500">
              Cross-referencing your course syllabus expectations against the uploaded file repository.
            </p>
          </div>
          
          <div className="flex items-center gap-4 self-stretch md:self-auto">
            <div className="bg-amber-50 border border-amber-100 text-amber-800 text-xs px-3.5 py-2.5 rounded-xl font-semibold flex items-center gap-1.5 justify-center flex-1">
              ⚠️ Disparities: {gapsCount}
            </div>
            <div className="bg-indigo-550 bg-indigo-600 text-white text-xs px-3.5 py-2.5 rounded-xl font-bold text-center flex-1">
              Coverage: {coverage}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* SYLLABUS EDIT PANEL */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 h-fit">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Course Syllabus Outline</h2>
              <p className="text-xxs text-slate-400 mt-1">Specify or edit your course requirements below.</p>
            </div>
            <textarea
              className="w-full h-80 rounded-xl border-slate-200 text-xs p-3 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
              value={syllabusText}
              onChange={(e) => setSyllabusText(e.target.value)}
            />
            <button
              onClick={runGapDetection}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-350 text-white font-bold py-2.5 text-xs rounded-xl shadow-md transition"
            >
              {loading ? "Re-scanning..." : "Update & Scan Matrix"}
            </button>
          </div>

          {/* SYLLABUS COMPARISON MAP */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
                <div className="text-3xl animate-bounce">🔍</div>
                <p className="text-xs text-slate-500 font-medium">Scanning vector database modules for matching terms...</p>
              </div>
            ) : modules.length === 0 ? (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-sm text-xs text-slate-400">
                Syllabus outline empty or parsing failed. Paste your syllabus in the left editor and hit scan.
              </div>
            ) : (
              modules.map((mod) => (
                <div key={mod.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  
                  {/* Card Module Header Banner */}
                  <div className={`p-4 border-b border-slate-100 flex justify-between items-center ${
                    mod.status === 'covered' ? 'bg-emerald-50/20' : mod.status === 'partial' ? 'bg-amber-50/20' : 'bg-rose-50/10'
                  }`}>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 truncate mr-2">{mod.title}</h3>
                    <span className={`text-xxs font-bold uppercase px-2.5 py-1 rounded-full shrink-0 ${
                      mod.status === 'covered' ? 'bg-emerald-100 text-emerald-800' : mod.status === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {mod.status === 'covered' ? '● Verified Complete' : mod.status === 'partial' ? '▲ Knowledge Gaps' : '✕ Unprepared'}
                    </span>
                  </div>

                  {/* Topics Breakdown List */}
                  <div className="divide-y divide-slate-100">
                    {mod.topics.map((topic, idx) => (
                      <div key={idx} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50/50 transition">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-slate-900">{topic.name}</p>
                          <div className="flex items-center space-x-2 text-xxs text-slate-400">
                            <span>Status Tracked:</span>
                            <span className={topic.status === 'covered' ? 'text-indigo-600 font-semibold' : 'text-rose-500 font-bold'}>
                              {topic.source}
                            </span>
                          </div>
                        </div>

                        {/* Action button adapts neatly to screen width */}
                        <div className="w-full sm:w-auto">
                          {topic.status === 'missing' ? (
                            <button
                              onClick={() => handlePatchGap(topic.name)}
                              disabled={generatingForId !== null}
                              className="w-full sm:w-auto px-3.5 py-2 bg-indigo-650 bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xxs rounded-xl shadow-sm transition text-center"
                            >
                              {generatingForId === topic.name ? 'Generating Notes...' : '✨ Patch Context Gap'}
                            </button>
                          ) : (
                            <div className="text-emerald-600 font-bold text-xs flex items-center justify-start sm:justify-end space-x-1 px-2 py-1">
                              <span>✓</span> <span className="text-xxs uppercase tracking-wider">Ready</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </main>

      {/* POPUP MODAL FOR GENERATED NOTES */}
      {activeNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Supplemental Notes</h3>
                <h2 className="text-base font-bold text-slate-900">{activeNotesTopic}</h2>
              </div>
              <button 
                onClick={() => { setActiveNotes(null); setActiveNotesTopic(""); }}
                className="text-slate-400 hover:text-slate-650 hover:text-slate-600 text-lg font-bold p-1 bg-white hover:bg-slate-100 border border-slate-250 border-slate-200 rounded-lg h-8 w-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-wrap font-sans">
              {activeNotes}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => { setActiveNotes(null); setActiveNotesTopic(""); }}
                className="bg-indigo-650 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition"
              >
                Got it, Keep Studying
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}