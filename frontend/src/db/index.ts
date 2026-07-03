import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

const rawUrl = process.env.DATABASE_URL
if (!rawUrl) throw new Error("DATABASE_URL is not set")

const url = rawUrl.includes("-pooler.")
  ? rawUrl.replace("-pooler.", ".")
  : rawUrl

const sql = neon(url)
export const db = drizzle({ client: sql })

export * from "./schema"
