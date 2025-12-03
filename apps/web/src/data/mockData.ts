import { Member, DashboardStats, Branch, PlanType } from '@/types/gym';
import { addDays, subDays, format } from 'date-fns';

const generateMockMembers = (): Member[] => {
  const names = [
    'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Gupta', 'Vikram Singh',
    'Anjali Verma', 'Rohit Joshi', 'Neha Agarwal', 'Suresh Reddy', 'Pooja Mehta',
    'Arun Nair', 'Divya Iyer', 'Karthik Menon', 'Swati Desai', 'Manish Yadav',
    'Ritu Saxena', 'Deepak Malhotra', 'Kavita Rao', 'Sanjay Chopra', 'Meera Shah'
  ];

  const branches: Branch[] = ['X', 'Y', 'Z'];
  const plans: PlanType[] = ['1_month', '3_month', '6_month', '12_month'];

  return names.map((name, index) => {
    const branch = branches[index % 3];
    const plan = plans[index % 4];
    const planDuration = plan === '1_month' ? 1 : plan === '3_month' ? 3 : plan === '6_month' ? 6 : 12;
    
    const startOffset = Math.floor(Math.random() * 60) - 30;
    const subscriptionStart = subDays(new Date(), Math.abs(startOffset) + (planDuration * 30 - 10));
    const subscriptionEnd = addDays(subscriptionStart, planDuration * 30);
    
    const today = new Date();
    const daysUntilExpiry = Math.floor((subscriptionEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let status: 'active' | 'expired' | 'expiring_soon' = 'active';
    if (daysUntilExpiry < 0) status = 'expired';
    else if (daysUntilExpiry <= 7) status = 'expiring_soon';

    return {
      id: `member-${index + 1}`,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      branch,
      plan,
      subscriptionStart: format(subscriptionStart, 'yyyy-MM-dd'),
      subscriptionEnd: format(subscriptionEnd, 'yyyy-MM-dd'),
      status,
      createdAt: format(subscriptionStart, 'yyyy-MM-dd'),
    };
  });
};

export const mockMembers = generateMockMembers();

export const calculateDashboardStats = (members: Member[]): DashboardStats => {
  const activeMembers = members.filter(m => m.status === 'active').length;
  const expiringThisWeek = members.filter(m => m.status === 'expiring_soon').length;
  const expiredMembers = members.filter(m => m.status === 'expired').length;

  const branchDistribution = (['X', 'Y', 'Z'] as Branch[]).map(branch => ({
    branch,
    count: members.filter(m => m.branch === branch).length,
  }));

  const planDistribution = (['1_month', '3_month', '6_month', '12_month'] as PlanType[]).map(plan => ({
    plan,
    count: members.filter(m => m.plan === plan).length,
  }));

  const monthlyRevenue = members
    .filter(m => m.status !== 'expired')
    .reduce((sum, m) => {
      const planPrices: Record<PlanType, number> = {
        '1_month': 1500,
        '3_month': 4000,
        '6_month': 7000,
        '12_month': 12000,
      };
      return sum + planPrices[m.plan];
    }, 0);

  return {
    totalMembers: members.length,
    activeMembers,
    expiringThisWeek,
    expiredMembers,
    monthlyRevenue,
    branchDistribution,
    planDistribution,
  };
};
