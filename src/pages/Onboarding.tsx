// --- src/pages/Onboarding.tsx ---
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Loader2,
    Building2,
    User,
    Mail,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    ArrowRight
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

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [phaseIndex]);

    useEffect(() => {
        const verifiedEmail = sessionStorage.getItem("faleh_verified_email");
        if (verifiedEmail) setEmail(verifiedEmail);
    }, []);

    const setAnswer = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const totalPhases = ASSESSMENT_PHASES.length;
    const currentPhase = ASSESSMENT_PHASES[phaseIndex];

    const canNext = phaseIndex === -1
        ? businessName.length >= 2 && contactName.length >= 2 && email.includes("@")
        : currentPhase?.questions.every((q) => {
            const answer = answers[q.id];
            if (q.type === "select") return !!answer;
            if (q.type === "text") return !!answer && answer.trim().length >= 3; // Lowered threshold to help validation
            return false;
        });

    const handleSubmit = async () => {
        setLoading(true);
        const scoreResult = calculateScore(answers);
        try {
            await submitAssessment({ businessName, contactName, email, answers, score: scoreResult });
            navigate("/processing", { state: { score: scoreResult } });
        } catch (error) {
            navigate("/dashboard", { state: { score: scoreResult } });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans">
            {/* LEFT SIDEBAR: Status & Progress */}
            <div className="w-full md:w-96 bg-[#0a1d37] p-8 md:p-12 text-white flex flex-col justify-between shrink-0">
                <div className="space-y-12">
                    <div className="w-12 h-12 bg-[#5c21ff] flex items-center justify-center text-2xl font-black italic">ف</div>

                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-black uppercase italic leading-none tracking-tighter mb-2">
                                Strategic <br /> Audit
                            </h1>
                            <div className="h-1 w-12 bg-[#5c21ff]" />
                        </div>

                        {/* Progress Indicators */}
                        <div className="space-y-4">
                            {ASSESSMENT_PHASES.map((p, i) => (
                                <div key={p.id} className={`flex items-center gap-4 transition-opacity ${phaseIndex >= i ? "opacity-100" : "opacity-30"}`}>
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${phaseIndex > i ? "bg-[#5c21ff] border-[#5c21ff]" : "border-white/20"}`}>
                                        {phaseIndex > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest italic">{p.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">
                    Faleh Intelligence © 2024
                </div>
            </div>

            {/* RIGHT CONTENT: Questions */}
            <div className="flex-1 bg-white p-6 md:p-20 overflow-y-auto">
                <div className="max-w-2xl mx-auto h-full flex flex-col">
                    <AnimatePresence mode="wait">
                        {phaseIndex === -1 ? (
                            <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12 my-auto">
                                <div className="space-y-4">
                                    <h2 className="text-5xl md:text-7xl font-black text-[#0a1d37] uppercase italic leading-[0.85] tracking-tighter">Business <br />Profile</h2>
                                    <p className="text-slate-400 font-medium">Please confirm your identity to begin the diagnostic.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trading Name</Label>
                                        <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="h-16 rounded-none border-x-0 border-t-0 border-b-2 border-slate-100 focus:border-[#5c21ff] text-xl font-bold px-0 bg-transparent ring-0" placeholder="Brand Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                        <Input value={contactName} onChange={(e) => setContactName(e.target.value)} className="h-16 rounded-none border-x-0 border-t-0 border-b-2 border-slate-100 focus:border-[#5c21ff] text-xl font-bold px-0 bg-transparent ring-0" placeholder="Contact Person" />
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key={currentPhase.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-16">
                                <div className="space-y-2">
                                    <div className="text-[#5c21ff] text-xs font-black uppercase tracking-widest italic">Phase 0{phaseIndex + 1}</div>
                                    <h2 className="text-5xl font-black text-[#0a1d37] uppercase italic leading-none tracking-tighter">{currentPhase.title}</h2>
                                </div>

                                <div className="space-y-16">
                                    {currentPhase.questions.map((q) => (
                                        <div key={q.id} className="space-y-6">
                                            <Label className="text-2xl font-black text-[#0a1d37] leading-tight block">{q.question}</Label>
                                            {q.type === "select" ? (
                                                <div className="grid gap-3">
                                                    {q.options?.map((opt) => (
                                                        <button key={opt.value} onClick={() => setAnswer(q.id, opt.value)} className={`text-left p-6 border-2 transition-all ${answers[q.id] === opt.value ? "bg-[#0a1d37] border-[#0a1d37] text-white" : "border-slate-100 hover:border-[#5c21ff] text-slate-600"}`}>
                                                            <span className="text-lg font-bold uppercase italic">{opt.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Textarea value={answers[q.id] || ""} onChange={(e) => setAnswer(q.id, e.target.value)} className="min-h-[180px] rounded-none border-2 border-slate-100 p-6 text-lg font-medium focus:border-[#5c21ff]" placeholder="Describe your response..." />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer Nav */}
                    <div className="mt-auto pt-12 flex items-center justify-between">
                        <Button variant="ghost" className="font-black uppercase italic text-slate-400" onClick={() => phaseIndex <= -1 ? navigate("/") : setPhaseIndex(phaseIndex - 1)}>
                            <ChevronLeft className="mr-2 w-4 h-4" /> Back
                        </Button>
                        <Button className="h-16 px-12 bg-[#0a1d37] text-white font-black uppercase italic hover:bg-[#5c21ff] disabled:opacity-20 transition-all" onClick={() => phaseIndex < totalPhases - 1 ? setPhaseIndex(phaseIndex + 1) : handleSubmit()} disabled={!canNext || loading}>
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (phaseIndex === -1 ? "Start" : phaseIndex === totalPhases - 1 ? "Complete" : "Continue")}
                            <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;