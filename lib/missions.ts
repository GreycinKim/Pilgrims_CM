import { SHINING_CAUGHT_POINTS } from "./shining-score.ts"

export const MISSION_POINTS = 25
export const MYSTERY_POINTS = 200
export const MYSTERY_COUNT = 3
export const SHINING_COUNT = 3

/** 11:59 PM Pacific on Thursday, Oct 29, 2026. Pacific is UTC−7 that week. */
export const SHINING_UNLOCK_MS = Date.parse("2026-10-30T06:59:00.000Z")
/** 11:59 PM Pacific on Thursday, Oct 29, 2026. */
export const MYSTERY_UNLOCK_MS = Date.parse("2026-10-30T06:59:00.000Z")

export type MissionGroup = "before" | "mystery" | "all"
export type MissionShot = "photo" | "selfie" | "memory" | "check"

export type Mission = {
  id: string
  group: MissionGroup
  shot: MissionShot
  title: string
  detail: string
  story?: string
  points: number
  image?: string
}

export const missions: Mission[] = [
  {
    id: "passport",
    group: "before",
    shot: "photo",
    title: "Pilgrim’s Passport",
    detail: "Bring your Pilgrim’s Passport on the trip. A photo of it, packed and ready.",
    points: MISSION_POINTS,
  },
  {
    id: "hebrews",
    group: "before",
    shot: "memory",
    title: "Hebrews 11:13–16",
    detail: "Memorize Hebrews 11:13–16. No photo. Mark it when you have the verses.",
    points: MISSION_POINTS,
  },
  {
    id: "playlist",
    group: "before",
    shot: "selfie",
    title: "Pilgrim playlist",
    detail:
      "Pick one song for the road. It must be a Christian, church, or hymnal song. A selfie with the song playing, or a screenshot.",
    points: MISSION_POINTS,
  },
  {
    id: "scroll",
    group: "before",
    shot: "photo",
    title: "Pack your scroll",
    detail:
      "Choose a verse that has made the greatest impact for you, or comforted you in your life. Write it on paper, roll it like a scroll, and tie it with string. A photo of you holding it. Bring it on the trip.",
    points: 100,
  },
  {
    id: "evangelist-caught",
    group: "mystery",
    shot: "photo",
    title: "Don’t get caught",
    story: "Evangelist meets Christian in secret and points him to the gate.",
    detail: "Take a photo with Evangelist. Don’t get caught.",
    points: MYSTERY_POINTS,
  },
  {
    id: "faithful",
    group: "mystery",
    shot: "selfie",
    title: "Find your Faithful",
    story: "Faithful is a stranger from Christian’s hometown who becomes his closest companion.",
    detail:
      "Find someone on the trip you have never really talked to. Ask how they came to church, and what struggle they have in the Christian life. A photo of the two of you.",
    points: MYSTERY_POINTS,
  },
  {
    id: "arbor",
    group: "mystery",
    shot: "photo",
    title: "Asleep in the arbour",
    story: "Christian dozes off in a resting place on the hill and loses his scroll.",
    detail: "Catch a fellow pilgrim napping during the trip.",
    points: MYSTERY_POINTS,
  },
  {
    id: "sunrise",
    group: "mystery",
    shot: "photo",
    title: "Glimpse of the Celestial City",
    story: "From the Delectable Mountains, Christian sees the Celestial City far in the distance.",
    detail: "At sunrise, take an aesthetic photo with your Bible. A silhouette against the sunrise.",
    points: MYSTERY_POINTS,
  },
  {
    id: "sword",
    group: "mystery",
    shot: "photo",
    title: "The Sword of the Spirit",
    story: "Christian fights the dragon Apollyon with his sword.",
    detail:
      "Take a battle pose holding your Bible like a sword, while a friend plays Apollyon with a scary face and claws.",
    points: MYSTERY_POINTS,
  },
  {
    id: "perspective-glass",
    group: "mystery",
    shot: "photo",
    title: "The Perspective Glass",
    story: "On the Delectable Mountains, the shepherds hand Christian a telescope to look toward the Celestial City.",
    detail:
      "Take a photo looking at the horizon through your hands curled like a telescope, with your Bible tucked under your arm.",
    points: MYSTERY_POINTS,
  },
  {
    id: "celestial-sky",
    group: "mystery",
    shot: "photo",
    title: "The Celestial Sky",
    story: "The Celestial City shines brighter than the sun.",
    detail: "On a clear night, hold your Bible up against the stars and use your phone’s night mode.",
    points: MYSTERY_POINTS,
  },
  {
    id: "eternal-life",
    group: "mystery",
    shot: "photo",
    title: "Life, Life, Eternal Life!",
    story:
      "When Christian’s family begs him to come back, he puts his fingers in his ears and runs away shouting about eternal life.",
    detail:
      "Take an action shot of yourself running with your fingers in your ears and your Bible tucked under your arm.",
    points: MYSTERY_POINTS,
  },
  {
    id: "hopeful-hymn",
    group: "mystery",
    shot: "check",
    title: "Hopeful’s hymn",
    story: "Hopeful keeps Christian going when he is sinking.",
    detail:
      "Record a 15-second voice memo singing a hymnal for any brethren and send it to them. The memo is the proof. Check this when it is sent.",
    points: MYSTERY_POINTS,
  },
  {
    id: "recitation",
    group: "mystery",
    shot: "check",
    title: "Recitation",
    story: "Christian reads his scroll for comfort on the road.",
    detail: "Recite the retreat verse, Hebrews 11:13–16.",
    points: MYSTERY_POINTS,
  },
  {
    id: "pilgrim-names",
    group: "mystery",
    shot: "check",
    title: "Learn every pilgrim’s name",
    detail:
      "By Saturday morning, know everyone’s real name. Recite every name to someone. A brother or sister confirms it.",
    points: MYSTERY_POINTS,
  },
  {
    id: "carry-burden",
    group: "mystery",
    shot: "check",
    title: "Carry the burden",
    detail:
      "Strap a sleeping bag or pillow on your back and wear it at camp until the sermon. Explain why to anyone who asks.",
    points: MYSTERY_POINTS,
  },
  {
    id: "vanity-trade",
    group: "mystery",
    shot: "check",
    title: "Trade up at Vanity Fair",
    story: "Vanity Fair is where pilgrims are pressed to buy and trade.",
    detail: "Start with a pebble and trade up with people at camp. See what you end up with by Saturday.",
    points: MYSTERY_POINTS,
  },
  {
    id: "recreate-burden",
    group: "mystery",
    shot: "photo",
    title: "Recreate the burden",
    story: "Christian leaves the City of Destruction with a book in his hand and a burden on his back.",
    detail: "Recreate this picture. A photo of your version.",
    image: "/missions/burden-color.png",
    points: MYSTERY_POINTS,
  },
  {
    id: "recreate-hill",
    group: "mystery",
    shot: "photo",
    title: "Recreate the climb",
    story: "Christian toils up Hill Difficulty under the burden, one hand shading his eyes.",
    detail: "Recreate this picture. A photo of your version.",
    image: "/missions/burden-line.png",
    points: MYSTERY_POINTS,
  },
  {
    id: "recreate-scholar",
    group: "mystery",
    shot: "photo",
    title: "Recreate the reader",
    story: "A pilgrim bends over the book, the burden still strapped to his back.",
    detail: "Recreate this picture. A photo of your version.",
    image: "/missions/scholar.png",
    points: MYSTERY_POINTS,
  },
  {
    id: "shining",
    group: "all",
    shot: "photo",
    title: "The Shining Ones",
    story: "The Shining Ones meet Christian at the cross and again at the river.",
    detail:
      "Three readers are secretly Shining Ones. Encourage people all weekend without being caught. The group names them together in person. If every Shining One is named, each reader gets 250. A Shining One nobody names gets 300. A photo of the Shining Ones together.",
    points: SHINING_CAUGHT_POINTS,
  },
]

const byId = new Map(missions.map((mission) => [mission.id, mission]))

export function getMission(id: string) {
  return byId.get(id)
}

export function isRecreateMission(id: string) {
  return id.startsWith("recreate-")
}

export function missionsIn(group: MissionGroup) {
  return missions.filter((mission) => mission.group === group)
}

export const mysteryPool = missionsIn("mystery")

export function missionUnlocked(group: MissionGroup, now: number) {
  if (group === "before") return true
  if (group === "mystery") return now >= MYSTERY_UNLOCK_MS
  return now >= SHINING_UNLOCK_MS
}

export function lockLabel(group: MissionGroup) {
  if (group === "mystery") return "Unlocks Thursday, Oct 29 at 11:59 PM Pacific."
  if (group === "all") return "Unlocks Thursday, Oct 29 at 11:59 PM Pacific."
  return ""
}

export function missionPhotoSrc(id: string, takenAt: string | null | undefined) {
  if (!takenAt || !getMission(id)) return null
  return `/api/mission/${encodeURIComponent(id)}?v=${encodeURIComponent(takenAt)}`
}
