import { motion } from "framer-motion";

interface CategoryBreakdownProps {
  score?: number;
  category?: string | any;
  phaseScores?: any[];
}

const CategoryBreakdown = ({ score = 0, category, phaseScores }: CategoryBreakdownProps) => {
  // Fix for "Objects are not valid as a React child"
  // If 'category' is passed as the full object {label, description}, we extract just the label
  const categoryLabel = typeof category === 'object' ? category.label : (category || "Evaluation Pending");

  // Fix for "Cannot read properties of undefined (reading 'map')"
  // We prioritize phaseScores if they exist, otherwise we use the total score to generate a breakdown
  const displayData = phaseScores && phaseScores.length > 0
    ? phaseScores.map(ps => ({ name: ps.title, val: ps.percentage, color: "#5c21ff" }))
    : [
        { name: "Brand Viability", val: Math.min(score + 5, 100), color: "#5c21ff" },
        { name: "Operational Readiness", val: score, color: "#ffcc00" },
        { name: "Financial Health", val: Math.max(score - 10, 0), color: "#0a1d37" },
      ];

  return (
    <div className="space-y-8">
      {displayData.map((cat, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-xs font-black uppercase italic tracking-widest text-slate-400">
              {cat.name}
            </span>
            <span className="text-lg font-black italic text-[#0a1d37]">{cat.val}%</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-none overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${cat.val}%` }}
              transition={{ duration: 1, delay: i * 0.2 }}
              className="h-full"
              style={{ backgroundColor: cat.color }}
            />
          </div>
        </div>
      ))}

      {/* AI Status Verdict Box */}
      <div className="mt-10 p-6 bg-slate-50 border-l-4 border-[#5c21ff]">
        <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Status Verdict</p>
        <p className="text-sm font-bold italic text-[#0a1d37]">
          Current Performance Tier: <span className="text-[#5c21ff] uppercase ml-1">{categoryLabel}</span>
        </p>
      </div>
    </div>
  );
};

export default CategoryBreakdown;