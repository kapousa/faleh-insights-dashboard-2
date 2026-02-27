// --- src/pages/Onboarding.tsx ---
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Loader2,
    Building2,
    User,
    Mail,
    ChevronRight,
    ChevronLeft,
    CheckCircle2
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

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Ensure we scroll to top when moving between phases
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
            // Fixes validation for 'na' selection
            if (q.type === "select") return !!answer;
            if (q.type === "text") return !!answer && answer.length > 10;
            return false;
        });

    const handleSubmit = async () => {
        setLoading(true);
        const scoreResult = calculateScore(answers);

        const submissionData = {
            businessName,
            contactName,
            email,
            totalScore: scoreResult.totalScore,
            categoryLabel: scoreResult.category.label,
            // Extracting scores correctly for n8n processing
            brandScore: scoreResult.phaseScores.find(p => p.phaseId === 'A')?.percentage || 0,
            opsScore: scoreResult.phaseScores.find(p => p.phaseId === 'B')?.percentage || 0,
            finScore: scoreResult.phaseScores.find(p => p.phaseId === 'C')?.percentage || 0,
            answers,
            score: scoreResult
        };

        try {
            await submitAssessment(submissionData);
            navigate("/processing", { state: { score: scoreResult } });
        } catch (error) {
            console.error("Submission failed", error);
            navigate("/dashboard", { state: { score: scoreResult } });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#5c21ff]/10">
            {/* Main Content Area */}
            <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 md:py-20">
                <AnimatePresence mode="wait">
                    {phaseIndex === -1 ? (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            <div className="space-y-4">
                                <div className="inline-block px-4 py-1.5 bg-[#5c21ff]/5 text-[#5c21ff] text-xs font-black uppercase tracking-widest italic border border-[#5c21ff]/10">
                                    Strategic Audit 2.0
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-[#0a1d37] tracking-tighter italic uppercase leading-[0.85]">
                                    Franchise <br />Readiness
                                </h1>
                            </div>

                            <div className="grid gap-8">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Business Identity</Label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#5c21ff] transition-colors" />
                                        <Input
                                            value={businessName}
                                            onChange={(e) => setBusinessName(e.target.value)}
                                            className="h-20 pl-16 rounded-none border-2 border-slate-100 focus:border-[#5c21ff] focus:ring-0 text-xl font-bold placeholder:text-slate-200"
                                            placeholder="Trading Name"
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Contact Name</Label>
                                        <Input
                                            value={contactName}
                                            onChange={(e) => setContactName(e.target.value)}
                                            className="h-20 px-8 rounded-none border-2 border-slate-100 focus:border-[#5c21ff] focus:ring-0 text-xl font-bold"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Verified Email</Label>
                                        <Input value={email} readOnly className="h-20 px-8 rounded-none border-2 border-slate-50 bg-slate-50 text-xl font-bold text-slate-400" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={currentPhase.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="flex items-end justify-between border-b-8 border-[#0a1d37] pb-6">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5c21ff]">Phase 0{phaseIndex + 1} / 0{totalPhases}</div>
                                    <h2 className="text-5xl md:text-6xl font-black text-[#0a1d37] uppercase italic leading-none">{currentPhase.title}</h2>
                                </div>
                                <span className="text-6xl hidden md:block opacity-20">{currentPhase.icon}</span>
                            </div>

                            <div className="space-y-16">
                                {currentPhase.questions.map((q) => (
                                    <div key={q.id} className="space-y-6">
                                        <Label className="text-xl md:text-2xl font-black text-[#0a1d37] leading-tight block">
                                            {q.question}
                                        </Label>

                                        {q.type === "select" ? (
                                            <div className="grid gap-3">
                                                {q.options?.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => setAnswer(q.id, opt.value)}
                                                        className={`group relative text-left p-6 transition-all border-2 ${
                                                            answers[q.id] === opt.value 
                                                            ? "bg-[#0a1d37] border-[#0a1d37] text-white" 
                                                            : "border-slate-100 hover:border-[#5c21ff] bg-white text-slate-600"
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-lg font-bold uppercase italic tracking-tight">{opt.label}</span>
                                                            {answers[q.id] === opt.value && <CheckCircle2 className="w-6 h-6 text-[#5c21ff]" />}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <Textarea
                                                value={answers[q.id] || ""}
                                                onChange={(e) => setAnswer(q.id, e.target.value)}
                                                className="min-h-[200px] rounded-none border-2 border-slate-100 p-8 text-lg font-medium focus:border-[#5c21ff] focus:ring-0"
                                                placeholder="Please provide details..."
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Fixed Navigation Bottom Bar */}
                <div className="mt-20 pt-10 border-t-2 border-slate-50 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        className="h-16 px-8 rounded-none font-black uppercase italic text-slate-400 tracking-widest hover:bg-slate-50"
                        onClick={() => phaseIndex <= -1 ? navigate("/") : setPhaseIndex(phaseIndex - 1)}
                    >
                        <ChevronLeft className="mr-2 w-5 h-5" /> Back
                    </Button>

                    <Button
                        className="h-16 px-12 rounded-none bg-[#0a1d37] text-white font-black uppercase italic tracking-widest hover:bg-[#5c21ff] disabled:opacity-20 transition-all shadow-[8px_8px_0px_rgba(10,29,55,0.1)] active:translate-y-[2px]"
                        onClick={() => phaseIndex < totalPhases - 1 ? setPhaseIndex(phaseIndex + 1) : handleSubmit()}
                        disabled={!canNext || loading}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin h-6 w-6" />
                        ) : (
                            <>
                                {phaseIndex === totalPhases - 1 ? "Submit Audit" : phaseIndex === -1 ? "Start Audit" : "Next Phase"}
                                <ChevronRight className="ml-2 w-5 h-5" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;