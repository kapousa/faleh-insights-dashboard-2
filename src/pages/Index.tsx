import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ClipboardCheck, BarChart3, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: ClipboardCheck,
    title: "Diagnostic Assessment",
    description: "Evaluate your business across brand viability, operations readiness, and financial health.",
  },
  {
    icon: BarChart3,
    title: "Readiness Score",
    description: "Get a clear 0–100 score with category breakdown based on The UAE standards.",
  },
  {
    icon: FileText,
    title: "AI-Powered Report",
    description: "Receive a detailed franchise readiness report with actionable improvement recommendations.",
  },
];

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white text-[#0a1d37] font-sans">
      <nav className="flex items-center justify-between px-10 py-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#5c21ff] rounded-lg flex items-center justify-center font-black text-white italic text-xl">F</div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">Faleh</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-10 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h1 className="text-7xl font-black leading-[0.9] uppercase italic tracking-tighter text-[#0a1d37]">
            Franchising best <br/> <span className="text-[#5c21ff]">brands</span> made easy!
          </h1>
          <p className="text-slate-500 text-xl max-w-lg leading-relaxed font-medium">
            Professional franchise feasibility studies and operational audits tailored for the Middle East market.
          </p>
          <div className="flex gap-4 pt-4">
            <Button onClick={() => navigate("/onboarding")} className="bg-[#ffcc00] text-[#0a1d37] hover:bg-[#5c21ff] hover:text-white font-black px-12 py-8 rounded-none text-xl transition-all shadow-lg">
              GET STARTED
            </Button>
            <Button variant="outline" className="bg-[#000000] border-[#5c21ff] text-[#aaaaaa] hover:bg-slate-50 font-black px-12 py-8 rounded-none text-xl">
              LEARN MORE
            </Button>
          </div>
        </div>
        <div className="hidden md:block bg-slate-50 aspect-square rounded-full border-dashed border-2 border-slate-200">
           {/* Placeholder for Hero Image */}
        </div>
      </main>
    </div>
  );
};
export default Index;
