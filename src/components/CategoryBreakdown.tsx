import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface PhaseScore {
  phaseId: string;
  title: string;
  score: number;
  maxScore: number;
  percentage: number;
}

interface CategoryBreakdownProps {
  phaseScores: PhaseScore[];
}

const CategoryBreakdown = ({ phaseScores }: CategoryBreakdownProps) => {
  const data = phaseScores.map((ps) => ({
    subject: ps.title,
    score: ps.percentage,
    fullMark: 100,
  }));

  return (
    <div className="rounded-2xl gradient-card border border-border shadow-card p-6">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="hsl(222, 30%, 18%)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 13, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }}
              tickCount={5}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="hsl(160, 84%, 39%)"
              fill="hsl(160, 84%, 39%)"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryBreakdown;
