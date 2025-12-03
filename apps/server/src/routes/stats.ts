import { Router } from "express";
import { and } from "drizzle-orm";
import { db } from "../db/client";
import { branches, members, plans } from "../db/schema";

const router = Router();

router.get("/dashboard", async (_req, res) => {
  const allMembers = await db.select().from(members);
  const allPlans = await db.select().from(plans);
  const allBranches = await db.select().from(branches);

  const activeMembers = allMembers.filter((m) => m.status === "active").length;
  const expiredMembers = allMembers.filter((m) => m.status === "expired").length;
  const expiringSoon = allMembers.filter(
    (m) => m.status === "expiring_soon"
  ).length;

  const branchDistribution = allBranches.map((b) => ({
    branch: b.id,
    count: allMembers.filter((m) => m.branch === b.id).length,
  }));

  const planDistribution = allPlans.map((p) => ({
    plan: p.id,
    count: allMembers.filter((m) => m.plan === p.id).length,
  }));

  const planPriceMap = new Map(allPlans.map((p) => [p.id, Number(p.price)]));

  const nonExpiredMembers = allMembers.filter((m) => m.status !== "expired");

  const monthlyRevenue = nonExpiredMembers.reduce((sum, member) => {
    const price = planPriceMap.get(member.plan) ?? 0;
    return sum + price;
  }, 0);

  res.json({
    totalMembers: allMembers.length,
    activeMembers,
    expiredMembers,
    expiringThisWeek: expiringSoon,
    monthlyRevenue,
    branchDistribution,
    planDistribution,
  });
});

export default router;
