import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM;

const isConfigured = !!(accountSid && authToken && fromWhatsApp);

const client = isConfigured ? twilio(accountSid, authToken) : null;

export async function sendWhatsAppMessage(toPhone: string, message: string) {
  if (!isConfigured || !client) {
    console.warn(
      "[whatsapp] TWILIO credentials not fully configured; skipping send"
    );
    return;
  }

  const to = toPhone.startsWith("whatsapp:")
    ? toPhone
    : `whatsapp:${toPhone}`;

  await client.messages.create({
    body: message,
    from: fromWhatsApp!,
    to,
  });
}

