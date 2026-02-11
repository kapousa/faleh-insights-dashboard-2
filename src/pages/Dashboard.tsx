import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Home, ChevronLeft, ChevronRight, Download, RefreshCw, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  calculateScore,
  getRecommendations,
  ASSESSMENT_PHASES,
  type ScoreResult,
  type AssessmentAnswers,
  type ReportStatus,
} from "@/lib/api";
import ScoreGauge from "@/components/ScoreGauge";
import CategoryBreakdown from "@/components/CategoryBreakdown";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reportStatus, setReportStatus] = useState<ReportStatus>("ready");
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("faleh_score");
    if (stored) {
      const result: ScoreResult = JSON.parse(stored);
      setScoreResult(result);
      setRecommendations(getRecommendations(result));
    } else {
      // Demo/mock data
      const mockAnswers: AssessmentAnswers = {
        A1: "2to5", A2: "2to3", A3: "We offer a unique blend of traditional Emirati hospitality with modern café culture, featuring locally-sourced ingredients and signature beverages.",
        A4: "in_progress", A5: "moderate",
        B1: "partial", B2: "needs_refinement", B3: "developing", B4: "3to6m", B5: "minor", B6: "yes",
        C1: "10to19", C2: "500kto1m", C3: "6to12", C4: "partial", C5: "yes",
      };
      const result = calculateScore(mockAnswers);
      setScoreResult(result);
      setRecommendations(getRecommendations(result));
    }
  }, []);

  if (!scoreResult) return null;

  const statusLabel: Record<ReportStatus, { text: string; color: string }> = {
    draft: { text: "Draft", color: "bg-muted text-muted-foreground" },
    analyzing: { text: "Analyzing", color: "bg-yellow-500/20 text-yellow-400" },
    ready: { text: "Report Ready", color: "bg-primary/20 text-primary" },
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        className={`border-r border-border bg-card flex-shrink-0 flex flex-col transition-all overflow-hidden ${sidebarOpen ? "w-64" : "w-14"}`}
        layout
      >
        <div className="p-4 flex items-center justify-between border-b border-border">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-emerald flex items-center justify-center font-bold text-primary-foreground text-xs">ف</div>
              <span className="font-bold text-foreground">Faleh</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground p-1">
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {[
            { icon: Home, label: "Home", onClick: () => navigate("/") },
            { icon: BarChart3, label: "Results", active: true },
            { icon: FileText, label: "Faleh Report" },
            { icon: RefreshCw, label: "New Assessment", onClick: () => navigate("/onboarding") },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                item.active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="p-4 border-t border-border">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Status</div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusLabel[reportStatus].color}`}>
              {statusLabel[reportStatus].text}
            </span>
          </div>
        )}
      </motion.aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Business Readiness Report</h1>
            <p className="text-sm text-muted-foreground">Ajman Chamber Franchise Evaluation</p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </header>

        <div className="p-6 space-y-8 max-w-5xl">
          {/* Score Gauge + Category */}
          <section className="grid md:grid-cols-2 gap-6">
            <ScoreGauge score={scoreResult.totalScore} category={scoreResult.category} />

            <div className="rounded-2xl gradient-card border border-border shadow-card p-6 flex flex-col justify-center">
              <div className="text-4xl mb-3">{scoreResult.category.emoji}</div>
              <h3 className="text-xl font-bold text-foreground mb-2">{scoreResult.category.label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{scoreResult.category.description}</p>
              <div className="mt-4 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground w-fit">
                Score Range: {scoreResult.category.range}
              </div>
            </div>
          </section>

          {/* Category Breakdown */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Category Breakdown</h2>
            <CategoryBreakdown phaseScores={scoreResult.phaseScores} />
          </section>

          {/* AI Recommendations */}
          <section className="rounded-2xl gradient-card border border-border shadow-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="text-xl">🤖</span> AI Recommendations
            </h2>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  className="flex gap-3 p-4 rounded-xl bg-secondary/50 border border-border"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="text-primary font-bold text-sm mt-0.5">{i + 1}.</span>
                  <p className="text-sm text-foreground leading-relaxed">{rec}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Faleh Report Hub */}
          <section className="rounded-2xl gradient-card border border-border shadow-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Faleh Report Hub
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-secondary/30">
                <h4 className="font-medium text-foreground text-sm mb-1">Business Plan (PDF)</h4>
                <p className="text-xs text-muted-foreground mb-3">Full franchise-ready business plan generated from your assessment.</p>
                <Button size="sm" variant="outline" disabled={reportStatus !== "ready"}>
                  <Download className="mr-2 h-3 w-3" /> Download
                </Button>
              </div>
              <div className="p-4 rounded-xl border border-border bg-secondary/30">
                <h4 className="font-medium text-foreground text-sm mb-1">Improvement Roadmap</h4>
                <p className="text-xs text-muted-foreground mb-3">Step-by-step action plan to improve your franchise readiness score.</p>
                <Button size="sm" variant="outline" disabled={reportStatus !== "ready"}>
                  <Download className="mr-2 h-3 w-3" /> Download
                </Button>
              </div>
            </div>
          </section>

          {/* Phase detail stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scoreResult.phaseScores.map((ps) => {
              const phase = ASSESSMENT_PHASES.find((p) => p.id === ps.phaseId)!;
              return (
                <div key={ps.phaseId} className="rounded-xl gradient-card border border-border p-5 shadow-card">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{phase.icon}</span>
                    <span className="text-sm font-semibold text-foreground">{ps.title}</span>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-1">{ps.percentage}%</div>
                  <div className="text-xs text-muted-foreground">
                    {ps.score} / {ps.maxScore} points (Weight: {phase.weight}%)
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${ps.percentage}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
