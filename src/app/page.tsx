"use client";

import React, { useState, useEffect } from "react";
import { 
  HeartPulse, BrainCircuit, ShieldAlert, Sparkles, Activity, 
  ArrowRight, Users, ChevronRight, Stethoscope, Moon, Sun, 
  DollarSign, BarChart3, Database, ShieldCheck, Video
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [symptomInput, setSymptomInput] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Synchronize dark-mode class on document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleSymptomCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const txt = symptomInput.toLowerCase();
      let analysis = {
        diagnoses: ["General Strain", "Fatigue"],
        specialist: "General Practitioner",
        urgency: "Low",
        advice: "Rest, monitor telemetry metrics, and schedule a routine GP consultation."
      };

      if (txt.includes("chest") || txt.includes("heart") || txt.includes("breath")) {
        analysis = {
          diagnoses: ["Myocardial Infarction warning", "Angina", "Arrhythmia"],
          specialist: "Cardiology Specialist",
          urgency: "Emergency",
          advice: "IMMEDIATE ATTENTION REQUIRED: Please call emergency services or visit the nearest ER."
        };
      } else if (txt.includes("head") || txt.includes("migraine")) {
        analysis = {
          diagnoses: ["Migraine flare-up", "Tension Headache", "Ophthalmic stress"],
          specialist: "Neurology Specialist",
          urgency: "High",
          advice: "Rest in a quiet, dark room. Hydrate immediately. Consult a neurologist if pain persists."
        };
      } else if (txt.includes("rash") || txt.includes("skin") || txt.includes("itch")) {
        analysis = {
          diagnoses: ["Contact Dermatitis", "Acute Eczema", "Allergic Urticaria"],
          specialist: "Dermatologist",
          urgency: "Low",
          advice: "Avoid scratching. Clean the area with cool water. Set up a Dermatology consult."
        };
      } else if (txt.includes("cough") || txt.includes("fever") || txt.includes("throat")) {
        analysis = {
          diagnoses: ["Acute Influenza", "Common Bronchial Viral Infection", "COVID-19"],
          specialist: "General Practitioner",
          urgency: "Medium",
          advice: "Keep hydrated, rest, use warm liquids. Book a telehealth consultation."
        };
      }

      setAiAnalysis(analysis);
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="bg-background text-foreground transition-colors duration-300 min-h-screen">
      
      {/* --- Sticky Glass Navbar --- */}
      <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="bg-primary text-white p-2 rounded-xl shadow-md flex items-center justify-center">
                <HeartPulse className="h-6 w-6 animate-pulse-slow" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Medicore
              </span>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
              <a href="#specialties" className="text-sm font-medium hover:text-primary transition-colors">Specialties</a>
              <a href="#ai-checker" className="text-sm font-medium hover:text-primary transition-colors">AI Sandbox</a>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-primary transition-all shadow-sm"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
              </button>
              
              <Link 
                href="/patient" 
                className="hidden sm:inline-flex items-center justify-center px-4 h-10 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary-dark shadow-md hover:shadow-lg transition-all"
              >
                Launch Portal
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* --- HERO Section --- */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        
        {/* Decorative Blur Orbs */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary opacity-10 blur-[120px] rounded-full z-0 dark:opacity-5"></div>
        <div className="absolute top-1/3 right-1/10 w-80 h-80 bg-teal-400 opacity-10 blur-[100px] rounded-full z-0 dark:opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Column Left */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 text-xs font-semibold tracking-wide">
              <Sparkles className="h-4 w-4" />
              <span>Next-Gen Enterprise Medical SaaS</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none">
              Production-Grade <br/>
              <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                Healthcare Portals
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
              An all-in-one clinical orchestration system linking Patients, Doctors, and Administrators with responsive telemetry pipelines, digital prescriptions, and embedded clinical AI checkers.
            </p>

            {/* Portal Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/patient" 
                className="flex items-center justify-center space-x-2 px-6 h-12 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark shadow-md hover:shadow-lg transition-all"
              >
                <span>Patient Portal</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link 
                href="/doctor" 
                className="flex items-center justify-center space-x-2 px-6 h-12 bg-slate-200 dark:bg-slate-800 font-semibold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
              >
                <span>Doctor Portal</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              
              <Link 
                href="/admin" 
                className="flex items-center justify-center space-x-2 px-6 h-12 border border-slate-300 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <span>Admin Panel</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-2xl font-bold text-primary">99.8%</div>
                <div className="text-xs text-slate-500">Service Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-teal-500">12k+</div>
                <div className="text-xs text-slate-500">Active Checkups</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-500">ISO-27001</div>
                <div className="text-xs text-slate-500">Certified Core</div>
              </div>
            </div>

          </div>

          {/* Hero Column Right: Interactive Live Telemetry Frame */}
          <div className="lg:col-span-5 relative">
            <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span className="font-bold text-sm">System Operations Monitor</span>
                </div>
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-sky-100 dark:bg-sky-950 p-2 rounded-lg text-sky-600 dark:text-sky-400">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Doctor Credentialing</div>
                      <div className="text-sm font-semibold">Verification Queue</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 rounded-md">2 Active</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-teal-100 dark:bg-teal-950 p-2 rounded-lg text-teal-600 dark:text-teal-400">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Clinic Revenue</div>
                      <div className="text-sm font-semibold">Ledger Aggregates</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-teal-600 dark:text-teal-400">₹2,50,000.00</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 dark:bg-indigo-950 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                      <Video className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Telemedicine Rooms</div>
                      <div className="text-sm font-semibold">Simulated WebRTC Links</div>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-500 font-medium">14 Connected</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- AI Symptom Sandbox --- */}
      <section id="ai-checker" className="py-20 bg-slate-50 dark:bg-slate-900/30 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold">Interactive AI Symptom Sandbox</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Experience the core Clinical NLP parser engine right from the landing page. Type your symptoms below to generate triage estimates and specialist suggestions.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 text-left max-w-2xl mx-auto">
            <form onSubmit={handleSymptomCheck} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Describe Clinical Symptoms
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    placeholder="e.g. 'fever with dry cough' or 'acute chest tightness'"
                    className="w-full h-12 pl-4 pr-32 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary transition-all text-sm"
                  />
                  <button 
                    type="submit"
                    disabled={isAnalyzing}
                    className="absolute right-2 top-2 h-8 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all text-xs font-medium flex items-center space-x-1"
                  >
                    {isAnalyzing ? (
                      <span>Analyzing...</span>
                    ) : (
                      <>
                        <span>Triage Now</span>
                        <BrainCircuit className="h-3 w-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-slate-400">Quick Samples:</span>
                <button 
                  type="button" 
                  onClick={() => setSymptomInput("persistent dry cough, fever")} 
                  className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:text-primary text-xs rounded-md transition-all"
                >
                  Flu Symptoms
                </button>
                <button 
                  type="button" 
                  onClick={() => setSymptomInput("sudden chest tightness and breathlessness")} 
                  className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:text-primary text-xs rounded-md transition-all"
                >
                  Cardiac Signal
                </button>
                <button 
                  type="button" 
                  onClick={() => setSymptomInput("rash on skin with itching")} 
                  className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:text-primary text-xs rounded-md transition-all"
                >
                  Dermal Allergy
                </button>
              </div>
            </form>

            {aiAnalysis && (
              <div className="mt-6 p-4 bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-950 rounded-xl space-y-3 animate-pulse-slow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-primary font-bold text-sm">
                    <Sparkles className="h-4 w-4" />
                    <span>Medicore AI Insights</span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    aiAnalysis.urgency === "Emergency" 
                      ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400"
                      : aiAnalysis.urgency === "High"
                      ? "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400"
                      : "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                  }`}>
                    {aiAnalysis.urgency} Urgency
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">PROBABLE CONDITIONS:</span>
                    <span className="font-semibold">{aiAnalysis.diagnoses.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">SPECIALIST FIELD:</span>
                    <span className="font-semibold">{aiAnalysis.specialist}</span>
                  </div>
                </div>

                <div className="border-t border-sky-100 dark:border-sky-900/30 pt-3 text-xs flex items-start space-x-2">
                  <ShieldAlert className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{aiAnalysis.advice}</p>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* --- Specialties Grid --- */}
      <section id="specialties" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-bold">Comprehensive Medical Specializations</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Dynamic routing across expert hospital departments housing vetted and license-verified clinicians.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { name: "Cardiology", icon: <HeartPulse className="h-6 w-6" />, count: "12 Doctors", color: "text-red-500 bg-red-50 dark:bg-red-950/20" },
            { name: "Neurology", icon: <BrainCircuit className="h-6 w-6" />, count: "8 Doctors", color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20" },
            { name: "Pediatrics", icon: <Users className="h-6 w-6" />, count: "15 Doctors", color: "text-teal-500 bg-teal-50 dark:bg-teal-950/20" },
            { name: "Dermatology", icon: <Stethoscope className="h-6 w-6" />, count: "6 Doctors", color: "text-pink-500 bg-pink-50 dark:bg-pink-950/20" },
            { name: "General Practice", icon: <Activity className="h-6 w-6" />, count: "20 Doctors", color: "text-sky-500 bg-sky-50 dark:bg-sky-950/20" }
          ].map((spec, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-5 hover:-translate-y-1 transition-all cursor-pointer">
              <div className={`p-3 rounded-xl inline-flex ${spec.color} mb-4`}>
                {spec.icon}
              </div>
              <h3 className="font-bold text-sm">{spec.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{spec.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CORE FEATURES GRID --- */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900/30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Engineered for Modern Clinical Standards</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Our secure middleware layer supports dynamic database tracking and immutable activity chains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 p-3 rounded-xl inline-flex">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Role-Based JWT Security</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Tokens are signed with encrypted claims, restricting access dynamically using class-based dependency injection checker systems.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 p-3 rounded-xl inline-flex">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Immutable Audit Trails</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Automated middleware logging records all login attempts, status transitions, and patient checkout actions to immutable tables.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl inline-flex">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Integrated Clinic Analytics</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Recharts analytics maps real-time consult schedules, payments methods, and financial curves for instant clinics monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <div className="flex items-center space-x-2">
            <div className="bg-primary text-white p-1 rounded-md">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-200">Medicore Platform</span>
          </div>
          <p>© 2026 Medicore Technologies Pvt. Ltd. NHA & ABDM Regulatory Complete.</p>
        </div>
      </footer>

    </div>
  );
}
