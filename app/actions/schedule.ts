"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/dal"
import { replaceSchedule } from "@/lib/db"
import { normalizeSchedule, type ScheduleDay } from "@/lib/schedule"

export async function saveRetreatSchedule(
  input: unknown,
): Promise<{ days?: ScheduleDay[]; error?: string }> {
  const admin = await getCurrentUser()
  if (!admin?.admin) return { error: "Only an admin can change the schedule." }
  const parsed = normalizeSchedule(input)
  if (!parsed.ok) return { error: parsed.error }
  replaceSchedule(parsed.days)
  revalidatePath("/journal")
  return { days: parsed.days }
}
