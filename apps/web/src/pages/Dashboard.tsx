import { Users, UserCheck, AlertTriangle, UserX, IndianRupee } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { BranchChart } from "@/components/dashboard/BranchChart";
import { PlanChart } from "@/components/dashboard/PlanChart";
import { ExpiringMembers } from "@/components/dashboard/ExpiringMembers";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { mockMembers, calculateDashboardStats } from "@/data/mockData";

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: api.getDashboardStats,
  });

  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: api.getMembers,
  });

  const fallbackStats = calculateDashboardStats(mockMembers);
  const effectiveStats = stats ?? fallbackStats;
  const effectiveMembers = members ?? mockMembers;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your gym.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Members"
          value={effectiveStats.totalMembers}
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Active Members"
          value={effectiveStats.activeMembers}
          icon={UserCheck}
          variant="success"
        />
        <StatCard
          title="Expiring This Week"
          value={effectiveStats.expiringThisWeek}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Expired"
          value={effectiveStats.expiredMembers}
          icon={UserX}
          variant="destructive"
        />
        <StatCard
          title="Revenue (Active)"
          value={`₹${effectiveStats.monthlyRevenue.toLocaleString()}`}
          icon={IndianRupee}
          variant="primary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BranchChart data={effectiveStats.branchDistribution} />
        <PlanChart data={effectiveStats.planDistribution} />
      </div>

      {/* Expiring Members */}
      <ExpiringMembers members={effectiveMembers} />
    </div>
  );
}

