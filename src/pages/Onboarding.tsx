import {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";
import {
    ArrowRight,
    Loader2,
    Building2,
    Lightbulb,
    Target,
    ShieldCheck
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
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

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({top: 0, behavior: "smooth"});
        }
    }, [phaseIndex]);

    useEffect(() => {
        const verifiedEmail = sessionStorage.getItem("faleh_verified_email");
        if (verifiedEmail) {
            setEmail(verifiedEmail);
        }
    }, []);

    const setAnswer = (qId: string, value: string) =>
        setAnswers((prev) => ({...prev, [qId]: value}));

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
            // 1. Calculate scores
            const scoreResult = calculateScore(answers);
            const brandScore = scoreResult.phaseScores.find(p => p.phaseId === "A")?.percentage || 0;
            const opsScore = scoreResult.phaseScores.find(p => p.phaseId === "B")?.percentage || 0;
            const finScore = scoreResult.phaseScores.find(p => p.phaseId === "C")?.percentage || 0;

            // 2. Prepare payload exactly as api.ts expects
            const submissionData = {
                businessName,
                contactName,
                email,
                totalScore: scoreResult.totalScore,
                categoryLabel: scoreResult.category.label,
                brandScore,
                opsScore,
                finScore,
                answers,
                score: scoreResult // This passes the full ScoreResult object required by api.ts
            };

            // 3. Submit to n8n
            const response = await submitAssessment(submissionData);

            // 4. Capture Download Link
            // We cast to 'any' here just to bypass local type strictness for the n8n response
            const resData = response as any;
            const finalLink = resData?.downloadLink || (resData?.data && resData?.data.downloadLink);

            if (finalLink) {
                localStorage.setItem("pdf_download_url", finalLink);
            }

            // 5. Local Persistence
            localStorage.setItem("assessment_results", JSON.stringify(scoreResult));
            localStorage.setItem("business_name", businessName);
            localStorage.setItem("user_email", email);

            navigate("/processing");

        } catch (error) {
            console.error("Submission failed:", error);
            navigate("/processing");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfd] flex flex-col md:flex-row overflow-hidden font-sans">
            {/* Sidebar */}
            <div className="w-full md:w-[380px] bg-[#0a1d37] p-10 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
                     style={{ backgroundImage: 'radial-gradient(#5c21ff 2px, transparent 2px)', backgroundSize: '30px 30px' }}/>

                <div className="relative z-10">
                    <button onClick={() => navigate("/")} className="flex items-center gap-3 mb-12 group bg-transparent border-none p-0 text-left cursor-pointer">
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-lg shadow-lg group-hover:scale-110 transition-transform" />
                        <span className="text-2xl font-black uppercase italic tracking-tighter">Faleh</span>
                    </button>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-black uppercase italic text-[#ffcc00] mb-2 leading-tight">
                                {phaseIndex === -1 ? "Initialization" : `Phase 0${phaseIndex + 1}`}
                            </h2>
                            <p className="text-slate-400 text-sm font-medium">
                                {phaseIndex === -1 ? "Define your business identity." : currentPhase?.title}
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-l border-white/10 ml-3 pl-6">
                            <div className={`relative flex items-center gap-3 ${phaseIndex >= -1 ? "opacity-100" : "opacity-30"}`}>
                                <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 ${phaseIndex >= -1 ? "bg-[#ffcc00] border-[#0a1d37]" : "bg-slate-700 border-[#0a1d37]"}`}/>
                                <span className="text-[10px] font-black uppercase italic tracking-wider">Info</span>
                            </div>
                            {ASSESSMENT_PHASES.map((phase, idx) => (
                                <div key={idx} className={`relative flex items-center gap-3 ${phaseIndex >= idx ? "opacity-100" : "opacity-30"}`}>
                                    <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 ${phaseIndex >= idx ? "bg-[#ffcc00] border-[#0a1d37]" : "bg-slate-700 border-[#0a1d37]"}`}/>
                                    <span className="text-[10px] font-black uppercase italic tracking-wider">{phase.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative z-10 bg-white/5 p-6 border-l-4 border-[#ffcc00] backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2 text-[#ffcc00]">
                        <Lightbulb size={16}/>
                        <span className="text-[10px] font-black uppercase tracking-widest">System Tip</span>
                    </div>
                    <p className="text-[11px] text-slate-300 italic">
                        {phaseIndex === -1 ? "Accurate details ensure report validity." : "Input quality affects AI precision."}
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div ref={scrollContainerRef} className="flex-1 flex flex-col relative overflow-y-auto bg-white scroll-smooth">
                <div className="max-w-2xl w-full mx-auto px-8 py-16">
                    <div className="mb-12 flex items-center justify-between border-b border-slate-50 pb-8">
                        <div>
                            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-[#0a1d37]">Assessment</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Franchise Audit</p>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-black text-[#5c21ff] uppercase mb-1">Completion</div>
                            <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div animate={{width: `${((phaseIndex + 2) / (totalPhases + 1)) * 100}%`}} className="h-full bg-[#5c21ff]" />
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {phaseIndex === -1 ? (
                            <motion.div key="intro" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} className="space-y-10">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 text-[#5c21ff] mb-2">
                                        <Building2 size={18}/><span className="text-xs font-black uppercase tracking-widest">Identity</span>
                                    </div>
                                    <h2 className="text-4xl font-black uppercase italic text-[#0a1d37]">Who are we auditing?</h2>
                                </div>

                                <div className="grid gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Business Name</Label>
                                        <Input className="h-16 rounded-none border-2 border-slate-100 bg-slate-50/30 text-lg font-bold" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Contact</Label>
                                            <Input className="h-16 rounded-none border-2 border-slate-100 bg-slate-50/30 font-bold" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Email</Label>
                                            <Input className="h-16 rounded-none border-2 border-slate-100 bg-slate-50/30 font-bold" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key={currentPhase?.id} initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} className="space-y-10">
                                <div className="p-8 bg-[#0a1d37] text-white relative overflow-hidden group">
                                    <div className="relative z-10 space-y-2">
                                        <div className="flex items-center gap-2 text-[#ffcc00]">
                                            <Target size={16}/><span className="text-[10px] font-black uppercase tracking-widest">Phase Objective</span>
                                        </div>
                                        <h2 className="text-2xl font-black uppercase italic tracking-tight">{currentPhase?.title}</h2>
                                        <p className="text-slate-400 text-xs font-medium leading-relaxed">{currentPhase?.description}</p>
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    {currentPhase?.questions.map((q) => (
                                        <div key={q.id} className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="w-1 h-8 bg-[#5c21ff] shrink-0"/>
                                                <Label className="text-xl font-black italic text-[#0a1d37]">{q.question}</Label>
                                            </div>

                                            {q.type === "select" ? (
                                                <div className="grid gap-3 pl-5">
                                                    {q.options?.map((opt) => (
                                                        <button key={opt.value} onClick={() => setAnswer(q.id, opt.value)}
                                                            className={`p-5 text-left border-2 transition-all ${answers[q.id] === opt.value ? "border-[#ffcc00] bg-[#ffcc00]/5" : "border-slate-100 bg-white"}`}>
                                                            <div className="flex items-center justify-between">
                                                                <span className={`font-black uppercase italic text-xs ${answers[q.id] === opt.value ? "text-[#0a1d37]" : "text-slate-400"}`}>{opt.label}</span>
                                                                {answers[q.id] === opt.value && <ShieldCheck className="text-[#ffcc00]" size={20}/>}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="pl-5">
                                                    <Textarea value={answers[q.id] || ""} onChange={(e) => setAnswer(q.id, e.target.value)} className="min-h-[180px] rounded-none border-2 border-slate-100 p-6 text-lg font-medium" placeholder="Your response..." />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex justify-between items-center mt-20 pt-8 border-t border-slate-100">
                        <Button variant="ghost" className="font-black uppercase italic text-slate-400" onClick={() => (phaseIndex <= -1 ? navigate("/") : setPhaseIndex(phaseIndex - 1))}>
                            Previous
                        </Button>
                        <Button className="bg-[#0a1d37] text-white rounded-none px-12 h-16 font-black uppercase italic hover:bg-[#5c21ff]"
                            onClick={() => phaseIndex < totalPhases - 1 ? setPhaseIndex(phaseIndex + 1) : handleSubmit()} disabled={!canNext || loading}>
                            {loading ? <Loader2 className="animate-spin h-5 w-5"/> : (phaseIndex < totalPhases - 1 ? "Next Step" : "Finalize Audit")}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;