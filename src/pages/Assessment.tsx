import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";
import {Loader2, Lock, CheckCircle2, ShieldCheck} from "lucide-react";
import {PieChart, Pie, Cell} from "recharts"; // Added Recharts for visual graphs
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    WIZARD_PHASES,
    TOTAL_QUESTIONS,
    calculateWizardScore,
    type WizardAnswers,
} from "@/lib/assessmentData";
import {submitAssessment} from "@/lib/api";


type Screen =
    | "welcome" | "verify" | "contact" | "wizard"
    | "processing" | "gate" | "payment" | "confirm";

const PROCESSING_LABELS = [
    "Evaluating brand viability...",
    "Auditing operational readiness...",
    "Analysing financial performance...",
    "Checking regulatory compliance...",
    "Generating your readiness report...",
];

// --- New Metric Card Component for the Gate Screen ---
const MetricCard = ({label, score}: { label: string; score: number }) => {
    const data = [{value: score}, {value: 100 - score}];
    // Scaled dimensions to 75% (96px instead of 128px)
    return (
        <div
            className="bg-white/5 p-4 rounded-xl flex flex-col items-center border border-white/10 shadow-lg relative overflow-hidden">
            <h4 className="text-white/60 text-[10px] font-bold mb-2 uppercase tracking-[2px] text-center h-6 flex items-center justify-center">
                {label}
            </h4>
            <div className="relative w-24 h-24 flex items-center justify-center">
                <PieChart width={96} height={96}>
                    <Pie
                        data={data}
                        innerRadius={36} // Scaled
                        outerRadius={45} // Scaled
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                    >
                        <Cell fill="#FFD700"/>
                        <Cell fill="rgba(255,255,255,0.05)"/>
                    </Pie>
                </PieChart>
                <div
                    className="absolute inset-0 flex items-center justify-center text-xl font-display font-bold text-white">
                    {score}%
                </div>
            </div>
        </div>
    );
};
const Assessment = () => {
    const navigate = useNavigate();
    const [screen, setScreen] = useState<Screen>("welcome");

    // Business verification
    const [bizName, setBizName] = useState("");
    const [sector, setSector] = useState("");
    const [locations, setLocations] = useState("");
    const [years, setYears] = useState("");

    // Contact
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");

    // Wizard
    const [phaseIdx, setPhaseIdx] = useState(0);
    const [answers, setAnswers] = useState<WizardAnswers>({0: {}, 1: {}, 2: {}});

    // Processing
    const [procStep, setProcStep] = useState(0);

    // Payment
    const [paying, setPaying] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const answeredCount = Object.values(answers).reduce(
        (s, m) => s + Object.keys(m).length, 0
    );
    const score = calculateWizardScore(answers);
    const phase = WIZARD_PHASES[phaseIdx];

    // Drive processing animation
    useEffect(() => {
        if (screen !== "processing") return;
        if (procStep >= PROCESSING_LABELS.length) {
            const t = setTimeout(() => setScreen("gate"), 700);
            return () => clearTimeout(t);
        }
        const t = setTimeout(() => setProcStep((s) => s + 1), procStep === PROCESSING_LABELS.length - 1 ? 1400 : 1000);
        return () => clearTimeout(t);
    }, [screen, procStep]);

    const selectAnswer = (qIdx: number, optIdx: number) => {
        setAnswers((prev) => ({
            ...prev,
            [phase.id]: {...prev[phase.id], [qIdx]: optIdx},
        }));
    };

    const goNextPhase = () => {
        const answeredInPhase = Object.keys(answers[phase.id] || {}).length;
        if (answeredInPhase < phase.questions.length) {
            alert(`Please answer all ${phase.questions.length - answeredInPhase} remaining question(s) in this section before continuing.`);
            return;
        }
        if (phaseIdx < WIZARD_PHASES.length - 1) {
            setPhaseIdx((p) => p + 1);
            window.scrollTo(0, 0);
        } else {
            setScreen("processing");
            setProcStep(0);
        }
    };

const handlePay = async () => {
  setPaying(true);

  // Map the indexes to the actual question and answer text
  const detailedAnswers = WIZARD_PHASES.flatMap((phase) =>
    phase.questions.map((q, qIdx) => ({
      question: q.text,
      selectedAnswer: q.options[answers[phase.id]?.[qIdx]] || "Not answered"
    }))
  );

  const fullPayload = {
    businessDetails: { bizName, sector, locations, years },
    contactInfo: { fullName, email, phone, role },
    wizardAnswers: detailedAnswers, // Now contains text instead of indexes
    assessmentResults: {
      totalScore: score.totalScore,
      brandScore: score.pillarScores[0]?.percentage ?? 0,
      opsScore: score.pillarScores[1]?.percentage ?? 0,
      finScore: score.pillarScores[2]?.percentage ?? 0,
      category: score.category,
      criticalGaps: score.criticalGaps
    },
    timestamp: new Date().toISOString()
  };

  try {
    await submitAssessment(fullPayload);
    setScreen("confirm");
  } catch (e) {
    console.error("Submission failed:", e);
    alert("There was an issue processing your request.");
  } finally {
    setPaying(false);
  }
};

    const handlePay1 = async () => {
        setPaying(true);

        // TEMPORARY BYPASS FOR TESTING
        console.log("Skipping payment API call for testing.");
        setDownloadUrl("https://example.com/test-report.pdf");
        setScreen("confirm");
        setPaying(false);

        /*
        // RESTORE THIS LATER
        try {
          const res = await submitAssessment({ ... });
          // ... logic
        } catch (e) { ... }
        */
    };

    return (
        <div className="min-h-screen font-sans">
            <AnimatePresence mode="wait">

                {screen === "welcome" && (
                    <motion.div key="welcome" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                className="min-h-screen bg-brand-navy flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
                        <div
                            className="absolute w-[500px] h-[500px] rounded-full bg-brand-gold/10 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"/>
                        <div className="flex items-center gap-3 mb-14 relative z-10">
                            <div
                                className="w-11 h-11 bg-brand-purple flex items-center justify-center font-display font-extrabold text-brand-gold"
                                style={{clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"}}>F
                            </div>
                            <span className="font-display text-2xl font-extrabold text-white">FALEH</span>
                        </div>
                        <p className="text-brand-gold text-xs font-bold uppercase tracking-[3px] mb-5 relative z-10">Franchise
                            Readiness Assessment · UAE</p>
                        <h1 className="font-display text-white font-extrabold text-4xl md:text-6xl max-w-3xl leading-tight mb-5 relative z-10">
                            Is your business <span className="text-brand-gold">really</span> ready to franchise?
                        </h1>
                        <p className="text-white/50 max-w-xl mb-12 relative z-10">
                            Answer 30 questions about your brand, operations, and financials. Get an AI-powered report
                            built on UAE franchise expertise.
                        </p>
                        <div className="flex gap-10 mb-12 relative z-10 flex-wrap justify-center">
                            {[["30", "Questions"], ["12", "Minutes"], ["3", "Pillars"], ["Free", "To start"]].map(([n, l]) => (
                                <div key={l} className="text-center">
                                    <div className="font-display text-2xl font-extrabold text-white">{n}</div>
                                    <div className="text-xs text-white/35 mt-0.5">{l}</div>
                                </div>
                            ))}
                        </div>
                        <Button onClick={() => setScreen("verify")}
                                className="relative z-10 bg-brand-gold hover:bg-brand-goldDim text-brand-navy font-display font-extrabold px-12 h-16 rounded-lg text-lg">
                            Begin Your Assessment →
                        </Button>
                        <p className="text-white/25 text-xs mt-4 relative z-10">Free to complete · Full report AED 3,500
                            · Instant PDF delivery</p>
                    </motion.div>
                )}

                {screen === "verify" && (
                    <motion.div key="verify" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0}}
                                className="min-h-screen bg-brand-slate flex items-center justify-center px-6 py-12">
                        <div className="bg-white rounded-2xl p-10 max-w-lg w-full border border-brand-border">
                            <p className="text-xs font-bold uppercase tracking-[3px] text-[#5c21ff] mb-2">Step 1 of 4 —
                                Business Verification</p>
                            <h2 className="font-display text-2xl font-extrabold text-brand-navy mb-2">Tell us about your
                                business</h2>
                            <p className="text-sm text-brand-muted mb-8">We tailor your assessment to your industry and
                                business stage. This takes 60 seconds.</p>

                            <div className="space-y-5">
                                <div>
                                    <Label
                                        className="text-xs font-bold uppercase tracking-wide text-brand-navy mb-2 block">Business
                                        Name</Label>
                                    <Input value={bizName} onChange={(e) => setBizName(e.target.value)}
                                           placeholder="e.g. Al Nakheel Café"/>
                                </div>
                                <div>
                                    <Label
                                        className="text-xs font-bold uppercase tracking-wide text-brand-navy mb-2 block">Industry
                                        Sector</Label>
                                    <select
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={sector} onChange={(e) => setSector(e.target.value)}>
                                        <option value="">Select your sector</option>
                                        {["Food & Beverage", "Retail", "Healthcare & Wellness", "Education & Training", "Beauty & Personal Care", "Services & Professional", "Fitness & Sports", "Other"].map(o =>
                                            <option key={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <Label
                                        className="text-xs font-bold uppercase tracking-wide text-brand-navy mb-2 block">Number
                                        of Operating Locations</Label>
                                    <select
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={locations} onChange={(e) => setLocations(e.target.value)}>
                                        <option value="">Select</option>
                                        {["1 location", "2–3 locations", "4–9 locations", "10+ locations"].map(o =>
                                            <option key={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <Label
                                        className="text-xs font-bold uppercase tracking-wide text-brand-navy mb-2 block">Years
                                        in Operation</Label>
                                    <select
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={years} onChange={(e) => setYears(e.target.value)}>
                                        <option value="">Select</option>
                                        {["Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "10+ years"].map(o =>
                                            <option key={o}>{o}</option>)}
                                    </select>
                                </div>
                            </div>

                            <Button
                                className="w-full mt-8 h-12 bg-brand-navy hover:bg-brand-navyDim text-white font-display font-extrabold"
                                onClick={() => {
                                    if (!bizName.trim() || !sector || !locations || !years) {
                                        alert("Please complete all fields to continue.");
                                        return;
                                    }
                                    setScreen("contact");
                                }}
                            >
                                Continue →
                            </Button>
                        </div>
                    </motion.div>
                )}

                {screen === "contact" && (
                    <motion.div key="contact" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0}}
                                className="min-h-screen bg-brand-slate flex items-center justify-center px-6 py-12">
                        <div className="bg-white rounded-2xl p-10 max-w-lg w-full border border-brand-border">
                            <p className="text-xs font-bold uppercase tracking-[3px] text-[#5c21ff] mb-2">Step 2 of 4 —
                                Contact Details</p>
                            <h2 className="font-display text-2xl font-extrabold text-brand-navy mb-2">Where should we
                                send your report?</h2>
                            <p className="text-sm text-brand-muted mb-8">Your report is delivered instantly to your
                                inbox. We'll also use this to book your expert debrief call.</p>

                            <div className="space-y-5">
                                <div>
                                    <Label
                                        className="text-xs font-bold uppercase tracking-wide text-brand-navy mb-2 block">Full
                                        Name</Label>
                                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)}
                                           placeholder="Your full name"/>
                                </div>
                                <div>
                                    <Label
                                        className="text-xs font-bold uppercase tracking-wide text-brand-navy mb-2 block">Email
                                        Address</Label>
                                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                           placeholder="you@yourbusiness.com"/>
                                </div>
                                <div>
                                    <Label
                                        className="text-xs font-bold uppercase tracking-wide text-brand-navy mb-2 block">WhatsApp
                                        Number</Label>
                                    <Input value={phone} onChange={(e) => setPhone(e.target.value)}
                                           placeholder="+971 50 000 0000"/>
                                </div>
                                <div>
                                    <Label
                                        className="text-xs font-bold uppercase tracking-wide text-brand-navy mb-2 block">Your
                                        Role</Label>
                                    <select
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        value={role} onChange={(e) => setRole(e.target.value)}>
                                        <option value="">Select your role</option>
                                        {["Founder / Owner", "CEO / Managing Director", "Operations Director", "Business Development", "Other"].map(o =>
                                            <option key={o}>{o}</option>)}
                                    </select>
                                </div>
                            </div>

                            <Button
                                className="w-full mt-8 h-12 bg-brand-navy hover:bg-brand-navyDim text-white font-display font-extrabold"
                                onClick={() => {
                                    if (!fullName.trim() || !email.includes("@") || !phone.trim() || !role) {
                                        alert("Please complete all fields to continue.");
                                        return;
                                    }
                                    // Changed from setScreen("wizard") to ensure clean flow
                                    setScreen("wizard");
                                }}
                            >
                                Start Free Assessment →
                            </Button>
                        </div>
                    </motion.div>
                )}

                {screen === "wizard" && (
                    <motion.div key="wizard" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                className="min-h-screen bg-brand-slate flex flex-col md:flex-row">
                        <div
                            className="w-full md:w-[280px] bg-brand-navy p-10 flex flex-col shrink-0 md:sticky md:top-0 md:h-screen">
                            <div className="flex items-center gap-2 mb-10">
                                <div
                                    className="w-7 h-7 bg-brand-gold flex items-center justify-center font-display font-extrabold text-xs text-brand-navy"
                                    style={{clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"}}>F
                                </div>
                                <span className="font-display text-lg font-extrabold text-white">FALEH</span>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-[3px] text-brand-gold mb-1">{phase.phaseLabel}</p>
                            <p className="font-display text-base font-extrabold text-white mb-8">{phase.name}</p>
                            <div className="space-y-0">
                                {WIZARD_PHASES.map((p, i) => (
                                    <div key={p.id} className="flex items-center gap-3 py-3 border-b border-white/5">
                                        <div
                                            className={`w-2 h-2 rounded-full shrink-0 ${i < phaseIdx ? "bg-green-500" : i === phaseIdx ? "bg-brand-gold" : "bg-white/10"}`}/>
                                        <span
                                            className={`text-sm ${i === phaseIdx ? "text-white font-semibold" : i < phaseIdx ? "text-white/50" : "text-white/30"}`}>{p.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-auto pt-8">
                                <p className="text-[11px] font-bold uppercase tracking-wide text-white/30 mb-2">Overall
                                    Progress</p>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div className="h-full bg-brand-gold rounded-full"
                                                animate={{width: `${(answeredCount / TOTAL_QUESTIONS) * 100}%`}}/>
                                </div>
                                <p className="text-xs text-white/25 mt-2">{answeredCount} of {TOTAL_QUESTIONS} questions</p>
                            </div>
                        </div>

                        <div className="flex-1 p-6 md:p-12 overflow-y-auto">
                            <div className="max-w-2xl mx-auto">
                                <p className="text-[10px] font-bold uppercase tracking-[3px] text-[#5c21ff] mb-1">Phase
                                    Objective</p>
                                <h2 className="font-display text-2xl font-extrabold text-brand-navy mb-2">{phase.objective}</h2>
                                <p className="text-sm text-brand-muted leading-relaxed mb-10">{phase.desc}</p>

                                <div className="space-y-4">
                                    {phase.questions.map((q, qi) => {
                                        const qNum = phaseIdx * 10 + qi + 1;
                                        const saved = answers[phase.id]?.[qi];
                                        return (
                                            <div key={qi}
                                                 className="bg-white border border-brand-border rounded-xl p-7">
                                                <p className="text-[10px] font-bold uppercase tracking-wide text-brand-muted mb-2">Question {qNum} of {TOTAL_QUESTIONS}</p>
                                                <p className="text-base font-semibold text-brand-navy border-l-4 border-brand-gold pl-4 mb-5 leading-relaxed">{q.text}</p>
                                                <div className="flex flex-col gap-2.5">
                                                    {q.options.map((opt, oi) => (
                                                        <button
                                                            key={oi}
                                                            onClick={() => selectAnswer(qi, oi)}
                                                            className={`text-left px-4.5 py-3.5 rounded-lg border text-sm transition-all ${
                                                                saved === oi
                                                                    ? "border-[#5c21ff] bg-[#5c21ff]/5 text-[#5c21ff] font-semibold"
                                                                    : "border-brand-border hover:border-[#5c21ff]/50"
                                                            }`}
                                                        >
                                                            {saved === oi ? "✓ " : ""}{opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex justify-between items-center mt-10 pt-8">
                                    <Button variant="outline" disabled={phaseIdx === 0}
                                            onClick={() => setPhaseIdx((p) => p - 1)}>
                                        ← Back
                                    </Button>
                                    <Button
                                        className="bg-brand-navy hover:bg-brand-navyDim text-white font-display font-extrabold px-9 h-12"
                                        onClick={goNextPhase}>
                                        {phaseIdx < WIZARD_PHASES.length - 1 ? "Continue →" : "Finish & Analyze →"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {screen === "processing" && (
                    <motion.div key="processing" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                className="min-h-screen bg-brand-navy flex flex-col items-center justify-center px-6 text-center">
                        <div className="flex items-center gap-3 mb-16">
                            <div
                                className="w-9 h-9 bg-brand-gold flex items-center justify-center font-display font-extrabold text-brand-navy"
                                style={{clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"}}>F
                            </div>
                            <span className="font-display text-xl font-extrabold text-white">FALEH AUDIT ENGINE</span>
                        </div>
                        <Loader2 className="w-16 h-16 text-brand-gold animate-spin mb-10"/>
                        <h2 className="font-display text-2xl font-extrabold text-white mb-2">Analysing Your
                            Strategy</h2>
                        <p className="text-white/40 mb-12">Faleh AI is evaluating your franchise readiness...</p>
                        <div className="flex flex-col gap-3.5 w-full max-w-md">
                            {PROCESSING_LABELS.map((label, i) => {
                                const done = i < procStep;
                                const active = i === procStep;
                                return (
                                    <div key={label}
                                         className={`flex items-center gap-3.5 px-5 py-3.5 rounded-lg border ${active ? "border-white/15 bg-white/5" : "border-white/5 bg-white/[0.02]"}`}>
                                        {done ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0"/> :
                                            active ?
                                                <Loader2 className="w-4 h-4 text-brand-gold animate-spin shrink-0"/> :
                                                <div className="w-4 h-4 rounded-full border border-white/15 shrink-0"/>}
                                        <span
                                            className={`text-sm ${done ? "text-white/35" : active ? "text-white font-semibold" : "text-white/50"}`}>{label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {screen === "gate" && (
                    <motion.div
                        key="gate"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        className="min-h-screen bg-brand-navy flex flex-col items-center justify-center px-6 py-12 text-center"
                    >
                        <div className="max-w-4xl w-full">
                            <h3 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-2">Your
                                Readiness Score</h3>
                            <p className="text-white/50 mb-8">Based on the Faleh 3-pillar evaluation framework</p>

                            {/* Display Total Score */}
                            <div className="text-6xl md:text-5xl font-extrabold text-brand-gold mb-8 drop-shadow-xl">
                                {score.totalScore}%
                            </div>

                            {/* Display Charts/Graphs Using Recharts */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <MetricCard label={score.pillarScores[0]?.name || "Brand & Market"}
                                            score={score.pillarScores[0]?.percentage ?? 0}/>
                                <MetricCard label={score.pillarScores[1]?.name || "Operations"}
                                            score={score.pillarScores[1]?.percentage ?? 0}/>
                                <MetricCard label={score.pillarScores[2]?.name || "Financials"}
                                            score={score.pillarScores[2]?.percentage ?? 0}/>
                            </div>

                            {/* Display Solution/Theme */}
                            <div
                                className="bg-gradient-to-br from-white/10 to-transparent p-8 rounded-3xl border border-brand-gold/30 text-left mb-10 relative overflow-hidden shadow-2xl">
                                <div
                                    className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl rounded-full pointer-events-none"></div>
                                <h3 className="text-sm font-bold uppercase tracking-[3px] text-brand-gold mb-3">Strategic
                                    Insight</h3>
                                <h4 className="text-2xl font-display font-bold text-white mb-3">{score.category.label}</h4>
                                <p className="text-white/80 leading-relaxed text-lg">
                                    {score.category.description}
                                </p>
                                {/* Fallback check in case 'recommendation' isn't explicitly defined in your current assessmentData */}
                                {score.category.recommendation && (
                                    <div
                                        className="mt-6 inline-block bg-brand-gold/10 px-5 py-3 rounded-lg border border-brand-gold/20">
                                        <span
                                            className="text-brand-gold font-semibold text-sm">Focus Area: {score.category.recommendation}</span>
                                    </div>
                                )}
                            </div>

                            <Button
  onClick={() => setScreen("payment")} // Navigate to the fake payment screen
  className="bg-brand-gold hover:bg-brand-goldDim text-brand-navy font-display font-extrabold px-12 h-16 text-lg w-full md:w-auto"
>
  Pay AED 3,500 to Unlock Full Report
</Button>
                        </div>
                    </motion.div>
                )}

                // Inside your Payment screen (screen === "payment")
                {screen === "payment" && (
          <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="min-h-screen bg-brand-slate flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full">
              <button onClick={() => setScreen("gate")} className="text-sm text-brand-muted hover:text-brand-navy mb-8">← Back</button>
              <h2 className="font-display text-2xl font-extrabold text-brand-navy mb-1">Complete your payment</h2>
              <p className="text-sm text-brand-muted mb-7">Your report will be delivered instantly after payment.</p>

              <div className="bg-white border border-brand-border rounded-xl p-5 flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm font-semibold text-brand-navy">Franchise Readiness Report</p>
                  <p className="text-xs text-brand-muted">Full report + Expert Debrief Call</p>
                </div>
                <p className="font-display text-xl font-extrabold text-brand-navy">AED 3,500</p>
              </div>

              <div className="bg-white border border-brand-border rounded-xl p-7 space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand-muted">Card Details</p>
                <Input placeholder="Name on Card" />
                <Input placeholder="0000 0000 0000 0000" />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="MM / YY" />
                  <Input placeholder="CVV" />
                </div>
                <div className="h-px bg-brand-border my-4" />
                <p className="text-[11px] font-bold uppercase tracking-wide text-brand-muted">Billing Details</p>
                <Input placeholder="Company name (for receipt)" />
                <Input placeholder="VAT number (optional)" />

                <Button disabled={paying} onClick={handlePay} className="w-full h-14 bg-brand-gold hover:bg-brand-goldDim text-brand-navy font-display font-extrabold mt-2">
                  {paying ? <Loader2 className="animate-spin" /> : "🔒 Pay AED 3,500 Securely"}
                </Button>
                <p className="text-center text-xs text-brand-muted">🔐 256-bit SSL encryption</p>
              </div>
            </div>
          </motion.div>
        )}

                {screen === "confirm" && (
                    <motion.div key="confirm" initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}}
                                exit={{opacity: 0}}
                                className="min-h-screen bg-brand-navy flex flex-col items-center justify-center px-6 text-center py-16">
                        <div
                            className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-400/40 flex items-center justify-center text-4xl mb-8">✓
                        </div>
                        <p className="text-xs font-bold uppercase tracking-[3px] text-green-400 mb-4">Payment
                            Confirmed</p>
                        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white max-w-md mb-4">Your
                            report is on its way</h2>
                        <p className="text-white/45 max-w-sm mb-12">We've sent your Franchise Readiness Report to your
                            inbox. Check your email — it should arrive within the next 2 minutes.</p>

                        <div className="flex flex-col gap-4 max-w-md w-full mb-12">
                            {[
                                ["1", "Download your PDF report", "Your full assessment is in your inbox now. Review it before your debrief call."],
                                ["2", "Book your 15-minute debrief", "A calendar link is included in your email. Book a slot with an FME consultant within 7 days."],
                                ["3", "Start your 90-day roadmap", "Your report includes a prioritised action plan. Begin with the highest-impact items first."],
                            ].map(([n, t, d]) => (
                                <div key={n}
                                     className="bg-white/[0.04] border border-white/10 rounded-xl p-5 flex items-center gap-4 text-left">
                                    <div
                                        className="w-8 h-8 rounded-full bg-brand-gold text-brand-navy font-display font-extrabold flex items-center justify-center shrink-0">{n}</div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{t}</p>
                                        <p className="text-xs text-white/40">{d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            className="bg-brand-gold hover:bg-brand-goldDim text-brand-navy font-display font-extrabold px-12 h-14"
                            onClick={() => {
                                if (downloadUrl) window.open(downloadUrl, "_blank");
                                else alert("Your report is being finalized — check your inbox shortly.");
                            }}
                        >
                            ↓ Download Your Report
                        </Button>
                        <button className="text-white/30 text-xs mt-8 hover:text-white"
                                onClick={() => navigate("/")}>Return home
                        </button>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};

export default Assessment;