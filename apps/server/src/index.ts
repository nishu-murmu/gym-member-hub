import "dotenv/config";
import express from "express";
import cors from "cors";
import { db } from "./db/client";
import { branches, plans } from "./db/schema";
import membersRouter from "./routes/members";
import branchesRouter from "./routes/branches";
import plansRouter from "./routes/plans";
import statsRouter from "./routes/stats";
import { startSubscriptionNotifier } from "./jobs/subscriptionNotifier";

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.WEB_ORIGIN || "*",
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/members", membersRouter);
app.use("/branches", branchesRouter);
app.use("/plans", plansRouter);
app.use("/stats", statsRouter);

async function seedIfNeeded() {
  const existingBranches = await db.select().from(branches);
  if (existingBranches.length === 0) {
    await db.insert(branches).values([
      { id: "X", name: "Branch X" },
      { id: "Y", name: "Branch Y" },
      { id: "Z", name: "Branch Z" },
    ]);
  }

  const existingPlans = await db.select().from(plans);
  if (existingPlans.length === 0) {
    await db.insert(plans).values([
      {
        id: "1_month",
        name: "1 Month",
        durationMonths: "1",
        price: "1500.00",
      },
      {
        id: "3_month",
        name: "3 Months",
        durationMonths: "3",
        price: "4000.00",
      },
      {
        id: "6_month",
        name: "6 Months",
        durationMonths: "6",
        price: "7000.00",
      },
      {
        id: "12_month",
        name: "12 Months",
        durationMonths: "12",
        price: "12000.00",
      },
    ]);
  }
}

async function main() {
  await seedIfNeeded();
  startSubscriptionNotifier();

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});

