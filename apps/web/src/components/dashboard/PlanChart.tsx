import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PlanType, getPlanName } from "@/types/gym";

interface PlanChartProps {
  data: { plan: PlanType; count: number }[];
}

export function PlanChart({ data }: PlanChartProps) {
  const chartData = data.map(item => ({
    name: getPlanName(item.plan),
    members: item.count,
  }));

  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <h3 className="text-lg font-semibold mb-4">Members by Plan</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar 
              dataKey="members" 
              fill="hsl(174, 72%, 40%)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
