import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { FranchiseMatch } from "@/lib/api";

interface ProfitChartProps {
  match: FranchiseMatch;
}

const ProfitChart = ({ match }: ProfitChartProps) => {
  const data = match.yearlyProfit.map((profit, i) => ({
    year: `Year ${i + 1}`,
    profit,
  }));

  return (
    <div className="rounded-2xl gradient-card border border-border shadow-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-1">{match.name} — Profit Projection</h3>
      <p className="text-sm text-muted-foreground mb-6">Estimated yearly net profit (SAR)</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
            <XAxis dataKey="year" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 9%)",
                border: "1px solid hsl(222, 30%, 18%)",
                borderRadius: "12px",
                color: "hsl(210, 40%, 98%)",
                fontSize: "13px",
              }}
              formatter={(value: number) => [`SAR ${value.toLocaleString()}`, "Net Profit"]}
            />
            <Area type="monotone" dataKey="profit" stroke="hsl(160, 84%, 39%)" fill="url(#profitGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfitChart;
