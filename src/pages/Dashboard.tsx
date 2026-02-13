// Dashboard.tsx - ملف محدث بالكامل
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Home, ChevronLeft, ChevronRight, BarChart3, MailCheck, Loader2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  calculateScore,
  getRecommendations,
  ASSESSMENT_PHASES,
  type ScoreResult,
} from "@/lib/api";
import ScoreGauge from "@/components/ScoreGauge";
import CategoryBreakdown from "@/components/CategoryBreakdown";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("faleh_score");
    if (stored) {
      setScoreResult(JSON.parse(stored));
    }
  }, []);

// Dashboard.tsx - Updated handleRequestFinalReport
const handleRequestFinalReport = async () => {
  setIsSubmitting(true);
  try {
    const storedAnswers = sessionStorage.getItem("faleh_answers");
    const userEmail = sessionStorage.getItem("faleh_user_email");
    const bizName = sessionStorage.getItem("faleh_business_name");

    // We initiate the fetch but don't need to wait for the whole AI process
    const response = await fetch('https://faleh.app.n8n.cloud/webhook/9546ae5f-93cc-49b3-8806-881f3627c808', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail,
        businessName: bizName,
        answers: storedAnswers ? JSON.parse(storedAnswers) : {},
        score: scoreResult?.totalScore,
      }),
    });

    if (response.ok) {
      setIsSent(true); // Switch to "Sent" state immediately
    }
  } catch (error) {
    console.error("Failed to initiate report request", error);
  } finally {
    setIsSubmitting(false);
  }
};

  if (!scoreResult) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - تم استعادة كافة العناصر */}
      <motion.aside className={`border-r border-border bg-card flex-shrink-0 flex flex-col transition-all overflow-hidden ${sidebarOpen ? "w-64" : "w-14"}`} layout>
        <div className="p-4 flex items-center justify-between border-b border-border">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-emerald flex items-center justify-center font-bold text-white text-xs">ف</div>
              <span className="font-bold">Faleh</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-secondary rounded">
            {sidebarOpen ? <ChevronLeft size={16}/> : <ChevronRight size={16}/>}
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/50 rounded-lg"><Home size={16}/> {sidebarOpen && "Home"}</button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm bg-primary/10 text-primary font-medium rounded-lg"><BarChart3 size={16}/> {sidebarOpen && "Results"}</button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/50 rounded-lg"><FileText size={16}/> {sidebarOpen && "Report"}</button>
          <button onClick={() => navigate("/onboarding")} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/50 rounded-lg"><RefreshCw size={16}/> {sidebarOpen && "New Assessment"}</button>
        </nav>
      </motion.aside>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Readiness Report</h1>
            <p className="text-xs text-muted-foreground">Ajman Chamber Franchise Standards</p>
          </div>
          {!isSent ? (
              <h3 className="text-emerald-500 font-medium text-sm">Detailed report sent to your email.</h3>
          ) : (
            <div className="flex items-center gap-2 text-emerald-500 font-medium text-sm">
              <MailCheck size={18} /> Sent to Email
            </div>
          )}
        </header>

        <div className="p-6 space-y-8 max-w-5xl">
         {isSent && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3 text-emerald-700 text-sm mb-6"
  >
    <MailCheck size={18} />
    <div>
      <p className="font-bold">Request Received!</p>
      <p>Our AI is generating your detailed report. Please check your inbox in 1-2 minutes.</p>
    </div>
  </motion.div>
)}

          <section className="grid md:grid-cols-2 gap-6">
            <ScoreGauge score={scoreResult.totalScore} category={scoreResult.category} />
            <div className="rounded-2xl bg-card border border-border p-6 flex flex-col justify-center shadow-sm">
              <div className="text-4xl mb-3">{scoreResult.category.emoji}</div>
              <h3 className="text-xl font-bold mb-2">{scoreResult.category.label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{scoreResult.category.description}</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
            <CategoryBreakdown phaseScores={scoreResult.phaseScores} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;