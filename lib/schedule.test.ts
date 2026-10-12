import assert from "node:assert/strict"
import test from "node:test"
import { DEFAULT_SCHEDULE, normalizeSchedule } from "./schedule.ts"

test("the retreat timetable starts from the posted Friday and Saturday", () => {
  assert.deepEqual(
    DEFAULT_SCHEDULE[0]?.rows.map((row) => [row.time, row.activity]),
    [
      ["2:00 PM", "Wave 1 departs"],
      ["5:30 PM", "Arrive at Cottonwood, set up camp together"],
      ["6:30 PM", "Dinner"],
      ["7:30 AM", "Praise & sermon"],
      ["9:30 PM", ""],
      ["9:45 PM", "Fellowship"],
      ["11:00 PM", "Late Night Snack"],
    ],
  )
  assert.equal(DEFAULT_SCHEDULE[1]?.rows[0]?.activity.includes("Cottonwood Spring"), true)
  assert.equal(DEFAULT_SCHEDULE[1]?.rows.at(-1)?.activity, "Arrive back in Santa Ana")
})

test("a schedule edit keeps both days and drops a blank line", () => {
  const parsed = normalizeSchedule([
    {
      name: "Saturday",
      rows: [
        { time: " 7:00 AM ", activity: "  Breakfast  " },
        { time: "   ", activity: "   " },
      ],
    },
    {
      name: "Friday",
      rows: [{ time: "2:00 PM", activity: "" }],
    },
  ])
  assert.equal(parsed.ok, true)
  if (!parsed.ok) return
  assert.deepEqual(parsed.days, [
    { name: "Friday", rows: [{ time: "2:00 PM", activity: "" }] },
    { name: "Saturday", rows: [{ time: "7:00 AM", activity: "Breakfast" }] },
  ])
})

test("a line with an activity still needs a time", () => {
  const parsed = normalizeSchedule([
    { name: "Friday", rows: [{ time: "", activity: "Dinner" }] },
    { name: "Saturday", rows: [] },
  ])
  assert.deepEqual(parsed, { ok: false, error: "Add a time for each line." })
})
