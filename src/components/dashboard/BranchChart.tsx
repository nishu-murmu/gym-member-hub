import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Branch } from "@/types/gym";

interface BranchChartProps {
  data: { branch: Branch; count: number }[];
}

const COLORS = ['hsl(174, 72%, 40%)', 'hsl(16, 85%, 57%)', 'hsl(38, 92%, 50%)'];

export function BranchChart({ data }: BranchChartProps) {
  const chartData = data.map((item, index) => ({
    name: `Branch ${item.branch}`,
    value: item.count,
    color: COLORS[index],
  }));

  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <h3 className="text-lg font-semibold mb-4">Members by Branch</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
