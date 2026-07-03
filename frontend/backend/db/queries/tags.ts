import { inArray } from "drizzle-orm"
import { db, tags } from "@/src/db"

export async function resolveTagIds(
  names: string[],
  category: string = "skill",
): Promise<number[]> {
  const uniqueNames = [...new Set(names.map((n) => n.trim()).filter(Boolean))]
  if (uniqueNames.length === 0) return []

  await db
    .insert(tags)
    .values(uniqueNames.map((name) => ({ name, category })))
    .onConflictDoNothing({ target: tags.name })

  const rows = await db
    .select({ id: tags.id })
    .from(tags)
    .where(inArray(tags.name, uniqueNames))

  return rows.map((r) => r.id)
}
