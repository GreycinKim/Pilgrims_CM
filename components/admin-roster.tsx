"use client"

import { useState, useTransition } from "react"
import { resetReaderPassword } from "@/app/actions/admin"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog"
import { pilgrimColor } from "@/lib/company"
import { portraitSrc } from "@/lib/portrait"
import { QUIZ_QUESTIONS } from "@/lib/score"

type MissionLine = {
  id: string
  title: string
  detail: string
  done: boolean
  hasPhoto: boolean
  shot: "photo" | "selfie" | "memory" | "check"
}

type Missed = { prompt: string; chosen: string; right: string }

export type AdminReader = {
  id: string
  pseudonym: string
  givenName: string | null
  email: string
  portraitAt: string | null
  pretrip: MissionLine[]
  mystery: MissionLine[]
  shining: MissionLine
  isShining: boolean
  photos: { missionId: string; title: string; src: string }[]
  quizzes: {
    title: string
    correct: number | null
    pathRight: boolean | null
    missed: Missed[] | null
  }[]
}

export function AdminRoster({ readers }: { readers: AdminReader[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [failed, setFailed] = useState<Record<string, boolean>>({})
  const reader = readers.find((item) => item.id === selectedId) ?? null

  return (
    <section className="mt-10" aria-label="Readers">
      <h2 className="font-heading text-2xl leading-none">Readers</h2>
      <p className="mt-2 text-sm text-[#6b5340]">Tap a profile to open their page.</p>
      {readers.length === 0 ? (
        <p className="mt-4 text-sm text-[#6b5340]">No one has signed up.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4">
          {readers.map((item) => {
            const src = failed[item.id] ? null : portraitSrc(item.id, item.portraitAt)
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className="flex w-full flex-col items-center gap-2 rounded-md px-1 py-1 text-center"
                  onClick={() => setSelectedId(item.id)}
                >
                  <Face name={item.pseudonym} src={src} color={pilgrimColor(item.id)} onError={() => setFailed((current) => ({ ...current, [item.id]: true }))} />
                  <span className="line-clamp-2 text-sm leading-tight font-medium">{item.pseudonym}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
      <Dialog open={reader !== null} onOpenChange={(open) => { if (!open) setSelectedId(null) }}>
        <DialogPortal>
          <DialogBackdrop />
          <DialogPopup className="bg-[#f6edd8]">
            {reader ? <ReaderPage reader={reader} /> : null}
          </DialogPopup>
        </DialogPortal>
      </Dialog>
    </section>
  )
}

function Face({
  name,
  src,
  color,
  onError,
}: {
  name: string
  src: string | null
  color: string
  onError: () => void
}) {
  return (
    <span aria-hidden="true" className="grid size-16 place-items-center overflow-hidden rounded-full border border-[#241c14]/15 text-lg font-medium text-[#f6edd8]" style={{ background: color }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" onError={onError} />
      ) : (
        name.slice(0, 1).toUpperCase()
      )}
    </span>
  )
}

function ReaderPage({ reader }: { reader: AdminReader }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <DialogTitle>{reader.pseudonym}</DialogTitle>
        <DialogClose className="shrink-0 text-sm text-[#8a6232]">Close</DialogClose>
      </div>
      <p className="mt-3 text-sm">Actual name: {reader.givenName ?? "Not entered"}</p>
      <p className="mt-1 text-sm text-[#6b5340]">{reader.email}</p>
      <PasswordReset userId={reader.id} email={reader.email} />
      <h3 className="mt-4 text-sm font-medium">Before the trip</h3>
      <MissionLines rows={reader.pretrip} />
      <h3 className="mt-4 text-sm font-medium">Mystery missions</h3>
      <MissionLines rows={reader.mystery} />
      <h3 className="mt-4 text-sm font-medium">The Shining Ones</h3>
      <p className="mt-1 text-sm leading-relaxed">
        {reader.isShining ? "This reader is a Shining One." : "Not a Shining One."}{" "}
        {reader.shining.done ? "Photo in." : "Photo not in."}
      </p>
      <h3 className="mt-4 text-sm font-medium">Questions missed</h3>
      {reader.quizzes.length === 0 ? (
        <p className="mt-1 text-sm text-[#6b5340]">No quiz yet.</p>
      ) : (
        <ul className="mt-2 space-y-3">
          {reader.quizzes.map((quiz) => (
            <li key={quiz.title}>
              <p className="text-sm font-medium">{quiz.title}</p>
              {quiz.missed ? (
                quiz.missed.length === 0 ? (
                  <p className="text-sm text-[#6b5340]">None missed.</p>
                ) : (
                  <ul className="mt-1 space-y-2">
                    {quiz.missed.map((miss) => (
                      <li key={miss.prompt} className="text-sm leading-snug">
                        <span className="block">{miss.prompt}</span>
                        <span className="block text-[#7d2e28]">Chose {miss.chosen}</span>
                        <span className="block text-[#6b5340]">Answer: {miss.right}</span>
                      </li>
                    ))}
                  </ul>
                )
              ) : (
                <p className="text-sm text-[#6b5340]">
                  {quiz.correct === null
                    ? "Score saved before the missed questions were kept."
                    : `${quiz.correct} of ${QUIZ_QUESTIONS} right. The missed questions were not kept.`}
                  {quiz.pathRight === false ? " The hard question was missed." : ""}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
      <h3 className="mt-4 text-sm font-medium">Pictures</h3>
      {reader.photos.length === 0 ? (
        <p className="mt-1 text-sm text-[#6b5340]">No pictures yet.</p>
      ) : (
        <ul className="mt-2 grid grid-cols-2 gap-3">
          {reader.photos.map((picture) => (
            <li key={picture.missionId} className="overflow-hidden rounded-md border border-[#241c14]/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={picture.src} alt="" className="aspect-square w-full object-cover" />
              <p className="px-2 py-1.5 text-sm text-[#6b5340]">{picture.title}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function PasswordReset({ userId, email }: { userId: string; email: string }) {
  const [pending, startTransition] = useTransition()
  const [password, setPassword] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  function reset() {
    setError("")
    setCopied(false)
    startTransition(async () => {
      const result = await resetReaderPassword(userId)
      if (result.error || !result.password) {
        setError(result.error ?? "That password could not be set.")
        return
      }
      setPassword(result.password)
    })
  }

  async function copy() {
    if (!password) return
    try {
      await navigator.clipboard.writeText(`${email}\n${password}`)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mt-4 rounded-md border border-[#241c14]/15 bg-[#ead9b8] px-3 py-3">
      <h3 className="text-sm font-medium">Password</h3>
      <p className="mt-1 text-sm leading-snug text-[#6b5340]">
        The old password cannot be looked up. Set a new one, then send the email and password privately. This password is shown only until you close the page.
      </p>
      {password ? (
        <>
          <p className="mt-2 text-sm">
            New password: <span className="font-medium tracking-wide">{password}</span>
          </p>
          <button type="button" className="mt-1 inline-flex min-h-10 items-center text-sm font-medium text-[#8a6232]" onClick={() => void copy()}>
            {copied ? "Copied" : "Copy email and password"}
          </button>
        </>
      ) : (
        <button
          type="button"
          className="mt-2 inline-flex min-h-10 items-center text-sm font-medium text-[#8a6232] disabled:opacity-50"
          disabled={pending}
          onClick={reset}
        >
          {pending ? "Setting…" : "Set a new password"}
        </button>
      )}
      {error ? (
        <p role="alert" className="text-sm text-[#7d2e28]">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function MissionLines({ rows }: { rows: MissionLine[] }) {
  return (
    <ul className="mt-1 space-y-2 text-sm leading-snug">
      {rows.map((mission) => (
        <li key={mission.id}>
          <span className="font-medium">{mission.title}</span>
          <span className="text-[#6b5340]">
            {" "}
            · {mission.shot === "memory"
              ? mission.done
                ? "memorized"
                : "not yet"
              : mission.shot === "check"
                ? mission.done
                  ? "done"
                  : "not yet"
                : mission.done
                  ? mission.hasPhoto
                    ? "done"
                    : "done, no picture"
                  : "not yet"}
          </span>
          <span className="block text-[#6b5340]">{mission.detail}</span>
        </li>
      ))}
    </ul>
  )
}
