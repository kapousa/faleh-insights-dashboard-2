import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  CheckCircle2,
  Building2,
  Lightbulb,
  Target,
  ShieldCheck,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ASSESSMENT_PHASES,
  calculateScore,
  submitAssessment,
  type AssessmentAnswers,
} from "@/lib/api";

const Onboarding = () => {
  const navigate = useNavigate();
  const [phaseIndex, setPhaseIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<AssessmentAnswers>({});

  // مرجع للحاوية اليمنى للتحكم في التمرير
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // إعادة التمرير للأعلى عند تغيير المرحلة
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [phaseIndex]);

  const setAnswer = (qId: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [qId]: value }));

  const currentPhase = phaseIndex >= 0 ? ASSESSMENT_PHASES[phaseIndex] : null;
  const totalPhases = ASSESSMENT_PHASES.length;

  const canNext =
    phaseIndex === -1
      ? businessName.trim() && contactName.trim() && email.trim()
      : currentPhase?.questions.every((q) => {
          if (q.type === "text") return (answers[q.id]?.trim().length ?? 0) > 0;
          return !!answers[q.id];
        });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const score = calculateScore(answers);
      // الحفاظ على المنطق الخاص بك لاستدعاء الـ Workflow
      await submitAssessment({ businessName, contactName, email, answers, score });

      sessionStorage.setItem("faleh_score", JSON.stringify(score));
      sessionStorage.setItem("faleh_answers", JSON.stringify(answers));
      sessionStorage.setItem("faleh_user_email", email);
      sessionStorage.setItem("faleh_business_name", businessName);

      navigate("/processing");
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col md:flex-row overflow-hidden font-sans">

      {/* Sidebar الجانبي الثابت */}
      <div className="w-full md:w-[380px] bg-[#0a1d37] p-10 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
        {/* لمسة جمالية للخلفية */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(#5c21ff 2px, transparent 2px)', backgroundSize: '30px 30px' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-[#5c21ff] flex items-center justify-center font-black italic text-xl shadow-lg">F</div>
            <span className="text-2xl font-black uppercase italic tracking-tighter">Faleh</span>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black uppercase italic text-[#ffcc00] mb-2 leading-tight">
                {phaseIndex === -1 ? "Initialization" : `Phase 0${phaseIndex + 1}`}
              </h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                {phaseIndex === -1
                  ? "Define your business identity to start the diagnostic process."
                  : currentPhase?.title}
              </p>
            </div>

            {/* مؤشر الخطوات العمودي */}
            <div className="space-y-4 pt-4 border-l border-white/10 ml-3 pl-6">
              <div className={`relative flex items-center gap-3 transition-opacity ${phaseIndex >= -1 ? "opacity-100" : "opacity-30"}`}>
                <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 ${phaseIndex >= -1 ? "bg-[#ffcc00] border-[#0a1d37]" : "bg-slate-700 border-[#0a1d37]"}`} />
                <span className="text-[10px] font-black uppercase italic tracking-wider">Business Info</span>
              </div>
              {ASSESSMENT_PHASES.map((phase, idx) => (
                <div key={idx} className={`relative flex items-center gap-3 transition-opacity ${phaseIndex >= idx ? "opacity-100" : "opacity-30"}`}>
                  <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 ${phaseIndex >= idx ? "bg-[#ffcc00] border-[#0a1d37]" : "bg-slate-700 border-[#0a1d37]"}`} />
                  <span className="text-[10px] font-black uppercase italic tracking-wider">{phase.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* صندوق النصائح الذكي */}
        <div className="relative z-10 bg-white/5 p-6 border-l-4 border-[#ffcc00] backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 text-[#ffcc00]">
            <Lightbulb size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">System Tip</span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic">
            {phaseIndex === -1
              ? "Accurate company details ensure your generated certificates and reports are legally valid."
              : "Quality of input directly affects the precision of the AI-driven gap analysis."}
          </p>
        </div>
      </div>

      {/* منطقة الـ Wizard مع التحكم في التمرير */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex flex-col relative overflow-y-auto bg-white scroll-smooth"
      >
        <div className="max-w-2xl w-full mx-auto px-8 py-16">

          <div className="mb-12 flex items-center justify-between border-b border-slate-50 pb-8">
            <div>
               <h1 className="text-3xl font-black uppercase italic tracking-tighter text-[#0a1d37]">Assessment</h1>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Franchise Readiness Audit</p>
            </div>
            <div className="text-right">
               <div className="text-[10px] font-black text-[#5c21ff] uppercase mb-1">Total Completion</div>
               <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((phaseIndex + 2) / (totalPhases + 1)) * 100}%` }}
                    className="h-full bg-[#5c21ff]"
                  />
               </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {phaseIndex === -1 ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-[#5c21ff] mb-2">
                    <Building2 size={18}/>
                    <span className="text-xs font-black uppercase tracking-widest">Identity</span>
                  </div>
                  <h2 className="text-4xl font-black uppercase italic text-[#0a1d37] leading-none">Who are we <br/><span className="text-[#5c21ff]">auditing?</span></h2>
                </div>

                <div className="grid gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Legal Entity Name</Label>
                    <Input className="h-16 rounded-none border-2 border-slate-100 bg-slate-50/30 text-lg font-bold focus:bg-white transition-all shadow-sm" value={businessName} onChange={(e)=>setBusinessName(e.target.value)} placeholder="e.g. Faleh Systems LLC" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Primary Contact</Label>
                      <Input className="h-16 rounded-none border-2 border-slate-100 bg-slate-50/30 font-bold" value={contactName} onChange={(e)=>setContactName(e.target.value)} placeholder="Full Name" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Business Email</Label>
                      <Input className="h-16 rounded-none border-2 border-slate-100 bg-slate-50/30 font-bold" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="name@company.com" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={currentPhase?.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="p-8 bg-[#0a1d37] text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#5c21ff] opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-2 text-[#ffcc00]">
                      <Target size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Phase Objective</span>
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tight">{currentPhase?.title}</h2>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-lg">{currentPhase?.description}</p>
                  </div>
                </div>

                <div className="space-y-12">
                  {currentPhase?.questions.map((q) => (
                    <div key={q.id} className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-1 h-8 bg-[#5c21ff] shrink-0" />
                        <Label className="text-xl font-black italic text-[#0a1d37] leading-tight">
                          {q.question}
                        </Label>
                      </div>

                      {q.type === "select" ? (
                        <div className="grid gap-3 pl-5">
                          {q.options?.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => setAnswer(q.id, opt.value)}
                              className={`p-5 text-left border-2 transition-all relative overflow-hidden group ${
                                answers[q.id] === opt.value 
                                ? "border-[#ffcc00] bg-[#ffcc00]/5 shadow-md" 
                                : "border-slate-100 hover:border-slate-200 bg-white"
                              }`}
                            >
                              <div className="flex items-center justify-between relative z-10">
                                <span className={`font-black uppercase italic text-xs tracking-wider ${answers[q.id] === opt.value ? "text-[#0a1d37]" : "text-slate-400 group-hover:text-slate-500"}`}>
                                  {opt.label}
                                </span>
                                {answers[q.id] === opt.value && (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    <ShieldCheck className="text-[#ffcc00]" size={20} />
                                  </motion.div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="pl-5">
                          <Textarea
                            value={answers[q.id] || ""}
                            onChange={(e) => setAnswer(q.id, e.target.value)}
                            className="min-h-[180px] rounded-none border-2 border-slate-100 focus:border-[#5c21ff] focus:ring-0 bg-slate-50/30 p-6 text-lg font-medium shadow-inner"
                            placeholder="Type your detailed response here..."
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* تذييل الصفحة (Footer Navigation) */}
          <div className="flex justify-between items-center mt-20 pt-8 border-t border-slate-100">
            <Button
              variant="ghost"
              className="font-black uppercase italic text-slate-400 hover:text-[#0a1d37] transition-all"
              onClick={() => (phaseIndex <= -1 ? navigate("/") : setPhaseIndex(phaseIndex - 1))}
            >
              Previous
            </Button>
            <Button
              className="bg-[#0a1d37] text-white rounded-none px-12 h-16 font-black uppercase italic hover:bg-[#5c21ff] shadow-xl transition-all disabled:opacity-30"
              onClick={() => phaseIndex < totalPhases - 1 ? setPhaseIndex(phaseIndex + 1) : handleSubmit()}
              disabled={!canNext || loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>
                  {phaseIndex < totalPhases - 1 ? "Next Step" : "Finalize Audit"}
                  <ArrowRight className="ml-2" size={20} />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;