import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    ChevronLeft,
    Download,
    TrendingUp,
    Sparkles,
    ShieldCheck,
    FileText,
    Loader2,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type ScoreResult } from "@/lib/api";
import CategoryBreakdown from "@/components/CategoryBreakdown";

const ReadinessGauge = ({ score }: { score: number }) => {
    const radius = 80;
    const circumference = Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const getColor = (s: number) => {
        if (s < 40) return "#ef4444";
        if (s < 70) return "#ffcc00";
        return "#5c21ff";
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 shadow-sm w-full">
            <div className="relative w-64 h-32 overflow-hidden">
                <svg className="w-64 h-64 -rotate-180 transform" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r={radius} stroke="#f1f5f9" strokeWidth="20" fill="transparent" />
                    <circle
                        cx="100" cy="100" r={radius} stroke={getColor(score)} strokeWidth="20" fill="transparent"
                        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-2 text-center">
                    <span className="text-4xl font-black italic text-[#0a1d37]">{score}%</span>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-none">Readiness</p>
                </div>
            </div>
            <p className="text-[10px] font-black uppercase italic text-[#0a1d37] mt-2 tracking-widest">Growth Potential</p>
        </div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
    const [businessName, setBusinessName] = useState("");
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("assessment_results");
        const name = localStorage.getItem("business_name");

        if (!data) {
            navigate("/onboarding");
            return;
        }
        setScoreResult(JSON.parse(data));
        setBusinessName(name || "Your Business");

        // Check for PDF URL immediately and then every 2 seconds
        const checkPdf = () => {
            const url = localStorage.getItem("pdf_download_url");
            if (url && url !== "undefined") {
                setPdfUrl(url);
            }
        };

        checkPdf();
        const interval = setInterval(checkPdf, 2000);
        return () => clearInterval(interval);
    }, [navigate]);

    if (!scoreResult) return null;

    const categoryLabel = typeof scoreResult.category === 'object' ? scoreResult.category.label : scoreResult.category;

    const handleDownload = () => {
        if (pdfUrl) {
            window.open(pdfUrl, "_blank");
        } else {
            // Fallback: check storage one last time manually
            const manualCheck = localStorage.getItem("pdf_download_url");
            if (manualCheck) {
                window.open(manualCheck, "_blank");
            } else {
                alert("Your deep-dive report is being finalized by the AI. Since you received the email, it's ready! Please refresh the page to see the download link.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-[#0a1d37]">
            <nav className="bg-white border-b border-slate-100 h-20 flex items-center justify-between px-8 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                    <div>
                        <h1 className="text-sm font-black uppercase italic tracking-tighter leading-none">Faleh Audit Engine</h1>
                        <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">{businessName}</p>
                    </div>
                </div>
                <Button variant="ghost" onClick={() => navigate("/")} className="font-black uppercase italic text-xs gap-2">
                    <ChevronLeft size={16} /> Exit
                </Button>
            </nav>

            <main className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-1 space-y-4">
                        <ReadinessGauge score={scoreResult.totalScore} />

                        <div className="bg-[#5c21ff] p-6 text-white shadow-lg relative overflow-hidden group">
                            <ShieldCheck className="mb-3 text-[#ffcc00]" size={28} />
                            <h3 className="text-sm font-black uppercase italic mb-1 tracking-wider">Audit Status</h3>
                            <p className="text-lg font-black leading-tight uppercase italic">{categoryLabel}</p>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white border border-slate-100 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black uppercase italic border-l-6 border-[#5c21ff] pl-4">Strategic Summary</h2>
                                <Sparkles size={18} className="text-[#5c21ff]" />
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 bg-slate-50 p-5 border-r-4 border-[#ffcc00]">
                                    <p className="text-slate-600 leading-relaxed italic text-xs md:text-sm">
                                        The audit for <b>{businessName}</b> is complete.
                                        Your score of <b>{scoreResult.totalScore}%</b> indicates specific operational gaps.
                                        Download your full roadmap below to view the 90-day expansion strategy.
                                    </p>
                                </div>
                                <div className="md:col-span-1 bg-[#0a1d37] p-5 text-white flex flex-col items-center justify-center text-center">
                                    <FileText className="text-[#ffcc00] mb-2" size={20} />
                                    <h4 className="text-[9px] font-black uppercase mb-3 tracking-widest">Detailed Report</h4>

                                    <Button
                                        onClick={handleDownload}
                                        className={`w-full rounded-none font-black italic uppercase text-[10px] h-10 transition-all ${
                                            pdfUrl 
                                            ? "bg-[#5c21ff] hover:bg-white hover:text-[#0a1d37] shadow-lg" 
                                            : "bg-slate-700 opacity-80 cursor-wait"
                                        }`}
                                    >
                                        {pdfUrl ? (
                                            <span className="flex items-center gap-2"><Download size={14}/> Download</span>
                                        ) : (
                                            <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin"/> Generating...</span>
                                        )}
                                    </Button>

                                    {!pdfUrl && (
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="mt-3 text-[8px] uppercase font-bold text-slate-400 hover:text-white flex items-center gap-1 mx-auto"
                                        >
                                            <RefreshCw size={8}/> Click to Refresh
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="bg-white border border-slate-100 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black uppercase italic border-l-6 border-[#ffcc00] pl-4">Pillar Breakdown</h2>
                                <TrendingUp className="text-[#5c21ff]" size={18} />
                            </div>
                            <CategoryBreakdown
                                score={scoreResult.totalScore}
                                category={categoryLabel}
                            />
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;