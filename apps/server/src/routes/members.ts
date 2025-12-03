import { Router } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../db/client";
import { members } from "../db/schema";
import { z } from "zod";
import { sendWhatsAppMessage } from "../services/whatsapp";

const router = Router();

const memberBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  branch: z.enum(["X", "Y", "Z"]),
  plan: z.enum(["1_month", "3_month", "6_month", "12_month"]),
  subscriptionStart: z.string(),
  subscriptionEnd: z.string(),
});

function computeStatus(subscriptionEnd: string): "active" | "expired" | "expiring_soon" {
  const today = new Date();
  const end = new Date(subscriptionEnd);
  const diffDays = Math.floor(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays < 0) return "expired";
  if (diffDays <= 7) return "expiring_soon";
  return "active";
}

router.get("/", async (_req, res) => {
  const all = await db.select().from(members);
  res.json(all);
});

router.get("/:id", async (req, res) => {
  const [member] = await db
    .select()
    .from(members)
    .where(eq(members.id, req.params.id));

  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  res.json(member);
});

router.post("/", async (req, res) => {
  const parseResult = memberBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.flatten() });
  }

  const data = parseResult.data;
  const status = computeStatus(data.subscriptionEnd);

  const [created] = await db
    .insert(members)
    .values({
      ...data,
      status,
    })
    .returning();

  // Fire-and-forget WhatsApp welcome message
  sendWhatsAppMessage(
    created.phone,
    `Welcome to the gym, ${created.name}! Your plan (${created.plan}) is active until ${created.subscriptionEnd}.`
  ).catch((err) =>
    console.error("[whatsapp] Failed to send welcome message", err)
  );

  res.status(201).json(created);
});

router.put("/:id", async (req, res) => {
  const parseResult = memberBodySchema.partial({}).safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.flatten() });
  }

  const data = parseResult.data;

  const [existing] = await db
    .select()
    .from(members)
    .where(eq(members.id, req.params.id));

  if (!existing) {
    return res.status(404).json({ message: "Member not found" });
  }

  const subscriptionEnd =
    data.subscriptionEnd ?? existing.subscriptionEnd.toString();

  const status = computeStatus(subscriptionEnd);

  const [updated] = await db
    .update(members)
    .set({
      ...existing,
      ...data,
      status,
      updatedAt: new Date(),
    })
    .where(eq(members.id, req.params.id))
    .returning();

  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const [existing] = await db
    .select()
    .from(members)
    .where(eq(members.id, req.params.id));

  if (!existing) {
    return res.status(404).json({ message: "Member not found" });
  }

  await db.delete(members).where(eq(members.id, req.params.id));

  res.status(204).send();
});

export default router;

