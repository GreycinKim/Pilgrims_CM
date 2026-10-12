import "server-only"
import {
  listAccounts,
  listShiningGuesses,
  mysteryDraw,
  shiningGuess,
  shiningIsRevealed,
  shiningRoster,
} from "@/lib/db"
import {
  getMission,
  lockLabel,
  missionUnlocked,
  missionsIn,
} from "@/lib/missions"
import type { MissionCard, ShiningName, ShiningResult } from "@/lib/mission-types"
import { caughtShiningIds } from "@/lib/shining-score"

export type { MissionCard, ShiningName }

const SHINING_SECRET =
  "You are a Shining One. Quietly encourage people all weekend. Do not let them catch you at it. At the end, stand with the other Shining Ones for the photo."

export function cardsFor(userId: string, admin: boolean, now = Date.now()) {
  const draw = mysteryDraw(userId)
  const shining = shiningRoster(now)
  const youAreShining = shining.includes(userId)
  const assigned = [
    ...missionsIn("before"),
    ...draw.flatMap((id) => {
      const mission = getMission(id)
      return mission ? [mission] : []
    }),
    ...missionsIn("all"),
  ]
  const cards: MissionCard[] = assigned.map((mission, index) => {
    const open = admin || missionUnlocked(mission.group, now)
    if (!open) {
      return {
        id: `locked-${mission.group}-${index}`,
        section: mission.group,
        title: mission.group === "mystery" ? "Mystery mission" : mission.title,
        detail: lockLabel(mission.group),
        points: mission.points,
        shot: mission.shot,
        locked: true,
      }
    }
    return {
      id: mission.id,
      section: mission.group,
      title: mission.title,
      detail: mission.detail,
      story: mission.story,
      points: mission.points,
      shot: mission.shot,
      image: mission.image,
      locked: false,
      secret: mission.id === "shining" && youAreShining ? SHINING_SECRET : undefined,
    }
  })
  const names = new Map(listAccounts().map((account) => [account.id, account.pseudonym]))
  const revealed = shiningIsRevealed()
  const named = (id: string): ShiningName => ({ id, pseudonym: names.get(id) ?? "Reader" })
  const roster: ShiningName[] =
    admin || revealed
      ? shining.map(named).sort((a, b) => a.pseudonym.localeCompare(b.pseudonym))
      : []
  const caught = new Set(caughtShiningIds(shining, listShiningGuesses()))
  const shiningResults: ShiningResult[] | null = revealed
    ? shining
        .map((id) => ({ ...named(id), caught: caught.has(id) }))
        .sort((a, b) => a.pseudonym.localeCompare(b.pseudonym))
    : null
  return {
    cards,
    roster,
    shiningOpen: missionUnlocked("all", now),
    shiningRevealed: revealed,
    shiningGuess: shiningGuess(userId),
    shiningResults,
  }
}

export function mayUploadMission(userId: string, missionId: string, admin: boolean, now = Date.now()) {
  const mission = getMission(missionId)
  if (!mission) return "That mission is not on the card."
  if (mission.group === "mystery" && !mysteryDraw(userId).includes(missionId)) {
    return "That mission is not on your card."
  }
  if (!admin && !missionUnlocked(mission.group, now)) return "That mission is still locked."
  return null
}
