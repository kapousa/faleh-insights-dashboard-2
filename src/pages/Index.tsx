import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipboardCheck, BarChart3, FileText, Lightbulb, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

// 1. Features Section Design with English Content
const FeaturesSection = () => (
  <section id="features-section" className="py-24 bg-slate-50 border-t border-slate-100">
    <div className="max-w-6xl mx-auto px-10">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-5xl font-black text-[#0a1d37] italic uppercase tracking-tighter">
          Why Choose <span className="text-[#5c21ff]">Faleh</span>?
        </h2>
        <p className="text-slate-500 font-medium text-lg">The ultimate diagnostic for Middle Eastern franchise expansion.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Strategic Analysis",
            desc: "Measure your business model's readiness for scalability using international franchise standards.",
            icon: <BarChart3 className="w-8 h-8 text-[#5c21ff]" />
          },
          {
            title: "Instant Reporting",
            desc: "Receive a comprehensive Strategic Evaluation Report immediately after completing the audit.",
            icon: <FileText className="w-8 h-8 text-[#5c21ff]" />
          },
          {
            title: "Expert Insights",
            desc: "Identify specific strengths and weaknesses to strengthen your brand before going to market.",
            icon: <Lightbulb className="w-8 h-8 text-[#5c21ff]" />
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white p-10 border-b-4 border-slate-200 hover:border-[#5c21ff] shadow-sm transition-all group"
          >
            <div className="mb-6 p-3 bg-slate-50 w-fit rounded-xl group-hover:bg-[#5c21ff]/10 transition-colors">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-black text-[#0a1d37] mb-3 italic uppercase tracking-tight">{feature.title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Index = () => {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

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
            <Button
              onClick={() => navigate("/verify")}
              className="bg-[#ffcc00] text-[#0a1d37] hover:bg-[#5c21ff] hover:text-white font-black px-12 py-8 rounded-none text-xl transition-all shadow-lg italic uppercase"
            >
              GET STARTED
            </Button>

            <Button
              variant="outline"
              onClick={scrollToFeatures}
              className="border-2 border-[#5c21ff] text-[#5c21ff] hover:bg-[#5c21ff] hover:text-white font-black italic uppercase px-8 h-16 rounded-none tracking-tight transition-all"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Visual Animation Box */}
        <div className="hidden md:block bg-slate-50 aspect-square rounded-full border-dashed border-2 border-slate-200">
          <div className="relative w-full h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#5c21ff]/10 to-transparent rounded-3xl -rotate-3 transform scale-95" />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-full bg-[#0a1d37] rounded-3xl shadow-2xl overflow-hidden border border-[#5c21ff]/20 flex items-center justify-center"
            >
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#5c21ff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

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
            </motion.div>
          </div>
        </div>
      </main>

      {/* English Features Section */}
      <FeaturesSection />
    </div>
  );
};

export default Index;