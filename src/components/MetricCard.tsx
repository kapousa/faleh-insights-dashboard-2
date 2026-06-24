import { PieChart, Pie, Cell } from 'recharts';

const MetricCard = ({ label, score }: { label: string, score: number }) => {
  const data = [{ value: score }, { value: 100 - score }];

  return (
    <div className="bg-brand-navy p-6 rounded-2xl flex flex-col items-center shadow-lg border border-white/10">
      <h3 className="text-white/60 text-sm mb-4 uppercase tracking-widest">{label}</h3>
      <div className="relative w-32 h-32">
        <PieChart width={128} height={128}>
          <Pie
            data={data}
            innerRadius={45}
            outerRadius={60}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
          >
            <Cell fill="#FFD700" /> {/* Gold for progress */}
            <Cell fill="#1e293b" /> {/* Darker Navy for empty space */}
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
          {score}%
        </div>
      </div>
    </div>
  );
};