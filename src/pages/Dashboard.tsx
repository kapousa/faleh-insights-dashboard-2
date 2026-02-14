import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Home, ChevronLeft, ChevronRight, BarChart3, MailCheck, Loader2, RefreshCw, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  calculateScore,
  type ScoreResult,
} from "@/lib/api";
import ScoreGauge from "@/components/ScoreGauge";
import CategoryBreakdown from "@/components/CategoryBreakdown";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [isSent, setIsSent] = useState(false);
  const businessName = sessionStorage.getItem("faleh_business_name") || "Your Business";

  useEffect(() => {
    const stored = sessionStorage.getItem("faleh_score");
    if (stored) {
      setScoreResult(JSON.parse(stored));
      // محاكاة إرسال الإيميل تلقائياً عند الوصول لأول مرة
      setIsSent(true);
    }
  }, []);

  if (!scoreResult) return null;

  return (
    <div className="min-h-screen bg-white flex text-[#0a1d37]">
      {/* Sidebar المحدث */}
      <motion.aside
        className={`border-r border-slate-100 bg-white flex-shrink-0 flex flex-col transition-all overflow-hidden ${sidebarOpen ? "w-64" : "w-16"}`}
        layout
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-50">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-none bg-[#5c21ff] flex items-center justify-center font-black text-white italic text-lg">
                F
              </div>
              <span className="font-black uppercase italic tracking-tighter text-[#0a1d37]">Faleh Insights</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-slate-50 rounded-full text-slate-400">
            {sidebarOpen ? <ChevronLeft size={18}/> : <ChevronRight size={18}/>}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold uppercase text-slate-400 hover:text-[#5c21ff] transition-colors">
            <Home size={18}/> {sidebarOpen && "Home"}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-black uppercase italic bg-[#5c21ff]/5 text-[#5c21ff] border-r-4 border-[#5c21ff]">
            <LayoutDashboard size={18}/> {sidebarOpen && "Dashboard"}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold uppercase text-slate-400 hover:text-[#5c21ff] transition-colors">
            <BarChart3 size={18}/> {sidebarOpen && "Detailed Score"}
          </button>
          <div className="pt-4 mt-4 border-t border-slate-50">
             <button onClick={() => navigate("/onboarding")} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold uppercase text-slate-400 hover:text-[#5c21ff] transition-colors">
              <RefreshCw size={18}/> {sidebarOpen && "New Audit"}
            </button>
          </div>
        </nav>
      </motion.aside>

      <main className="flex-1 overflow-y-auto bg-[#f8fafc]/30">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter text-[#0a1d37]">
              Analysis Results: <span className="text-[#5c21ff]">{businessName}</span>
            </h1>
          </div>

          {isSent && (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#5c21ff]/10 text-[#5c21ff] rounded-full text-xs font-black uppercase italic shadow-sm border border-[#5c21ff]/20">
              <MailCheck size={14} /> Report Sent to Inbox
            </div>
          )}
        </header>

        <div className="p-8 space-y-8 max-w-6xl mx-auto">
          {/* تنبيه النجاح الأرجواني */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#5c21ff] p-6 rounded-none flex items-center justify-between text-white shadow-xl shadow-[#5c21ff]/20 relative overflow-hidden"
          >
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80 mb-1">Strategic Status</p>
              <h2 className="text-2xl font-black uppercase italic leading-none">
                {scoreResult.category.label}
              </h2>
            </div>
            <div className="text-5xl opacity-20 absolute right-[-10px] top-[-10px] rotate-12">
               {scoreResult.category.emoji}
            </div>
            <Button variant="outline" className="relative z-10 bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-none font-bold uppercase text-xs italic">
              Download PDF
            </Button>
          </motion.div>

          <section className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center">
               <ScoreGauge score={scoreResult.totalScore} category={scoreResult.category} />
            </div>

            <div className="md:col-span-2 bg-white border border-slate-100 p-8 shadow-sm relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#ffcc00]"></div>
              <h3 className="text-xl font-black uppercase italic text-[#0a1d37] mb-4">Executive Summary</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                {scoreResult.category.description}
              </p>
              <div className="mt-6 flex gap-4">
                <div className="bg-slate-50 p-4 flex-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Target Score</p>
                  <p className="text-xl font-black text-[#0a1d37]">85+</p>
                </div>
                <div className="bg-slate-50 p-4 flex-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Current Gap</p>
                  <p className="text-xl font-black text-[#ffcc00]">{85 - scoreResult.totalScore} pts</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-100 p-8 shadow-sm">
            <h2 className="text-xl font-black uppercase italic text-[#0a1d37] mb-8 border-l-4 border-[#5c21ff] pl-4">
              Pillar Performance Breakdown
            </h2>
            <CategoryBreakdown phaseScores={scoreResult.phaseScores} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;