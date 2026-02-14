import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Home, ChevronLeft, ChevronRight, Download, RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateScore, type ScoreResult } from "@/lib/api";
import ScoreGauge from "@/components/ScoreGauge";
import CategoryBreakdown from "@/components/CategoryBreakdown";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const businessName = sessionStorage.getItem("faleh_business_name") || "Your Business";

  useEffect(() => {
    const stored = sessionStorage.getItem("faleh_score");
    if (stored) {
      setScoreResult(JSON.parse(stored));
    } else {
      navigate("/onboarding");
    }
  }, [navigate]);

  if (!scoreResult) return null;

  return (
    <div className="min-h-screen bg-white flex text-[#0a1d37]">
      {/* Sidebar */}
      <aside className={`border-r border-slate-100 bg-white transition-all ${sidebarOpen ? "w-64" : "w-20"}`}>
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          {sidebarOpen && <span className="font-black uppercase italic tracking-tighter">Faleh Insights</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-slate-50 rounded text-slate-400">
            {sidebarOpen ? <ChevronLeft size={20}/> : <ChevronRight size={20}/>}
          </button>
        </div>
        <nav className="p-4 space-y-4">
           <div className="flex items-center gap-3 p-3 bg-[#5c21ff]/5 text-[#5c21ff] font-black uppercase italic text-xs border-r-4 border-[#5c21ff]">
              <LayoutDashboard size={18} /> {sidebarOpen && "Audit Analysis"}
           </div>
           <button onClick={() => navigate("/onboarding")} className="flex items-center gap-3 p-3 text-slate-400 font-bold uppercase text-xs hover:text-[#0a1d37]">
              <RefreshCw size={18} /> {sidebarOpen && "New Audit"}
           </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#f8fafc]/30 overflow-y-auto">
        <header className="bg-white border-b border-slate-100 p-8 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">
              Business: <span className="text-[#5c21ff]">{businessName}</span>
            </h1>
          </div>
          <Button className="bg-[#0a1d37] hover:bg-[#5c21ff] text-white rounded-none font-black uppercase italic px-8 h-12 shadow-lg transition-all">
            <Download size={16} className="mr-2" /> Download Full Report
          </Button>
        </header>

        <div className="p-8 max-w-6xl mx-auto space-y-8">
          {/* Hero Score Section */}
          <div className="bg-[#0a1d37] p-10 rounded-none text-white relative overflow-hidden flex items-center justify-between shadow-2xl">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffcc00] mb-2">Franchise Readiness Index</p>
              <h2 className="text-4xl font-black uppercase italic">{scoreResult.category.label}</h2>
              <p className="mt-4 text-slate-400 max-w-md font-medium">{scoreResult.category.description}</p>
            </div>
            <div className="text-9xl font-black italic opacity-10 absolute right-[-20px] top-[-20px] select-none">
              {scoreResult.totalScore}%
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center">
              <ScoreGauge score={scoreResult.totalScore} category={scoreResult.category} />
            </div>
            <div className="md:col-span-2 bg-white border border-slate-100 p-8 shadow-sm relative">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ffcc00]"></div>
              <h3 className="text-xl font-black uppercase italic mb-6">Strategic Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-6">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Target Score</p>
                    <p className="text-3xl font-black italic text-[#0a1d37]">85<span className="text-sm font-bold text-slate-300">/100</span></p>
                 </div>
                 <div className="bg-slate-50 p-6">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Gap to Scale</p>
                    <p className="text-3xl font-black italic text-[#ffcc00]">-{85 - scoreResult.totalScore} pts</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <section className="bg-white border border-slate-100 p-8 shadow-sm">
            <h2 className="text-xl font-black uppercase italic mb-8 border-l-4 border-[#5c21ff] pl-4">Pillar Performance</h2>
            <CategoryBreakdown phaseScores={scoreResult.phaseScores} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;