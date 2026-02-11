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
  const [phaseIndex, setPhaseIndex] = useState(-1); // -1 = intro step
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
    const score = calculateScore(answers);
    await submitAssessment({ businessName, contactName, email, answers, score });
    // Store score in sessionStorage for the results page
    sessionStorage.setItem("faleh_score", JSON.stringify(score));
    sessionStorage.setItem("faleh_answers", JSON.stringify(answers));
    navigate("/processing");
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-emerald flex items-center justify-center font-bold text-primary-foreground text-sm">ف</div>
            <span className="text-xl font-bold text-foreground">Faleh</span>
          </button>
        </div>

        {/* Phase indicators */}
        <div className="flex items-center gap-3 mb-3">
          {[{ title: "Business Info", icon: "📋" }, ...ASSESSMENT_PHASES.map((p) => ({ title: p.title, icon: p.icon }))].map((s, i) => (
            <div key={s.title} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  i <= phaseIndex + 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {s.icon}
              </div>
              <span className={`text-xs hidden sm:block ${i <= phaseIndex + 1 ? "text-foreground" : "text-muted-foreground"}`}>
                {s.title}
              </span>
              {i < totalPhases && <div className={`flex-1 h-px mx-1 ${i < phaseIndex + 1 ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>
        <Progress value={progressPct} className="mb-8 h-1.5" />

        {/* Card */}
        <motion.div className="rounded-2xl gradient-card border border-border shadow-card p-8" layout>
          <AnimatePresence mode="wait">
            {/* Intro Step */}
            {phaseIndex === -1 && (
              <motion.div key="intro" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-3 mb-1">
                  <Building2 className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Business Information</h2>
                </div>
                <p className="text-muted-foreground text-sm mb-8">Tell us about the business you'd like evaluated for franchise readiness.</p>
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="businessName">Business / Brand Name</Label>
                    <Input id="businessName" placeholder="e.g. Al Noor Café" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input id="contactName" placeholder="Ahmed Al-Rashid" value={contactName} onChange={(e) => setContactName(e.target.value)} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="ahmed@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Assessment Phases */}
            {currentPhase && (
              <motion.div
                key={currentPhase.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">{currentPhase.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Phase {phaseIndex + 1}: {currentPhase.title}
                    </h2>
                    <p className="text-muted-foreground text-sm">{currentPhase.subtitle} — Weight: {currentPhase.weight}%</p>
                  </div>
                </div>

                <div className="space-y-6 mt-8">
                  {currentPhase.questions.map((q) => (
                    <div key={q.id} className="space-y-3">
                      <Label className="text-sm leading-relaxed">
                        <span className="text-primary font-mono mr-2">{q.id}</span>
                        {q.question}
                        <span className="text-muted-foreground ml-1 text-xs">({q.maxPoints} pts)</span>
                      </Label>

                      {q.type === "select" && q.options && (
                        <div className="grid gap-2">
                          {q.options.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => setAnswer(q.id, opt.value)}
                              className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${
                                answers[q.id] === opt.value
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border bg-secondary/50 text-muted-foreground hover:border-muted-foreground"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {q.type === "text" && (
                        <Textarea
                          placeholder="Describe in detail..."
                          value={answers[q.id] || ""}
                          onChange={(e) => setAnswer(q.id, e.target.value)}
                          className="min-h-[100px]"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => (phaseIndex <= -1 ? navigate("/") : setPhaseIndex(phaseIndex - 1))}
              className="text-muted-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="flex gap-2">
              {phaseIndex >= 0 && (
                <Button variant="outline" size="sm" className="text-xs">
                  <Save className="mr-1 h-3 w-3" /> Save Draft
                </Button>
              )}
              {phaseIndex < totalPhases - 1 ? (
                <Button onClick={() => setPhaseIndex(phaseIndex + 1)} disabled={!canNext}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!canNext || loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {loading ? "Submitting..." : "Submit Assessment"}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
