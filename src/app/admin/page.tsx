"use client";

import React, { useState, useEffect } from "react";
import { 
  HeartPulse, Activity, FileText, Sparkles, LogOut, 
  Moon, Sun, ShieldAlert, CheckCircle2, ChevronRight, BarChart3, 
  Users, DollarSign, Award, ShieldCheck, Database
} from "lucide-react";
import Link from "next/link";

export default function AdminPanel() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, verification, audits

  // Verification queue doctors list
  const [unverifiedDoctors, setUnverifiedDoctors] = useState<any[]>([
    { id: 1, name: "Dr. Sandeep Sen", specialty: "Neurosurgery", license: "LIC-NEUR-802", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sandeep", status: "pending" },
    { id: 2, name: "Dr. Vikram Joshi", specialty: "General Practice", license: "LIC-GEN-104", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Vikram", status: "pending" }
  ]);

  // Security logs audits dataset
  const [auditLogs, setAuditLogs] = useState<any[]>([
    { id: "log_101", user: "Aditi Sharma (Admin)", action: "system_bootstrap", ip: "127.0.0.1", details: "Medicore Platform Q2 core booted.", time: "2026-06-02 13:07" },
    { id: "log_102", user: "Dr. Rajesh Sharma", action: "prescription_issue", ip: "192.168.1.12", details: "Prescription appt #1 issued for Priya Sharma.", time: "2026-06-02 11:42" },
    { id: "log_103", user: "Priya Sharma (Patient)", action: "user_login", ip: "192.168.1.44", details: "Authenticated JWT session successfully.", time: "2026-06-02 09:12" },
    { id: "log_104", user: "Aarav Patel (Patient)", action: "user_register", ip: "192.168.1.80", details: "New profile created under patient role.", time: "2026-06-02 07:15" }
  ]);

  // Synchronize dark-mode class
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleVerifyDoctor = (docId: number, name: string) => {
    // Approve doctor credentials
    setUnverifiedDoctors(unverifiedDoctors.map(doc => 
      doc.id === docId ? { ...doc, status: "verified" } : doc
    ));

    // Register this admin action in audits logs
    const newLog = {
      id: `log_${auditLogs.length + 101}`,
      user: "Aditi Sharma (Admin)",
      action: "doctor_verify",
      ip: "127.0.0.1",
      details: `Approved practitioner license credentials for ${name}.`,
      time: new Date().toISOString().slice(0, 16).replace("T", " ")
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

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
              { id: "dashboard", label: "Operations Panel", icon: <BarChart3 className="h-4 w-4" /> },
              { id: "verification", label: "Licensing Reviews", icon: <ShieldCheck className="h-4 w-4" /> },
              { id: "audits", label: "System Audit Logs", icon: <Database className="h-4 w-4" /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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
            <span className="font-bold text-sm">Medicore Admin</span>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
            {isDarkMode ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4" />}
          </button>
        </header>

        {/* --- TAB: DASHBOARD OPERATIONS --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Clinic Operations Panel</h1>
              <p className="text-slate-500 text-sm">Aditi Sharma | Administrative Core Lead</p>
            </div>

            {/* KPI grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-card rounded-2xl p-5 space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase">Total Clinic Revenue</div>
                <div className="text-3xl font-bold text-teal-600">₹2,50,000.00</div>
                <div className="text-xs text-slate-400">HIPAA compliant invoice ledger</div>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase">Vetted Practitioners</div>
                <div className="text-3xl font-bold">4 Active</div>
                <div className="text-xs text-slate-400">All licenses verified complete</div>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase">Clinics Departments</div>
                <div className="text-3xl font-bold">5 Sections</div>
                <div className="text-xs text-slate-400">Cardiology, Neurology, Pediatrics...</div>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-2">
                <div className="text-xs text-slate-400 font-bold uppercase">Pending Licensures</div>
                <div className="text-3xl font-bold text-primary">
                  {unverifiedDoctors.filter(d => d.status === "pending").length}
                </div>
                <div className="text-xs text-slate-400">Clinician verification queue</div>
              </div>

            </div>

            {/* Clinic Telemetry Horizontal Progress bars */}
            <div className="glass-card rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="font-bold text-sm">Clinics Telemetry Occupancy</h3>
                <p className="text-xs text-slate-400">Operational capacities across departments</p>
              </div>

              <div className="space-y-4">
                {[
                  { name: "Emergency Ward", value: 85, color: "bg-red-500" },
                  { name: "Intensive Care Unit (ICU)", value: 64, color: "bg-indigo-500" },
                  { name: "General Pediatrics Ward", value: 42, color: "bg-teal-500" }
                ].map((dept, idx) => (
                  <div key={idx} className="space-y-2 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>{dept.name}</span>
                      <span>{dept.value}% Occupied</span>
                    </div>
                    {/* Outer Bar */}
                    <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      {/* Inner Animated Bar */}
                      <div 
                        style={{ width: `${dept.value}%` }}
                        className={`h-full ${dept.color} rounded-full transition-all duration-1000`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* --- TAB: LICENSING REVIEW QUEUE --- */}
        {activeTab === "verification" && (
          <div className="space-y-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold tracking-tight">Clinician Licensing Reviews</h1>

            <div className="space-y-4">
              {unverifiedDoctors.map(doc => (
                <div key={doc.id} className="glass-card rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <img src={doc.avatar} alt={doc.name} className="h-14 w-14 rounded-xl bg-slate-100" />
                    <div>
                      <div className="font-bold text-sm">{doc.name}</div>
                      <div className="text-xs text-slate-400">Specialty: {doc.specialty} • License Key: {doc.license}</div>
                    </div>
                  </div>

                  {doc.status === "pending" ? (
                    <button 
                      onClick={() => handleVerifyDoctor(doc.id, doc.name)}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center space-x-1"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Approve Credentials</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-lg animate-pulse-slow">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Vetted Approved</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB: AUDIT LOGS TRAIL TABLE --- */}
        {activeTab === "audits" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">System Access Audit Trail</h1>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-400 px-3 py-1 rounded-lg flex items-center gap-1">
                <Database className="h-3.5 w-3.5" />
                <span>Immutable Logs Chain</span>
              </span>
            </div>

            {/* Audit Logs Table */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
                      <th className="p-4">Log ID</th>
                      <th className="p-4">Trigger User</th>
                      <th className="p-4">Action</th>
                      <th className="p-4">Network IP Address</th>
                      <th className="p-4">Log Details</th>
                      <th className="p-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {auditLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 font-medium">
                        <td className="p-4 text-slate-400">{log.id}</td>
                        <td className="p-4 font-bold">{log.user}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.action === 'system_bootstrap' 
                              ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
                              : log.action === 'doctor_verify'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400">{log.ip}</td>
                        <td className="p-4">{log.details}</td>
                        <td className="p-4 text-slate-400">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
