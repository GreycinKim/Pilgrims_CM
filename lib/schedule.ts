export type ScheduleRow = {
  time: string
  activity: string
}

export type ScheduleDay = {
  name: "Friday" | "Saturday"
  rows: ScheduleRow[]
}

export const SCHEDULE_DAYS = ["Friday", "Saturday"] as const

const TIME_MAX = 40
const ACTIVITY_MAX = 280
const ROW_MAX = 30

export const DEFAULT_SCHEDULE: ScheduleDay[] = [
  {
    name: "Friday",
    rows: [
      { time: "2:00 PM", activity: "Wave 1 departs" },
      { time: "5:30 PM", activity: "Arrive at Cottonwood, set up camp together" },
      { time: "6:30 PM", activity: "Dinner" },
      { time: "7:30 AM", activity: "Praise & sermon" },
      { time: "9:30 PM", activity: "" },
      { time: "9:45 PM", activity: "Fellowship" },
      { time: "11:00 PM", activity: "Late Night Snack" },
    ],
  },
  {
    name: "Saturday",
    rows: [
      {
        time: "7:00 AM",
        activity: "Wake up; optional sunrise walk and quiet time on the Cottonwood Spring trail",
      },
      { time: "7:45 AM", activity: "Breakfast" },
      { time: "8:30 AM", activity: "TBA" },
      { time: "9:30 AM", activity: "" },
      { time: "10:30 AM", activity: "Clean Pack Up" },
      { time: "11:00 AM", activity: "Depart" },
      { time: "12:00 PM", activity: "Lake Perris" },
      { time: "2:30 PM", activity: "Arrive back in Santa Ana" },
    ],
  },
]

export function normalizeSchedule(
  input: unknown,
): { ok: true; days: ScheduleDay[] } | { ok: false; error: string } {
  if (!Array.isArray(input)) return { ok: false, error: "The schedule could not be read." }
  const byName = new Map<ScheduleDay["name"], ScheduleRow[]>()
  for (const item of input) {
    if (!item || typeof item !== "object") return { ok: false, error: "The schedule could not be read." }
    const record = item as Record<string, unknown>
    const name = typeof record.name === "string" ? record.name.trim() : ""
    if (name !== "Friday" && name !== "Saturday") {
      return { ok: false, error: "Keep the days as Friday and Saturday." }
    }
    if (byName.has(name)) return { ok: false, error: "The schedule could not be read." }
    if (!Array.isArray(record.rows)) return { ok: false, error: "The schedule could not be read." }
    const rows: ScheduleRow[] = []
    for (const raw of record.rows) {
      if (!raw || typeof raw !== "object") return { ok: false, error: "The schedule could not be read." }
      const line = raw as Record<string, unknown>
      const time = typeof line.time === "string" ? line.time.trim().replace(/\s+/g, " ") : ""
      const activity = typeof line.activity === "string" ? line.activity.trim().replace(/\s+/g, " ") : ""
      if (!time && !activity) continue
      if (!time) return { ok: false, error: "Add a time for each line." }
      if (time.length > TIME_MAX) return { ok: false, error: "Use a shorter time." }
      if (activity.length > ACTIVITY_MAX) return { ok: false, error: "Use a shorter activity." }
      rows.push({ time, activity })
    }
    if (rows.length > ROW_MAX) return { ok: false, error: "That day has too many lines." }
    byName.set(name, rows)
  }
  if (byName.size !== SCHEDULE_DAYS.length) {
    return { ok: false, error: "Keep the days as Friday and Saturday." }
  }
  return {
    ok: true,
    days: SCHEDULE_DAYS.map((name) => ({ name, rows: byName.get(name) ?? [] })),
  }
}
