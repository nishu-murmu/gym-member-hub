import { Router } from "express";
import { db } from "../db/client";
import { branches } from "../db/schema";

const router = Router();

router.get("/", async (_req, res) => {
  const all = await db.select().from(branches);
  res.json(all);
});

export default router;

