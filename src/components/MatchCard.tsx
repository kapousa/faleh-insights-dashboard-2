import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { FranchiseMatch } from "@/lib/api";

interface MatchCardProps {
  match: FranchiseMatch;
  index: number;
  onClick?: () => void;
}

const MatchCard = ({ match, index, onClick }: MatchCardProps) => {
  const scoreColor =
    match.matchScore >= 90
      ? "text-primary"
      : match.matchScore >= 80
      ? "text-yellow-400"
      : "text-muted-foreground";

  return (
    <motion.div
      className="rounded-2xl gradient-card border border-border shadow-card p-6 cursor-pointer hover:border-primary/30 transition-all group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
            {match.logo}
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {match.name}
            </h3>
            <span className="text-xs text-muted-foreground">{match.category}</span>
          </div>
        </div>
        <div className={`text-right`}>
          <div className={`text-2xl font-bold ${scoreColor}`}>{match.matchScore}%</div>
          <span className="text-xs text-muted-foreground">Match</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">{match.description}</p>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Investment</div>
          <div className="text-sm font-medium text-foreground">{match.investmentRange}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Est. ROI</div>
          <div className="text-sm font-medium text-primary flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {match.estimatedROI}%
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Break-even</div>
          <div className="text-sm font-medium text-foreground">{match.breakEvenMonths} mo</div>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCard;
