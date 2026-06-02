"use client";

import React, { useState, useEffect } from "react";
import { 
  HeartPulse, Activity, Calendar, FileText, Sparkles, LogOut, 
  Menu, Moon, Sun, User, UserPlus, Heart, Thermometer, Droplet, 
  Search, ShieldCheck, CheckCircle2, ChevronRight, Video, 
  Volume2, Mic, VideoOff, Send, Download, X, AlertTriangle, ShieldAlert
} from "lucide-react";
import Link from "next/link";

export default function PatientPortal() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, booking, records, telemedicine
  
  // State for AI chatbot drawer
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: "ai", text: "Hello! I am your Medicore clinical assistant. Describe your symptoms to evaluate triage steps." }
  ]);

  // State for appointment booking
  const [selectedDept, setSelectedDept] = useState("Cardiology");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("2026-06-05");
  const [selectedSlot, setSelectedSlot] = useState("10:30 AM");
  const [bookingStep, setBookingStep] = useState("form"); // form, payment, success
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [appointments, setAppointments] = useState<any[]>([
    { id: 1, doctor: "Dr. Rajesh Sharma", specialty: "Cardiology", date: "2026-06-12", time: "09:30 AM", type: "Telemedicine", status: "scheduled" },
    { id: 2, doctor: "Dr. Anjali Mehta", specialty: "Neurology", date: "2026-06-15", time: "02:00 PM", type: "In-Person", status: "pending_payment" }
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

  // Doctors database
  const doctorsList = [
    { id: 1, name: "Dr. Rajesh Sharma", specialty: "Cardiology", fee: 800.0, rating: 4.9, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rajesh", availability: ["09:30 AM", "10:30 AM", "02:00 PM"] },
    { id: 2, name: "Dr. Anjali Mehta", specialty: "Neurology", fee: 1500.0, rating: 4.8, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Anjali", availability: ["11:00 AM", "01:30 PM", "03:00 PM"] },
    { id: 3, name: "Dr. Amit Verma", specialty: "Pediatrics", fee: 600.0, rating: 5.0, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Amit", availability: ["09:00 AM", "10:00 AM", "11:00 AM"] },
    { id: 4, name: "Dr. Sunita Rao", specialty: "Dermatology", fee: 700.0, rating: 4.7, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sunita", availability: ["02:30 PM", "03:30 PM", "04:30 PM"] }
  ];

  // Filtered doctors list based on selected department
  const filteredDoctors = doctorsList.filter(doc => doc.specialty === selectedDept);

  useEffect(() => {
    if (filteredDoctors.length > 0) {
      setSelectedDoctor(filteredDoctors[0]);
    }
  }, [selectedDept]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsgs = [...chatMessages, { sender: "user", text: chatInput }];
    setChatMessages(newMsgs);
    const userQ = chatInput.toLowerCase();
    setChatInput("");

    setTimeout(() => {
      let reply = "I've logged that. Try keeping hydrated. If symptoms intensify, please use our schedule module to lock a direct clinical consultation.";
      if (userQ.includes("chest") || userQ.includes("heart") || userQ.includes("breath")) {
        reply = "ALERT: These indicators correspond to urgent cardiac factors. Please call 911 immediately or visit the nearest ER emergency room.";
      } else if (userQ.includes("head") || userQ.includes("migraine")) {
        reply = "Neurology Advice: Ensure rest in a darkened area. Limit screen time. If symptoms persist, consider setting up a Neurology visit.";
      } else if (userQ.includes("rash") || userQ.includes("itch")) {
        reply = "Dermal Advice: Apply cool compress. Avoid scratching. Set up a Dermatology slot for precise diagnosis.";
      } else if (userQ.includes("hi") || userQ.includes("hello")) {
        reply = "Hello! I am your clinical chatbot. Type symptoms like 'cough' or 'migraine' for advice.";
      }
      setChatMessages(prev => [...prev, { sender: "ai", text: reply }]);
    }, 1000);
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep("payment");
  };

  const handleConfirmPayment = () => {
    const newAppt = {
      id: appointments.length + 1,
      doctor: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: selectedDate,
      time: selectedSlot,
      type: "Telemedicine",
      status: "scheduled"
    };

    setAppointments([newAppt, ...appointments]);
    setBookingStep("success");
  };

  const triggerPrescriptionMock = (apptId: number) => {
    alert(`Streaming PDF download for Appointment #${apptId}. ReportLab buffer generating!`);
    window.open(`http://localhost:8000/api/patients/prescriptions/download/${apptId}`, '_blank');
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
              { id: "dashboard", label: "Overview Dashboard", icon: <Activity className="h-4 w-4" /> },
              { id: "booking", label: "Book Appointment", icon: <Calendar className="h-4 w-4" /> },
              { id: "records", label: "Medical Vault", icon: <FileText className="h-4 w-4" /> },
              { id: "telemedicine", label: "Telemedicine Room", icon: <Video className="h-4 w-4" /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setBookingStep("form"); }}
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
      <main className="flex-1 p-6 md:p-8 overflow-y-auto relative">
        
        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm">Medicore</span>
          </div>
          <button onClick={() => setIsAiOpen(true)} className="p-2 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </button>
        </header>

        {/* AI Assistant Drawer Floating Button */}
        <button 
          onClick={() => setIsAiOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-primary to-indigo-500 text-white p-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all z-40 flex items-center space-x-2"
        >
          <Sparkles className="h-5 w-5 animate-pulse-slow" />
          <span className="hidden sm:inline text-xs font-semibold">AI Assistant</span>
        </button>

        {/* --- TAB: OVERVIEW DASHBOARD --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Overview Dashboard</h1>
                <p className="text-slate-500 text-sm">Welcome back, Priya Sharma. Your health telemetry metrics look normal.</p>
              </div>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 font-medium">
                Last checked: 3 mins ago
              </span>
            </div>

            {/* Vitals Circular Progress Rings & Metric Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Vitals Step Wheel */}
              <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sky-500">
                    <Activity className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Step Count Target</span>
                  </div>
                  <div className="text-2xl font-bold">7,820</div>
                  <div className="text-xs text-slate-400">Target: 10,000 steps</div>
                </div>
                
                {/* SVG Progress Gauge */}
                <div className="relative h-20 w-20 flex items-center justify-center">
                  <svg className="h-full w-full">
                    <circle className="text-slate-200 dark:text-slate-800" strokeWidth="6" stroke="currentColor" fill="transparent" r="30" cx="40" cy="40" />
                    <circle className="text-sky-500 progress-ring-circle" strokeWidth="6" strokeDasharray="188.4" strokeDashoffset={188.4 - (188.4 * 78.2) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="30" cx="40" cy="40" />
                  </svg>
                  <span className="absolute text-xs font-bold">78%</span>
                </div>
              </div>

              {/* Vitals Hydration Wheel */}
              <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-primary">
                    <Droplet className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Daily Hydration</span>
                  </div>
                  <div className="text-2xl font-bold">1,850 ml</div>
                  <div className="text-xs text-slate-400">Target: 2,500 ml</div>
                </div>
                
                <div className="relative h-20 w-20 flex items-center justify-center">
                  <svg className="h-full w-full">
                    <circle className="text-slate-200 dark:text-slate-800" strokeWidth="6" stroke="currentColor" fill="transparent" r="30" cx="40" cy="40" />
                    <circle className="text-primary progress-ring-circle" strokeWidth="6" strokeDasharray="188.4" strokeDashoffset={188.4 - (188.4 * 74) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="30" cx="40" cy="40" />
                  </svg>
                  <span className="absolute text-xs font-bold">74%</span>
                </div>
              </div>

              {/* Vitals Telemetry Box */}
              <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-red-500">
                    <Thermometer className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Health Telemetry</span>
                  </div>
                  <div className="text-2xl font-bold">98.6 °F</div>
                  <div className="text-xs text-slate-400">Pulse: 72 bpm | BP: 118/76</div>
                </div>
                <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-500">
                  <Heart className="h-6 w-6 animate-pulse-slow" />
                </div>
              </div>

            </div>

            {/* Upcoming Appointments Section */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-lg">Upcoming Clinical Appointments</h2>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {appointments.map(appt => (
                  <div key={appt.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 text-primary p-2.5 rounded-xl">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">{appt.doctor}</div>
                        <div className="text-xs text-slate-400">{appt.specialty} • {appt.type}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-xs font-semibold">{appt.date}</div>
                        <div className="text-xs text-slate-400">{appt.time}</div>
                      </div>
                      
                      {appt.status === "pending_payment" ? (
                        <button 
                          onClick={() => { setActiveTab("booking"); setBookingStep("payment"); }}
                          className="px-3.5 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg text-xs transition-all shadow-md shadow-yellow-500/20"
                        >
                          Checkout Pending
                        </button>
                      ) : (
                        <button 
                          onClick={() => setActiveTab("telemedicine")}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center space-x-1"
                        >
                          <Video className="h-3 w-3" />
                          <span>Join Consultation</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* --- TAB: BOOK APPOINTMENT & PAYMENTS --- */}
        {activeTab === "booking" && (
          <div className="space-y-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold tracking-tight">Schedule Clinical Consultation</h1>

            {/* Step: Form Input */}
            {bookingStep === "form" && (
              <form onSubmit={handleBookSubmit} className="glass-card rounded-2xl p-6 space-y-6">
                
                {/* Department Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Department specialty</label>
                  <select 
                    value={selectedDept} 
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full h-12 px-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary text-sm font-medium"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                  </select>
                </div>

                {/* Doctor Cards Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Select Vetted Practitioner</label>
                  <div className="space-y-3">
                    {filteredDoctors.map(doc => (
                      <div 
                        key={doc.id}
                        onClick={() => setSelectedDoctor(doc)}
                        className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                          selectedDoctor?.id === doc.id 
                            ? "border-primary bg-sky-50/50 dark:bg-sky-950/20" 
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img src={doc.avatar} alt={doc.name} className="h-12 w-12 rounded-xl bg-slate-100" />
                          <div>
                            <div className="font-bold text-sm">{doc.name}</div>
                            <div className="text-xs text-slate-400">Fee: ₹{doc.fee}.00 • Rated: {doc.rating} ★</div>
                          </div>
                        </div>
                        <span className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          selectedDoctor?.id === doc.id ? "border-primary bg-primary text-white" : "border-slate-300"
                        }`}>
                          {selectedDoctor?.id === doc.id && <span className="h-1.5 w-1.5 bg-white rounded-full"></span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slots selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Select Date</label>
                    <input 
                      type="date" 
                      value={selectedDate} 
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full h-12 px-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Select Slot</label>
                    <select 
                      value={selectedSlot} 
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full h-12 px-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                    >
                      {selectedDoctor?.availability.map((time: string) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center space-x-2"
                >
                  <span>Reserve & Settle consultation fee</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {/* Step: Payments Checkout Gate */}
            {bookingStep === "payment" && (
              <div className="glass-card rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center space-x-2 text-primary font-bold">
                    <ShieldCheck className="h-5 w-5" />
                    <span>Secure Checkout Gateway</span>
                  </div>
                  <span className="text-sm font-bold text-teal-600">₹{selectedDoctor?.fee}.00</span>
                </div>

                <div className="space-y-4">
                  <div className="text-sm text-slate-500">
                    You are reserving a consultation with <span className="font-bold text-foreground">{selectedDoctor?.name}</span> on <span className="font-semibold text-foreground">{selectedDate}</span> at <span className="font-semibold text-foreground">{selectedSlot}</span>.
                  </div>

                  {/* Payment Method Selectors */}
                  <div className="grid grid-cols-3 gap-4">
                    <button 
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-4 border rounded-xl font-semibold text-xs flex flex-col items-center justify-center gap-2 ${
                        paymentMethod === "upi" ? "border-primary bg-sky-50/50 dark:bg-sky-950/20" : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <Activity className="h-5 w-5 text-emerald-500" />
                      <span>UPI (GPay/Paytm)</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 border rounded-xl font-semibold text-xs flex flex-col items-center justify-center gap-2 ${
                        paymentMethod === "card" ? "border-primary bg-sky-50/50 dark:bg-sky-950/20" : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <FileText className="h-5 w-5 text-primary" />
                      <span>Credit/Debit Card</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod("insurance")}
                      className={`p-4 border rounded-xl font-semibold text-xs flex flex-col items-center justify-center gap-2 ${
                        paymentMethod === "insurance" ? "border-primary bg-sky-50/50 dark:bg-sky-950/20" : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <ShieldCheck className="h-5 w-5 text-teal-500" />
                      <span>Health Insurance</span>
                    </button>
                  </div>

                  {/* Form fields simulator */}
                  {paymentMethod === "upi" ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">ENTER VPA / UPI ID</label>
                        <input type="text" placeholder="username@okhdfcbank" className="w-full h-11 px-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
                      </div>
                    </div>
                  ) : paymentMethod === "card" ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400">CARD NUMBER</label>
                        <input type="text" placeholder="•••• •••• •••• 4242" className="w-full h-11 px-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400">EXPIRY DATE</label>
                          <input type="text" placeholder="MM/YY" className="w-full h-11 px-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400">CVC</label>
                          <input type="text" placeholder="•••" className="w-full h-11 px-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">AYUSHMAN BHARAT HEALTH ID / POLICY ID</label>
                      <input type="text" placeholder="ABHA-998319-992" className="w-full h-11 px-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setBookingStep("form")}
                    className="flex-1 h-12 bg-slate-100 dark:bg-slate-800 font-semibold rounded-xl text-sm transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleConfirmPayment}
                    className="flex-2 h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl text-sm transition-all shadow-md"
                  >
                    Confirm & Complete Checkout
                  </button>
                </div>
              </div>
            )}

            {/* Step: Success screen */}
            {bookingStep === "success" && (
              <div className="glass-card rounded-2xl p-8 text-center space-y-6 animate-pulse-slow">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-500">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Consultation Successfully Locked!</h2>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    Your appointment has been logged in clinical schedules and verified in banking ledger matrices. A meeting link has been synced to your Telemedicine Room tab.
                  </p>
                </div>

                <button 
                  onClick={() => { setActiveTab("dashboard"); setBookingStep("form"); }}
                  className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm shadow-md hover:bg-primary-dark transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

          </div>
        )}

        {/* --- TAB: MEDICAL RECORDS & LAB VAULT --- */}
        {activeTab === "records" && (
          <div className="space-y-8">
            <h1 className="text-2xl font-bold tracking-tight">Clinical Medical Vault</h1>

            {/* List of medical records */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Record 1 */}
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-semibold uppercase">
                    Lab Report
                  </span>
                  <span className="text-xs text-slate-400">May 21, 2026</span>
                </div>
                <div>
                  <h3 className="font-bold text-base">Complete Lipid & Blood Profile</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Analyzed LDL, HDL, Triglycerides, Hemoglobin A1C. Fasting blood glucose: 88 mg/dL. LDL slightly elevated, otherwise optimal.
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                  <span className="text-xs text-slate-400">Authored by: Dr. Rajesh Sharma</span>
                  <button className="flex items-center space-x-1 text-xs text-primary font-semibold hover:underline">
                    <Download className="h-3 w-3" />
                    <span>Download Report</span>
                  </button>
                </div>
              </div>

              {/* Record 2 - Prescription */}
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 font-semibold uppercase">
                    Prescription Sheet
                  </span>
                  <span className="text-xs text-slate-400">May 21, 2026</span>
                </div>
                <div>
                  <h3 className="font-bold text-base">Digital Prescribed Rx Instructions</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Active medications: Magnesium Oxide 400mg (Once daily), Hydralazine 10mg. Restriction of caffeine past 2:00 PM advised.
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                  <span className="text-xs text-slate-400">Consultation Date: 2026-05-21</span>
                  
                  {/* Dynamic PDF Trigger */}
                  <button 
                    onClick={() => triggerPrescriptionMock(1)}
                    className="flex items-center space-x-1 text-xs text-primary font-semibold hover:underline"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download Prescription (PDF)</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- TAB: TELEMEDICINE ROOM SIMULATOR --- */}
        {activeTab === "telemedicine" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Dynamic Telemedicine Portal</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Telemedicine Video Frame Panel */}
              <div className="lg:col-span-8 bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-800 aspect-video flex items-center justify-center text-white">
                
                {/* Simulated Doctor Video Output */}
                <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800" 
                    alt="Doctor Feed" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute top-4 left-4 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold flex items-center space-x-1">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                    <span>DR. RAJESH SHARMA (LIVE FEED)</span>
                  </div>
                </div>

                {/* Patient self-feed visual overlay */}
                <div className="absolute bottom-16 right-4 w-32 h-24 bg-slate-950 rounded-xl overflow-hidden border border-slate-700 hidden sm:block">
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-[10px] font-semibold text-slate-400">
                    [Patient camera]
                  </div>
                </div>

                {/* Telemedicine bottom operations deck */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-slate-800 px-4 py-2 rounded-xl flex items-center space-x-4 shadow-lg">
                  <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200">
                    <Mic className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200">
                    <VideoOff className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200">
                    <Volume2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setActiveTab("dashboard")}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-red-500/20"
                  >
                    Disconnect Call
                  </button>
                </div>

              </div>

              {/* Sidebar Consult Diagnosis / Notes Panel */}
              <div className="lg:col-span-4 space-y-6">
                <div className="glass-card rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-sm flex items-center space-x-2 text-primary">
                    <Activity className="h-4 w-4 animate-pulse-slow" />
                    <span>Real-time Clinical Telemetry</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block font-medium">PULSE RATE</span>
                      <span className="font-semibold text-sm">74 bpm</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block font-medium">BLOOD OXYGEN</span>
                      <span className="font-semibold text-sm">99% SpO2</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 col-span-2">
                      <span className="text-slate-400 block font-medium">PATIENT DIAGNOSTIC WORKUP</span>
                      <span className="font-semibold block mt-1">EKG Monitor: Normal sinus rhythm</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-sm">Active Consult Advice</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Dr. Sharma suggests limiting stress indicators and tracking fluid intakes. Digital prescription keys will populate inside the Medical Vault automatically once the consultation terminates.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* --- SLIDE OUT AI DRAWER PANEL --- */}
      {isAiOpen && (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm flex justify-end">
          
          <div className="w-full max-w-md bg-background h-full shadow-2xl p-6 flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="bg-primary/10 text-primary p-2 rounded-xl">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI Clinical Triage Assistant</h3>
                  <span className="text-[10px] text-emerald-500 font-semibold uppercase">Expert Advisor online</span>
                </div>
              </div>
              <button onClick={() => setIsAiOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chats messages box */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form Box */}
            <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="e.g. 'persistent headache with nausea'" 
                  className="w-full h-11 pl-4 pr-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary text-xs"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 h-7 w-7 rounded-lg bg-primary hover:bg-primary-dark text-white flex items-center justify-center"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>

          </div>

        </div>
      )}

    </div>
  );
}
