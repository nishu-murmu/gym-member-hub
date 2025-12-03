export type Branch = 'X' | 'Y' | 'Z';

export type PlanType = '1_month' | '3_month' | '6_month' | '12_month';

export interface Plan {
  id: PlanType;
  name: string;
  duration: number; // in months
  price: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: Branch;
  plan: PlanType;
  subscriptionStart: string;
  subscriptionEnd: string;
  status: 'active' | 'expired' | 'expiring_soon';
  createdAt: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiringThisWeek: number;
  expiredMembers: number;
  monthlyRevenue: number;
  branchDistribution: {
    branch: Branch;
    count: number;
  }[];
  planDistribution: {
    plan: PlanType;
    count: number;
  }[];
}

export const PLANS: Plan[] = [
  { id: '1_month', name: '1 Month', duration: 1, price: 1500 },
  { id: '3_month', name: '3 Months', duration: 3, price: 4000 },
  { id: '6_month', name: '6 Months', duration: 6, price: 7000 },
  { id: '12_month', name: '12 Months', duration: 12, price: 12000 },
];

export const BRANCHES: Branch[] = ['X', 'Y', 'Z'];

export const getPlanName = (planId: PlanType): string => {
  return PLANS.find(p => p.id === planId)?.name || planId;
};

export const getPlanPrice = (planId: PlanType): number => {
  return PLANS.find(p => p.id === planId)?.price || 0;
};
