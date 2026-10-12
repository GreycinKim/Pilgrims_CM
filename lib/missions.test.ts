import assert from "node:assert/strict"
import test from "node:test"
import { SHINING_CAUGHT_POINTS } from "./shining-score.ts"
import {
  MISSION_POINTS,
  MYSTERY_POINTS,
  MYSTERY_UNLOCK_MS,
  SHINING_COUNT,
  SHINING_UNLOCK_MS,
  getMission,
  missionUnlocked,
  missions,
  missionsIn,
} from "./missions.ts"

test("pre-trip missions are shared, and mystery missions stay locked until 11:59 PM Pacific", () => {
  const ids = missions.map((mission) => mission.id)
  assert.equal(new Set(ids).size, ids.length)
  assert.equal(missionsIn("before").length, 4)
  assert.equal(missionsIn("mystery").length, 16)
  assert.equal(missionsIn("mystery").filter((mission) => mission.id.startsWith("recreate-")).length, 3)
  assert.equal(missionsIn("mystery").filter((mission) => mission.shot === "check").length, 5)
  assert.equal(missionsIn("all").length, 1)
  assert.equal(SHINING_COUNT, 3)
  for (const mission of missions) {
    assert.equal(
      mission.points,
      mission.group === "mystery"
        ? MYSTERY_POINTS
        : mission.id === "scroll"
          ? 100
          : mission.id === "shining"
            ? SHINING_CAUGHT_POINTS
            : MISSION_POINTS,
    )
    assert.equal(getMission(mission.id)?.title, mission.title)
  }
  const beforeMystery = MYSTERY_UNLOCK_MS - 1
  const afterMystery = MYSTERY_UNLOCK_MS
  assert.equal(missionUnlocked("before", beforeMystery), true)
  assert.equal(missionUnlocked("mystery", beforeMystery), false)
  assert.equal(missionUnlocked("mystery", afterMystery), true)
  assert.equal(missionUnlocked("all", SHINING_UNLOCK_MS - 1), false)
  assert.equal(missionUnlocked("all", SHINING_UNLOCK_MS), true)
  assert.equal(SHINING_UNLOCK_MS, MYSTERY_UNLOCK_MS)
  assert.equal(MYSTERY_UNLOCK_MS, Date.parse("2026-10-30T06:59:00.000Z"))
  assert.equal(getMission("hebrews")?.shot, "memory")
})
