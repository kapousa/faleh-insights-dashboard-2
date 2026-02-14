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
           <div className="relative w-full h-[500px] flex items-center justify-center">
  {/* خلفية هندسية متدرجة */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#5c21ff]/10 to-transparent rounded-3xl -rotate-3 transform scale-95" />

  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
    className="relative w-full h-full bg-[#0a1d37] rounded-3xl shadow-2xl overflow-hidden border border-[#5c21ff]/20 flex items-center justify-center"
  >
    {/* نمط النقاط في الخلفية */}
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#5c21ff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

    {/* المحتوى البصري المكون من أيقونات وبيانات */}
    <div className="relative z-10 grid grid-cols-2 gap-4 p-8">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-3"
      >
        <ClipboardCheck className="text-[#ffcc00] w-12 h-12" />
        <div className="h-2 w-16 bg-slate-600 rounded-full" />
        <div className="h-2 w-10 bg-slate-700 rounded-full" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-3"
      >
        <BarChart3 className="text-[#5c21ff] w-12 h-12" />
        <div className="h-2 w-12 bg-slate-600 rounded-full" />
        <div className="h-2 w-20 bg-slate-700 rounded-full" />
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="col-span-2 bg-[#5c21ff]/20 border border-[#5c21ff]/40 p-6 rounded-2xl flex items-center justify-between"
      >
        <div className="space-y-2">
          <div className="h-3 w-32 bg-white/20 rounded-full" />
          <div className="h-3 w-20 bg-white/10 rounded-full" />
        </div>
        <FileText className="text-white w-10 h-10" />
      </motion.div>
    </div>

    {/* تأثيرات ضوئية متحركة في الخلفية */}
    <motion.div
      animate={{
        boxShadow: ["0 0 20px #5c21ff", "0 0 50px #5c21ff", "0 0 20px #5c21ff"]
      }}
      transition={{ duration: 5, repeat: Infinity }}
      className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#5c21ff]/30 rounded-full blur-[80px]"
    />
  </motion.div>

  {/* بطاقة تقييم صغيرة تطفو فوق الشكل */}
  <motion.div
    initial={{ x: 50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.8 }}
    className="absolute -right-8 top-1/4 bg-white p-4 shadow-2xl border border-slate-100 hidden lg:block"
  >
    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Success Rate</p>
    <p className="text-2xl font-black italic text-[#0a1d37]">+92%</p>
  </motion.div>
</div>
        </div>
      </main>
    </div>
  );
};
export default Index;
