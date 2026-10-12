import assert from "node:assert/strict"
import test from "node:test"
import { drawMysteryIds, nextShiningIds, pickFromPool } from "./mission-draw.ts"
import { MYSTERY_COUNT, SHINING_COUNT, isRecreateMission, mysteryPool } from "./missions.ts"

test("a reader’s mystery draw is three stable missions from the pool", () => {
  const first = drawMysteryIds("reader-a")
  const second = drawMysteryIds("reader-a")
  assert.deepEqual(first, second)
  assert.equal(first.length, MYSTERY_COUNT)
  assert.equal(new Set(first).size, MYSTERY_COUNT)
  for (const id of first) assert.ok(mysteryPool.some((mission) => mission.id === id))
  assert.ok(first.filter((id) => isRecreateMission(id)).length <= 1)
  assert.notDeepEqual(drawMysteryIds("reader-a"), drawMysteryIds("reader-b"))
  for (let index = 0; index < 40; index += 1) {
    const draw = drawMysteryIds(`reader-${index}`)
    assert.equal(draw.length, MYSTERY_COUNT)
    assert.ok(draw.filter((id) => isRecreateMission(id)).length <= 1)
  }
})

test("shining ones fill to three and are not replaced", () => {
  const first = nextShiningIds([], ["c", "a", "b", "e", "d"])
  assert.equal(first.length, SHINING_COUNT)
  assert.equal(new Set(first).size, SHINING_COUNT)
  const more = nextShiningIds(first, ["c", "a", "b", "e", "d", "f"])
  assert.deepEqual(more, [])
  const partial = nextShiningIds(["a"], ["a", "b", "c"])
  assert.equal(partial.length, 2)
  assert.equal(partial.includes("a"), false)
})

test("the same seed always picks the same order", () => {
  const pool = ["one", "two", "three", "four", "five"]
  assert.deepEqual(pickFromPool("seed", pool, 3), pickFromPool("seed", pool, 3))
})
