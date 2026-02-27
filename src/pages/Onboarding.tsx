import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Loader2,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    LayoutDashboard
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
        const verifiedEmail = sessionStorage.getItem("faleh_verified_email");
        if (verifiedEmail) setEmail(verifiedEmail);
        window.scrollTo(0, 0);
    }, [phaseIndex]);

    const setAnswer = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const totalPhases = ASSESSMENT_PHASES.length;
    const currentPhase = ASSESSMENT_PHASES[phaseIndex];

    const canNext = phaseIndex === -1
        ? businessName.length >= 2 && contactName.length >= 2
        : currentPhase?.questions.every((q) => {
            const val = answers[q.id];
            return q.type === "select" ? !!val : !!val && val.trim().length > 2;
        });

    const handleSubmit = async () => {
        setLoading(true);
        const scoreResult = calculateScore(answers);
        try {
            await submitAssessment({ businessName, contactName, email, answers, totalScore: scoreResult.totalScore });
            navigate("/processing", { state: { score: scoreResult } });
        } catch (error) {
            navigate("/dashboard", { state: { score: scoreResult } });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans">
            {/* LEFT SIDEBAR */}
            <div className="w-full md:w-[400px] bg-[#0a1d37] p-8 md:p-12 text-white flex flex-col shrink-0">
                <div className="mb-12">
                    <div className="w-12 h-12 bg-[#5c21ff] flex items-center justify-center text-2xl font-black italic mb-8">ف</div>
                    <h1 className="text-4xl font-black uppercase italic leading-[0.9] tracking-tighter">STRATEGIC<br />AUDIT</h1>
                    <div className="h-1 w-12 bg-[#5c21ff] mt-4" />
                </div>

                <div className="space-y-6 flex-1">
                    {ASSESSMENT_PHASES.map((phase, i) => (
                        <div key={phase.id} className={`flex items-center gap-4 transition-all duration-500 ${phaseIndex >= i ? "opacity-100" : "opacity-20"}`}>
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${phaseIndex > i ? "bg-[#5c21ff] border-[#5c21ff]" : "border-white/20"}`}>
                                {phaseIndex > i ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                            </div>
                            <span className="text-sm font-black uppercase italic tracking-widest">{phase.title}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-8 border-t border-white/10 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
                    Faleh Intelligence System v1.0
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 bg-white p-6 md:p-24 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                    <AnimatePresence mode="wait">
                        {phaseIndex === -1 ? (
                            <motion.div key="intro" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                                <h2 className="text-6xl font-black text-[#0a1d37] uppercase italic tracking-tighter">Welcome</h2>
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase text-slate-400">Business Name</Label>
                                        <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="h-16 text-xl font-bold border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#5c21ff]" placeholder="Enter Trading Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase text-slate-400">Contact Person</Label>
                                        <Input value={contactName} onChange={(e) => setContactName(e.target.value)} className="h-16 text-xl font-bold border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#5c21ff]" placeholder="Your Full Name" />
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key={currentPhase.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-16">
                                <h2 className="text-5xl font-black text-[#0a1d37] uppercase italic tracking-tighter leading-none">{currentPhase.title}</h2>
                                <div className="space-y-12">
                                    {currentPhase.questions.map((q) => (
                                        <div key={q.id} className="space-y-6">
                                            <Label className="text-2xl font-black text-[#0a1d37] block leading-tight">{q.question}</Label>
                                            {q.type === "select" ? (
                                                <div className="grid gap-3">
                                                    {q.options?.map((opt) => (
                                                        <button key={opt.value} onClick={() => setAnswer(q.id, opt.value)} className={`w-full text-left p-6 border-2 font-bold uppercase italic transition-all ${answers[q.id] === opt.value ? "bg-[#0a1d37] border-[#0a1d37] text-white" : "border-slate-100 hover:border-[#5c21ff] text-slate-500"}`}>
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Textarea value={answers[q.id] || ""} onChange={(e) => setAnswer(q.id, e.target.value)} className="min-h-[200px] text-lg font-medium border-2 border-slate-100 p-6 focus-visible:ring-0 focus-visible:border-[#5c21ff]" placeholder="Your detailed response..." />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex justify-between items-center mt-20 pt-10 border-t-2 border-slate-50">
                        <Button variant="ghost" className="font-black uppercase italic text-slate-400" onClick={() => phaseIndex === -1 ? navigate("/") : setPhaseIndex(p => p - 1)}>
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button className="h-16 px-12 bg-[#0a1d37] text-white font-black uppercase italic hover:bg-[#5c21ff] disabled:opacity-20" onClick={() => phaseIndex < totalPhases - 1 ? setPhaseIndex(p => p + 1) : handleSubmit()} disabled={!canNext || loading}>
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (phaseIndex === -1 ? "Start Audit" : phaseIndex === totalPhases - 1 ? "Finish" : "Next Phase")}
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;