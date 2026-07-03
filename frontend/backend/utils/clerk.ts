import { verifyWebhook, type WebhookEvent } from "@clerk/backend/webhooks"

export async function verifyClerkWebhook(request: Request): Promise<WebhookEvent> {
  return verifyWebhook(request)
}
