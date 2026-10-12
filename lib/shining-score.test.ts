import assert from "node:assert/strict"
import test from "node:test"
import { SHINING_CAUGHT_POINTS, SHINING_HIDDEN_POINTS, shiningAwardPoints } from "./shining-score.ts"

test("naming every Shining One pays 250 to each reader", () => {
  const points = shiningAwardPoints({
    roster: ["a", "b", "c"],
    guesses: [
      ["a", "b", "x"],
      ["c", "y", "z"],
    ],
    userIds: ["a", "b", "c", "d"],
  })
  assert.equal(points.get("a"), SHINING_CAUGHT_POINTS)
  assert.equal(points.get("b"), SHINING_CAUGHT_POINTS)
  assert.equal(points.get("c"), SHINING_CAUGHT_POINTS)
  assert.equal(points.get("d"), SHINING_CAUGHT_POINTS)
})

test("a Shining One nobody names gets 300 and the company does not", () => {
  const points = shiningAwardPoints({
    roster: ["a", "b", "c"],
    guesses: [["a", "b", "x"]],
    userIds: ["a", "b", "c", "d"],
  })
  assert.equal(points.get("c"), SHINING_HIDDEN_POINTS)
  assert.equal(points.get("a"), 0)
  assert.equal(points.get("b"), 0)
  assert.equal(points.get("d"), 0)
})

test("with no guesses, each Shining One gets 300", () => {
  const points = shiningAwardPoints({
    roster: ["a", "b", "c"],
    guesses: [],
    userIds: ["a", "b", "c", "d"],
  })
  assert.equal(points.get("a"), SHINING_HIDDEN_POINTS)
  assert.equal(points.get("d"), 0)
})
