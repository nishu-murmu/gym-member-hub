import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  timestamp,
  date,
  numeric,
  integer,
} from "drizzle-orm/pg-core";

export const branchTypeEnum = pgEnum("branch_type", ["X", "Y", "Z"]);

export const planTypeEnum = pgEnum("plan_type", [
  "1_month",
  "3_month",
  "6_month",
  "12_month",
]);

export const memberStatusEnum = pgEnum("member_status", [
  "active",
  "expired",
  "expiring_soon",
]);

export const branches = pgTable("branches", {
  id: branchTypeEnum("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const plans = pgTable("plans", {
  id: planTypeEnum("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  durationMonths: integer("duration_months").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  branch: branchTypeEnum("branch").notNull(),
  plan: planTypeEnum("plan").notNull(),
  subscriptionStart: date("subscription_start").notNull(),
  subscriptionEnd: date("subscription_end").notNull(),
  status: memberStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type BranchId = (typeof branches.$inferSelect)["id"];
export type PlanId = (typeof plans.$inferSelect)["id"];
export type MemberStatus = (typeof members.$inferSelect)["status"];
