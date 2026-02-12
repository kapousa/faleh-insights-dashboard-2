// Onboarding.tsx - ملف محدث بالكامل
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Save, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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

  const setAnswer = (qId: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [qId]: value }));

  const currentPhase = phaseIndex >= 0 ? ASSESSMENT_PHASES[phaseIndex] : null;
  const totalPhases = ASSESSMENT_PHASES.length;
  const progressPct = ((phaseIndex + 1) / (totalPhases + 1)) * 100;

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
      await submitAssessment({ businessName, contactName, email, answers, score });

      // تخزين البيانات الأساسية للمرحلة التالية (الربط مع n8n)
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
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Progress indicators كما هي في ملفك الأصلي */}
        <div className="flex items-center gap-3 mb-3">
          {[{ title: "Info", icon: "📋" }, ...ASSESSMENT_PHASES.map((p) => ({ title: p.title, icon: p.icon }))].map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${i <= phaseIndex + 1 ? "bg-primary text-white" : "bg-secondary text-muted-foreground"}`}>
                {s.icon}
              </div>
              {i < totalPhases && <div className={`flex-1 h-px ${i < phaseIndex + 1 ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>
        <Progress value={progressPct} className="mb-8 h-1.5" />

        <motion.div className="rounded-2xl bg-card border border-border shadow-card p-8" layout>
          <AnimatePresence mode="wait">
            {phaseIndex === -1 ? (
              <motion.div key="intro" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Building2 className="text-primary"/> Business Info</h2>
                <div className="space-y-4">
                  <div><Label>Business Name</Label><Input value={businessName} onChange={(e)=>setBusinessName(e.target.value)} placeholder="e.g. Al Noor Café" /></div>
                  <div><Label>Contact Name</Label><Input value={contactName} onChange={(e)=>setContactName(e.target.value)} placeholder="Ahmed Al-Rashid" /></div>
                  <div><Label>Email Address</Label><Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="ahmed@example.com" /></div>
                </div>
              </motion.div>
            ) : (
              <motion.div key={currentPhase?.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-6">{currentPhase?.icon} {currentPhase?.title}</h2>
                <div className="space-y-6">
                  {currentPhase?.questions.map((q) => (
                    <div key={q.id} className="space-y-3">
                      <Label className="text-sm leading-relaxed">{q.question}</Label>
                      {q.type === "select" ? (
                        <div className="grid gap-2">
                          {q.options?.map((opt) => (
                            <button key={opt.value} onClick={() => setAnswer(q.id, opt.value)} className={`p-3 rounded-xl border text-left transition-all ${answers[q.id] === opt.value ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:border-primary/50"}`}>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <Textarea value={answers[q.id] || ""} onChange={(e) => setAnswer(q.id, e.target.value)} className="min-h-[100px]" placeholder="Describe in detail..." />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button variant="ghost" onClick={() => (phaseIndex <= -1 ? navigate("/") : setPhaseIndex(phaseIndex - 1))}>Back</Button>
            <Button onClick={() => phaseIndex < totalPhases - 1 ? setPhaseIndex(phaseIndex + 1) : handleSubmit()} disabled={!canNext || loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {phaseIndex < totalPhases - 1 ? "Continue" : "Submit Assessment"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;