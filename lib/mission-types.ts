export type MissionSection = "before" | "mystery" | "all"

export type MissionCard = {
  id: string
  section: MissionSection
  title: string
  detail: string
  story?: string
  points: number
  shot: "photo" | "selfie" | "memory" | "check"
  image?: string
  locked: boolean
  secret?: string
}

export type ShiningName = { id: string; pseudonym: string }

export type ShiningResult = ShiningName & { caught: boolean }
