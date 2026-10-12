"use client"

import { BookOpen, Camera, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useState, useTransition, type ChangeEvent } from "react"
import { saveRetreatSchedule } from "@/app/actions/schedule"
import type { MissionCard, MissionSection, ShiningName } from "@/lib/mission-types"
import type { ScheduleDay } from "@/lib/schedule"

type DraftRow = { key: string; time: string; activity: string }
type DraftDay = { name: ScheduleDay["name"]; rows: DraftRow[] }

const sections: { key: MissionSection; title: string; blurb: string }[] = [
  {
    key: "before",
    title: "Before the trip",
    blurb: "Everyone does these before leaving. A photo finishes the passport, the song, and the scroll. Mark the verse when you have it memorized.",
  },
  {
    key: "mystery",
    title: "Mystery missions",
    blurb: "Three were drawn for you. They unlock Thursday, Oct 29 at 11:59 PM Pacific.",
  },
  {
    key: "all",
    title: "The Shining Ones",
    blurb:
      "Three readers are chosen in secret. It unlocks Thursday, Oct 29 at 11:59 PM Pacific. You will name them together in person. If every Shining One is named, each reader gets 250. A Shining One nobody names gets 300.",
  },
]

export function RetreatSchedule({
  cards,
  roster,
  admin,
  days,
  shiningScore,
  done,
  photos,
  pendingId,
  onUpload,
  onMemorize,
}: {
  cards: MissionCard[]
  roster: ShiningName[]
  admin: boolean
  days: ScheduleDay[]
  shiningScore: number
  done: ReadonlySet<string>
  photos: Record<string, string | null>
  pendingId: string | null
  onUpload: (id: string, photo: Blob) => void
  onMemorize: (id: string) => void
}) {
  const earned = cards.reduce((sum, card) => {
    if (card.id === "shining") return sum + shiningScore
    return sum + (done.has(card.id) ? card.points : 0)
  }, 0)
  const possible = cards.reduce((sum, card) => {
    if (card.id === "shining") return sum + Math.max(card.points, shiningScore)
    return sum + card.points
  }, 0)
  return (
    <div className="bg-[#ead9b8] px-4 pt-5 pb-10 text-[#241c14]">
      <h1 className="font-heading text-3xl leading-none">Schedule</h1>
      <p className="mt-1.5 text-sm text-[#6b5340]">The retreat.</p>
      <section className="mt-5 rounded-md border border-[#241c14]/15 bg-[#f6edd8] px-4 pt-4 pb-2 shadow-[0_1px_0_rgba(36,28,20,0.06)]">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-heading text-2xl leading-none">Missions</h2>
          <p className="font-heading shrink-0 text-lg text-[#8a6232]">
            {earned} of {possible}
          </p>
        </div>
        <p className="mt-1.5 text-sm text-[#6b5340]">
          The points on each mission go on the leaderboard once. The picture stays on your card.
          {admin ? " You can open every mission now. Everyone else waits for the unlock." : ""}
        </p>
        {sections.map((section) => {
          const rows = cards.filter((card) => card.section === section.key)
          if (rows.length === 0) return null
          return (
            <div key={section.key} className="mt-5">
              <h3 className="font-heading text-xl leading-none">{section.title}</h3>
              <p className="mt-1 text-sm text-[#6b5340]">{section.blurb}</p>
              {section.key === "all" && roster.length > 0 ? (
                <p className="mt-2 text-sm leading-snug">
                  <span className="font-medium">Shining Ones: </span>
                  {roster.map((person) => person.pseudonym).join(", ")}
                </p>
              ) : null}
              {section.key === "all" && admin && roster.length === 0 ? (
                <p className="mt-2 text-sm leading-snug">
                  The names are chosen when this unlocks, from the readers signed up then.
                </p>
              ) : null}
              <ul className="mt-1">
                {rows.map((card) => (
                  <MissionRow
                    key={card.id}
                    mission={card}
                    finished={done.has(card.id)}
                    photo={photos[card.id] ?? null}
                    pending={pendingId === card.id}
                    busy={pendingId !== null}
                    onUpload={onUpload}
                    onMemorize={onMemorize}
                  />
                ))}
              </ul>
            </div>
          )
        })}
      </section>
      <Timetable initialDays={days} admin={admin} />
    </div>
  )
}

function Timetable({ initialDays, admin }: { initialDays: ScheduleDay[]; admin: boolean }) {
  const [propDays, setPropDays] = useState(initialDays)
  const [days, setDays] = useState(initialDays)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<DraftDay[]>([])
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)
  const [pending, startTransition] = useTransition()
  const keyRef = useRef(0)
  const router = useRouter()

  if (initialDays !== propDays) {
    setPropDays(initialDays)
    if (!editing) setDays(initialDays)
  }

  function nextKey() {
    keyRef.current += 1
    return `line-${keyRef.current}`
  }

  function startEdit() {
    setDraft(
      days.map((day) => ({
        name: day.name,
        rows: day.rows.map((row) => ({ key: nextKey(), time: row.time, activity: row.activity })),
      })),
    )
    setError("")
    setSaved(false)
    setEditing(true)
  }

  function updateRow(dayName: ScheduleDay["name"], key: string, field: "time" | "activity", value: string) {
    setDraft((current) =>
      current.map((day) =>
        day.name === dayName
          ? { ...day, rows: day.rows.map((row) => (row.key === key ? { ...row, [field]: value } : row)) }
          : day,
      ),
    )
  }

  function addRow(dayName: ScheduleDay["name"]) {
    setDraft((current) =>
      current.map((day) =>
        day.name === dayName ? { ...day, rows: [...day.rows, { key: nextKey(), time: "", activity: "" }] } : day,
      ),
    )
  }

  function removeRow(dayName: ScheduleDay["name"], key: string) {
    setDraft((current) =>
      current.map((day) =>
        day.name === dayName ? { ...day, rows: day.rows.filter((row) => row.key !== key) } : day,
      ),
    )
  }

  function save() {
    setError("")
    const payload = draft.map((day) => ({
      name: day.name,
      rows: day.rows.map((row) => ({ time: row.time, activity: row.activity })),
    }))
    startTransition(async () => {
      const result = await saveRetreatSchedule(payload)
      if (result.error || !result.days) {
        setError(result.error ?? "The schedule could not be saved.")
        return
      }
      setDays(result.days)
      setEditing(false)
      setSaved(true)
      router.refresh()
    })
  }

  if (editing) {
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-2xl leading-none">Timetable</h2>
          <button
            type="button"
            className="text-sm font-medium text-[#8a6232]"
            disabled={pending}
            onClick={() => {
              setEditing(false)
              setError("")
            }}
          >
            Cancel
          </button>
        </div>
        <p className="mt-1.5 text-sm text-[#6b5340]">Everyone signed in sees this timetable.</p>
        {draft.map((day) => (
          <section key={day.name} className="mt-5">
            <h3 className="font-heading text-xl leading-none">{day.name}</h3>
            <ul className="mt-2">
              {day.rows.map((row) => (
                <li key={row.key} className="flex flex-col gap-2 border-b border-[#241c14]/10 py-3 sm:flex-row sm:items-center">
                  <input
                    aria-label={`${day.name} time`}
                    value={row.time}
                    onChange={(event) => updateRow(day.name, row.key, "time", event.target.value)}
                    className="h-11 w-full rounded-md border border-[#241c14]/20 bg-[#f6edd8] px-3 text-sm text-[#241c14] outline-none sm:w-32"
                  />
                  <input
                    aria-label={`${day.name} activity`}
                    value={row.activity}
                    onChange={(event) => updateRow(day.name, row.key, "activity", event.target.value)}
                    className="h-11 min-w-0 flex-1 rounded-md border border-[#241c14]/20 bg-[#f6edd8] px-3 text-sm text-[#241c14] outline-none"
                  />
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center text-sm font-medium text-[#7d2e28] sm:px-1"
                    onClick={() => removeRow(day.name, row.key)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-[#8a6232]"
              onClick={() => addRow(day.name)}
            >
              Add a line
            </button>
          </section>
        ))}
        {error ? (
          <p role="alert" className="mt-3 text-sm text-[#7d2e28]">
            {error}
          </p>
        ) : null}
        <button
          type="button"
          className="mt-3 inline-flex h-11 items-center rounded-md bg-[#8a6232] px-4 text-sm font-medium text-[#f6edd8] disabled:opacity-50"
          disabled={pending}
          onClick={save}
        >
          {pending ? "Saving…" : "Save schedule"}
        </button>
      </div>
    )
  }

  return (
    <div className="mt-6">
      {admin ? (
        <div className="mb-1 flex items-center justify-between gap-3">
          <button type="button" className="inline-flex min-h-11 items-center text-sm font-medium text-[#8a6232]" onClick={startEdit}>
            Edit schedule
          </button>
          {saved ? <p className="text-sm text-[#6b5340]">Saved.</p> : null}
        </div>
      ) : null}
      {days.map((day) => (
        <section key={day.name} className="mt-5 first:mt-0">
          <h2 className="font-heading text-2xl leading-none">{day.name}</h2>
          {day.rows.length === 0 ? (
            <p className="mt-3 text-sm text-[#6b5340]">Nothing listed for this day.</p>
          ) : (
            <table className="mt-3 w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#241c14]/25 text-xs tracking-wide text-[#6b5340] uppercase">
                  <th scope="col" className="py-2 pr-4 font-medium whitespace-nowrap">
                    Time
                  </th>
                  <th scope="col" className="py-2 font-medium">
                    Activity
                  </th>
                </tr>
              </thead>
              <tbody>
                {day.rows.map((row, index) => (
                  <tr key={`${day.name}-${index}`} className="border-b border-[#241c14]/10 align-top">
                    <th scope="row" className="py-2.5 pr-4 font-medium whitespace-nowrap text-[#8a6232]">
                      {row.time}
                    </th>
                    <td className="py-2.5 leading-snug">{row.activity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      ))}
    </div>
  )
}

function MissionRow({
  mission,
  finished,
  photo,
  pending,
  busy,
  onUpload,
  onMemorize,
}: {
  mission: MissionCard
  finished: boolean
  photo: string | null
  pending: boolean
  busy: boolean
  onUpload: (id: string, photo: Blob) => void
  onMemorize: (id: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState("")
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const shown = photo && failedSrc !== photo ? photo : null
  const addLabel = mission.shot === "selfie" ? "Add a selfie" : "Add a photo"
  const changeLabel = mission.shot === "selfie" ? "Change selfie" : "Change photo"

  function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file || mission.locked || busy) return
    setError("")
    void fitJpeg(file)
      .then((blob) => onUpload(mission.id, blob))
      .catch((caught: unknown) => {
        const reason = caught instanceof Error ? caught.message : ""
        setError(reason === "large" ? "Use a picture under 8 MB." : "That picture could not be read.")
      })
  }

  return (
    <li className="border-b border-[#241c14]/10 py-3 last:border-b-0">
      <div className="flex items-start gap-3">
        <span className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-md border border-[#241c14]/20 bg-[#ead9b8] text-[#8a6232]">
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="" className="size-full object-cover" onError={() => setFailedSrc(shown)} />
          ) : mission.shot === "memory" || mission.shot === "check" ? (
            <BookOpen className="size-6" aria-hidden="true" />
          ) : (
            <Camera className="size-6" aria-hidden="true" />
          )}
          {finished ? (
            <span className="absolute right-1 bottom-1 grid size-5 place-items-center rounded-sm bg-[#8a6232] text-[#f6edd8]">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
          ) : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-3">
            <span className="block leading-snug font-medium">{mission.title}</span>
            <span className="shrink-0 text-sm text-[#8a6232]">{mission.points}</span>
          </span>
          {mission.story ? (
            <span className="mt-1 block text-sm leading-snug text-[#6b5340] italic">{mission.story}</span>
          ) : null}
          <span className="mt-0.5 block text-sm leading-snug text-[#6b5340]">{mission.detail}</span>
          {mission.secret ? (
            <span className="mt-2 block text-sm leading-snug font-medium text-[#241c14]">{mission.secret}</span>
          ) : null}
          {mission.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mission.image}
              alt="The picture to recreate"
              className="mt-2 max-h-64 w-full rounded-md border border-[#241c14]/15 bg-[#ead9b8] object-contain"
            />
          ) : null}
          {mission.locked ? null : mission.shot === "memory" ? (
            finished ? null : (
              <button
                type="button"
                data-memorize={mission.id}
                className="mt-1 inline-flex min-h-10 items-center text-sm font-medium text-[#8a6232] disabled:opacity-50"
                disabled={busy}
                onClick={() => onMemorize(mission.id)}
              >
                {pending ? "Saving…" : "I’ve memorized this"}
              </button>
            )
          ) : mission.shot === "check" ? (
            <label className="mt-2 flex min-h-10 items-center gap-2 text-sm font-medium text-[#8a6232]">
              <input
                type="checkbox"
                data-check={mission.id}
                className="size-5 accent-[#8a6232]"
                checked={finished}
                disabled={finished || busy}
                onChange={() => {
                  if (!finished) onMemorize(mission.id)
                }}
              />
              {pending ? "Saving…" : "Done"}
            </label>
          ) : (
            <>
              <input
                ref={inputRef}
                data-mission={mission.id}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onFile}
              />
              <button
                type="button"
                className="mt-1 inline-flex min-h-10 items-center text-sm font-medium text-[#8a6232] disabled:opacity-50"
                disabled={busy}
                onClick={() => inputRef.current?.click()}
              >
                {pending ? "Saving…" : shown ? changeLabel : addLabel}
              </button>
            </>
          )}
          {error ? (
            <span role="alert" className="block text-sm text-[#7d2e28]">
              {error}
            </span>
          ) : null}
        </span>
      </div>
    </li>
  )
}

async function fitJpeg(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("read")
  if (file.size > 8_000_000) throw new Error("large")
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error("read")
  }
  const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  const context = canvas.getContext("2d")
  if (!context) {
    bitmap.close()
    throw new Error("read")
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8))
  if (!blob) throw new Error("read")
  if (blob.size <= 1_200_000) return blob
  const smaller = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.55))
  if (!smaller || smaller.size > 1_200_000) throw new Error("large")
  return smaller
}
