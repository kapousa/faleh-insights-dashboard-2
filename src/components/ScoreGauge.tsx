import { motion } from "framer-motion";
import type { ScoreCategory } from "@/lib/api";

interface ScoreGaugeProps {
  score: number;
  category: ScoreCategory;
}

const ScoreGauge = ({ score, category }: ScoreGaugeProps) => {
  // SVG semi-circle gauge
  const radius = 80;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-2xl gradient-card border border-border shadow-card p-6 flex flex-col items-center justify-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Score arc */}
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={category.color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        {/* Score text */}
        <text x="100" y="85" textAnchor="middle" className="fill-foreground text-3xl font-bold" fontSize="36" fontWeight="700">
          {score}
        </text>
        <text x="100" y="105" textAnchor="middle" className="fill-muted-foreground" fontSize="12">
          out of 100
        </text>
      </svg>
      <p className="text-sm font-medium mt-2" style={{ color: category.color }}>
        {category.label}
      </p>
    </div>
  );
};

export default ScoreGauge;
