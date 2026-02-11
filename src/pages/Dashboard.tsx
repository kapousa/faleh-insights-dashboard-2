import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, FileText, Search, Clock, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MOCK_MATCHES } from "@/lib/api";
import MatchCard from "@/components/MatchCard";
import ProfitChart from "@/components/ProfitChart";

const recentSearches = [
  { label: "Food Franchises — Riyadh", date: "Today" },
  { label: "Cloud Kitchen — Jeddah", date: "Yesterday" },
  { label: "Fitness Brands — Dammam", date: "3 days ago" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedMatch, setSelectedMatch] = useState(MOCK_MATCHES[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
            { icon: BarChart3, label: "Insights", active: true },
            { icon: FileText, label: "Saved Reports" },
            { icon: Search, label: "New Search", onClick: () => navigate("/onboarding") },
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
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="h-3 w-3" /> Recent
            </h4>
            <div className="space-y-2">
              {recentSearches.map((s) => (
                <div key={s.label} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  <div className="font-medium">{s.label}</div>
                  <div className="text-[10px] opacity-60">{s.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
          <h1 className="text-xl font-bold text-foreground">Faleh Insights</h1>
          <p className="text-sm text-muted-foreground">Your personalized franchise recommendations</p>
        </header>

        <div className="p-6 space-y-8 max-w-5xl">
          {/* Match Cards */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Top Matches</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {MOCK_MATCHES.map((match, i) => (
                <MatchCard key={match.id} match={match} index={i} onClick={() => setSelectedMatch(match)} />
              ))}
            </div>
          </section>

          {/* Chart */}
          {selectedMatch && (
            <section>
              <ProfitChart match={selectedMatch} />
            </section>
          )}

          {/* Summary stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Matches", value: MOCK_MATCHES.length.toString(), sub: "franchises" },
              { label: "Best ROI", value: `${Math.max(...MOCK_MATCHES.map(m => m.estimatedROI))}%`, sub: "estimated" },
              { label: "Fastest Break-even", value: `${Math.min(...MOCK_MATCHES.map(m => m.breakEvenMonths))} mo`, sub: "timeline" },
              { label: "Top Score", value: `${Math.max(...MOCK_MATCHES.map(m => m.matchScore))}%`, sub: "match" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl gradient-card border border-border p-4 shadow-card">
                <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.sub}</div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
