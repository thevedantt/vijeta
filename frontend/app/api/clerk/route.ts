import { verifyClerkWebhook } from "@/backend/utils/clerk"
import { upsertUserFromClerk } from "@/backend/db/queries/users"

export async function POST(request: Request) {
  let event
  try {
    event = await verifyClerkWebhook(request)
  } catch (err) {
    console.error("Clerk webhook verification failed:", err)
    return new Response("Webhook verification failed", { status: 400 })
  }

  if (event.type === "user.created" || event.type === "user.updated") {
    const user = event.data
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || "New User"
    const email = user.email_addresses[0]?.email_address ?? ""

    await upsertUserFromClerk({
      clerkId: user.id,
      name,
      email,
      avatar: user.image_url,
    })
  }

  return new Response(null, { status: 200 })
}
