"use client";

import React, { useState, useEffect } from "react";
import { 
  HeartPulse, Activity, Calendar, FileText, Sparkles, LogOut, 
  Moon, Sun, Plus, Trash2, CheckCircle2, ChevronRight, BarChart3, 
  Users, DollarSign, Award, Star
} from "lucide-react";
import Link from "next/link";

export default function DoctorPortal() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, prescriptions, schedule
  
  // Custom prescription builder state
  const [selectedPatient, setSelectedPatient] = useState("Priya Sharma");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [medicines, setMedicines] = useState<any[]>([
    { name: "", dosage: "", frequency: "", duration: "" }
  ]);
  const [isPrescribingComplete, setIsPrescribingComplete] = useState(false);

  // Synchronize dark-mode class
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const addMedicineRow = () => {
    setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const removeMedicineRow = (idx: number) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  const handleMedChange = (idx: number, field: string, val: string) => {
    const updated = [...medicines];
    updated[idx][field] = val;
    setMedicines(updated);
  };

  const handlePrescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simplistic check for blank entries
    const isBlank = medicines.some(m => !m.name || !m.dosage);
    if (isBlank || !clinicalNotes.trim()) {
      alert("Please specify clinical notes and fill all medication rows.");
      return;
    }

    setIsPrescribingComplete(true);
  };

  // Earning trend bars database
  const monthlyEarnings = [
    { month: "Jan", amount: 28000 },
    { month: "Feb", amount: 34000 },
    { month: "Mar", amount: 48000 },
    { month: "Apr", amount: 51000 },
    { month: "May", amount: 62000 }
  ];

  const maxAmount = 70000;

  return (
    <div className="flex bg-background text-foreground transition-colors duration-300 min-h-screen">
      
      {/* --- Sidebar Navigation --- */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:flex flex-col justify-between flex-shrink-0 border-r border-slate-800">
        <div className="space-y-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary text-white p-2 rounded-xl">
              <HeartPulse className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Medicore
            </span>
          </Link>

          {/* Nav Items */}
          <nav className="space-y-2">
            {[
              { id: "dashboard", label: "Earnings & Stats", icon: <BarChart3 className="h-4 w-4" /> },
              { id: "prescriptions", label: "Write Prescription", icon: <FileText className="h-4 w-4" /> },
              { id: "schedule", label: "Practitioner Calendar", icon: <Calendar className="h-4 w-4" /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsPrescribingComplete(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center space-x-3 px-4 py-2 w-full text-slate-400 hover:text-white text-sm"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4" />}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
          
          <Link href="/" className="flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-red-400 text-sm">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* --- Main Contents Area --- */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        
        {/* Header */}
        <header className="flex md:hidden items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm">Medicore Doctor</span>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
            {isDarkMode ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4" />}
          </button>
        </header>

        {/* --- TAB: DASHBOARD & CLINIC METRICS --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Practitioner Earnings & Stats</h1>
              <p className="text-slate-500 text-sm">Dr. Rajesh Sharma | Cardiology Department Head</p>
            </div>

            {/* KPI grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-card rounded-2xl p-5 space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase">Total Earnings</div>
                <div className="text-3xl font-bold text-teal-600">₹1,80,000.00</div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>Stripe payouts complete</span>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase">Completed visits</div>
                <div className="text-3xl font-bold">142</div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>Patients consult complete</span>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase">Practitioner Rating</div>
                <div className="text-3xl font-bold flex items-center gap-1">
                  <span>4.9</span>
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" />
                  <span>Based on 98 reviews</span>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase">Licensing check</div>
                <div className="text-3xl font-bold text-primary">Verified</div>
                <div className="text-xs text-emerald-500 font-semibold">Active credentials</div>
              </div>

            </div>

            {/* Earnings High-Fidelity CSS Bar Chart & Calendar overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Earnings Bar Chart */}
              <div className="lg:col-span-8 glass-card rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-sm">Monthly Earnings Curve (₹)</h3>
                  <p className="text-xs text-slate-400">Progression from Q1-Q2 billing registers</p>
                </div>

                {/* CSS Bar Chart */}
                <div className="h-64 flex items-end justify-between px-4 pt-6 border-b border-l border-slate-200 dark:border-slate-800">
                  {monthlyEarnings.map((data, idx) => {
                    const heightPercent = (data.amount / maxAmount) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer w-12">
                        {/* Tooltip value */}
                        <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                          ₹{data.amount}
                        </span>
                        {/* Column Bar */}
                        <div 
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-lg transition-all group-hover:to-blue-600 group-hover:scale-x-105 duration-500"
                        ></div>
                        <span className="text-xs text-slate-400 font-medium pb-2">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Patient review highlights */}
              <div className="lg:col-span-4 glass-card rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-sm">Patient Reviews Feed</h3>
                
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Priya Sharma</span>
                      <span className="text-yellow-500">5.0 ★</span>
                    </div>
                    <p className="text-slate-500">"Dr. Rajesh Sharma resolved my cardiac concerns instantly. The telehealth audio and video were crystal clear."</p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Aarav Patel</span>
                      <span className="text-yellow-500">4.8 ★</span>
                    </div>
                    <p className="text-slate-500">"Professional and precise. Explains medicine dosage in simple terms."</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- TAB: WRITE DIGITAL PRESCRIPTIONS --- */}
        {activeTab === "prescriptions" && (
          <div className="space-y-8 max-w-2xl mx-auto">
            
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Prescription & Diagnostics Compiler</h1>
              <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Autoparse Complete</span>
              </span>
            </div>

            {!isPrescribingComplete ? (
              <form onSubmit={handlePrescriptionSubmit} className="glass-card rounded-2xl p-6 space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Target Patient</label>
                    <select 
                      value={selectedPatient} 
                      onChange={(e) => setSelectedPatient(e.target.value)}
                      className="w-full h-11 px-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                    >
                      <option value="Priya Sharma">Priya Sharma</option>
                      <option value="Aarav Patel">Aarav Patel</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Appointment Clinical Context</label>
                    <select className="w-full h-11 px-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm">
                      <option value="Cardiology Visit">Consult ID #19 - Palpitations Checkup</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Clinical Notes & Diagnostics Summary</label>
                  <textarea 
                    value={clinicalNotes} 
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    placeholder="Patient exhibits baseline normal sinus rhythm. Advised restricted caffeine past 2pm and Magnesium daily."
                    rows={4} 
                    className="w-full p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Medications drug rows input grid */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Medications matrix (Rx)</label>
                    <button 
                      type="button" 
                      onClick={addMedicineRow}
                      className="text-xs text-primary font-semibold flex items-center space-x-1 hover:underline"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Medicine</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {medicines.map((med, idx) => (
                      <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl items-end relative">
                        <div className="sm:col-span-4 space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Drug Name</label>
                          <input 
                            type="text" 
                            value={med.name} 
                            placeholder="e.g. Magnesium Oxide"
                            onChange={(e) => handleMedChange(idx, "name", e.target.value)}
                            className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs" 
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Dosage</label>
                          <input 
                            type="text" 
                            value={med.dosage} 
                            placeholder="e.g. 400mg"
                            onChange={(e) => handleMedChange(idx, "dosage", e.target.value)}
                            className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs" 
                          />
                        </div>
                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Frequency</label>
                          <input 
                            type="text" 
                            value={med.frequency} 
                            placeholder="e.g. Once daily"
                            onChange={(e) => handleMedChange(idx, "frequency", e.target.value)}
                            className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs" 
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Duration</label>
                          <input 
                            type="text" 
                            value={med.duration} 
                            placeholder="e.g. 30 days"
                            onChange={(e) => handleMedChange(idx, "duration", e.target.value)}
                            className="w-full h-9 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs" 
                          />
                        </div>
                        <div className="sm:col-span-1 text-center">
                          <button 
                            type="button" 
                            onClick={() => removeMedicineRow(idx)}
                            className="p-2 text-slate-400 hover:text-red-500 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center space-x-2"
                >
                  <span>Authorize & Issue Digital Prescription</span>
                  <ChevronRight className="h-4 w-4" />
                </button>

              </form>
            ) : (
              <div className="glass-card rounded-2xl p-8 text-center space-y-6 animate-pulse-slow">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-500">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Prescription Sheet Successfully Issued!</h2>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    Medication claims have been cryptographically committed to patient {selectedPatient}'s vault. A notification alerting patient checkup completion was dispatched instantly.
                  </p>
                </div>

                <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl text-left text-xs max-w-sm mx-auto space-y-2 bg-slate-50 dark:bg-slate-800/30">
                  <div className="font-bold border-b pb-1 mb-2">Rx DETAILS SUMMARY:</div>
                  <div><span className="text-slate-400 font-semibold block uppercase">Patient Name:</span> {selectedPatient}</div>
                  <div><span className="text-slate-400 font-semibold block uppercase">Notes:</span> {clinicalNotes}</div>
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase">Meds List:</span>
                    <ul className="list-disc pl-4 mt-1 font-medium">
                      {medicines.map((m, i) => (
                        <li key={i}>{m.name} ({m.dosage}) - {m.frequency} for {m.duration}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button 
                  onClick={() => { setActiveTab("dashboard"); setIsPrescribingComplete(false); }}
                  className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm shadow-md hover:bg-primary-dark transition-all"
                >
                  Return to Earnings & Stats
                </button>
              </div>
            )}

          </div>
        )}

        {/* --- TAB: PRACTITIONER CALENDAR --- */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Practitioner Schedule Slots</h1>
            
            {/* Visual slots representation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Monday", "Wednesday", "Friday"].map((day, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold border-b pb-2 text-primary">{day} Slots</h3>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-100 rounded-lg flex items-center justify-between font-semibold">
                      <span>09:30 AM</span>
                      <span>Booked (Priya S.)</span>
                    </div>
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-100 rounded-lg flex items-center justify-between font-semibold">
                      <span>10:30 AM</span>
                      <span>Booked (Aarav P.)</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 text-slate-400 border border-dashed rounded-lg flex items-center justify-between font-medium">
                      <span>02:00 PM</span>
                      <span>Available</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
