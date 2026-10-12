import { MYSTERY_COUNT, SHINING_COUNT, isRecreateMission, mysteryPool } from "./missions.ts"

/** Stable shuffle. The same seed and list always return the same order. */
export function pickFromPool(seed: string, pool: readonly string[], count: number) {
  const items = [...pool]
  const random = mulberry32(hashSeed(seed))
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1))
    const current = items[index]
    items[index] = items[swap]
    items[swap] = current
  }
  return items.slice(0, Math.min(count, items.length))
}

export function drawMysteryIds(userId: string) {
  const ordered = pickFromPool(
    `mystery:${userId}`,
    mysteryPool.map((mission) => mission.id),
    mysteryPool.length,
  )
  const chosen: string[] = []
  let recreates = 0
  for (const id of ordered) {
    if (isRecreateMission(id)) {
      if (recreates >= 1) continue
      recreates += 1
    }
    chosen.push(id)
    if (chosen.length === MYSTERY_COUNT) break
  }
  return chosen
}

/** Fill the secret roster up to three without dropping anyone already chosen. */
export function nextShiningIds(already: readonly string[], userIds: readonly string[]) {
  const chosen = new Set(already)
  if (chosen.size >= SHINING_COUNT) return []
  const open = [...userIds].filter((id) => !chosen.has(id)).sort()
  return pickFromPool("shining-roster-v1", open, SHINING_COUNT - chosen.size)
}

function hashSeed(text: string) {
  let hash = 2166136261
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}
