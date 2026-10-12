/** Paid to every reader when every Shining One is named. */
export const SHINING_CAUGHT_POINTS = 250
/** Paid to a Shining One whom nobody names. */
export const SHINING_HIDDEN_POINTS = 300

/** A Shining One is caught when at least one guess names them. */
export function caughtShiningIds(roster: readonly string[], guesses: readonly (readonly string[])[]) {
  const named = new Set(guesses.flat())
  return roster.filter((id) => named.has(id))
}

/**
 * If every Shining One is named, each reader gets 250.
 * Otherwise a Shining One nobody names gets 300, and no one else scores.
 */
export function shiningAwardPoints(input: {
  roster: readonly string[]
  guesses: readonly (readonly string[])[]
  userIds: readonly string[]
}) {
  const points = new Map<string, number>()
  for (const id of input.userIds) points.set(id, 0)
  if (input.roster.length === 0) return points
  const caught = new Set(caughtShiningIds(input.roster, input.guesses))
  if (caught.size === input.roster.length) {
    for (const id of input.userIds) points.set(id, SHINING_CAUGHT_POINTS)
    return points
  }
  for (const id of input.roster) {
    if (!caught.has(id)) points.set(id, SHINING_HIDDEN_POINTS)
  }
  return points
}
