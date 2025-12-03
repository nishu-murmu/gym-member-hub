import { and, eq, gte, lte } from "drizzle-orm";
import cron from "node-cron";
import { db } from "../db/client";
import { members } from "../db/schema";
import { sendWhatsAppMessage } from "../services/whatsapp";

function todayDateOnly(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function startSubscriptionNotifier() {
  // Run every day at 09:00 server time
  cron.schedule("0 9 * * *", async () => {
    const today = todayDateOnly();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);

    try {
      const expiringSoonMembers = await db
        .select()
        .from(members)
        .where(
          and(
            gte(members.subscriptionEnd, today),
            lte(members.subscriptionEnd, threeDaysFromNow)
          )
        );

      for (const member of expiringSoonMembers) {
        await sendWhatsAppMessage(
          member.phone,
          `Hi ${member.name}, your gym membership is expiring on ${member.subscriptionEnd}. Please renew to continue your training!`
        );
      }
    } catch (err) {
      console.error("[notifier] Failed to send expiry notifications", err);
    }
  });
}

