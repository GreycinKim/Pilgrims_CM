import type { Metadata } from "next"
import Link from "next/link"
import { existsSync } from "node:fs"
import path from "node:path"
import { AdminRoster, type AdminReader } from "@/components/admin-roster"
import { requireAdmin } from "@/lib/dal"
import { listAccounts, listAllAwards, listAllQuizAnswers, mysteryDraw, shiningRoster } from "@/lib/db"
import { getStage } from "@/lib/journey"
import { getMission, missionsIn } from "@/lib/missions"
import { missedQuestions, quizScoreBreakdown } from "@/lib/quiz-report"

export const metadata: Metadata = {
  title: "Admin · Waymark",
  description: "Names, missed questions, finished missions, and retreat pictures.",
}

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  await requireAdmin()
  const accounts = listAccounts()
  const awards = listAllAwards()
  const answers = listAllQuizAnswers()
  const shiningIds = shiningRoster()
  const beforeIds = missionsIn("before").map((mission) => mission.id)
  const photos = new Map<string, AdminReader["photos"]>()

  function assignment(userId: string, missionId: string) {
    const mission = getMission(missionId)
    const award = awards.find(
      (item) => item.userId === userId && item.kind === "mission" && item.stageId === missionId,
    )
    const file = path.join(process.cwd(), "data", "missions", userId, `${missionId}.jpg`)
    const hasPhoto = existsSync(file)
    if (mission && hasPhoto && award) {
      const list = photos.get(userId) ?? []
      list.push({
        missionId: mission.id,
        title: mission.title,
        src: `/api/admin/photo/${userId}/${mission.id}?v=${encodeURIComponent(award.createdAt)}`,
      })
      photos.set(userId, list)
    }
    const shot = mission?.shot
    return {
      id: missionId,
      title: mission?.title ?? missionId,
      detail: mission?.detail ?? "",
      done: Boolean(award),
      hasPhoto,
      shot: shot === "memory" || shot === "check" || shot === "selfie" || shot === "photo" ? shot : "photo",
    }
  }

  const readers: AdminReader[] = accounts.map((account) => {
    const pretrip = beforeIds.map((id) => assignment(account.id, id))
    const mystery = mysteryDraw(account.id).map((id) => assignment(account.id, id))
    const shining = assignment(account.id, "shining")
    const isShining = shiningIds.includes(account.id)
    const quizzes = awards
      .filter((award) => award.userId === account.id && award.kind === "quiz")
      .flatMap((award) => {
        const stage = getStage(award.stageId)
        if (!stage) return []
        const pathAward = awards.find(
          (item) => item.userId === account.id && item.stageId === award.stageId && item.kind === "path",
        )
        const saved = answers.find((item) => item.userId === account.id && item.stageId === award.stageId)
        const breakdown = quizScoreBreakdown(award.points)
        const missed = saved ? missedQuestions(award.stageId, saved.quiz, saved.path) : null
        return [
          {
            title: stage.title,
            correct: breakdown?.correct ?? null,
            pathRight: pathAward ? pathAward.points > 0 : null,
            missed,
          },
        ]
      })
    return {
      ...account,
      pretrip,
      mystery,
      shining,
      isShining,
      quizzes,
      photos: photos.get(account.id) ?? [],
    }
  })
  const shiningNames = readers
    .filter((reader) => reader.isShining)
    .map((reader) => reader.pseudonym)

  return (
    <div className="min-h-dvh bg-[#ead9b8] text-[#241c14]">
      <header className="border-b border-[#241c14]/10 px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <h1 className="font-heading text-3xl leading-none">Admin</h1>
          <Link href="/journal" className="text-sm text-[#8a6232]">
            Journal
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6 pb-16">
        <p className="text-sm leading-relaxed text-[#6b5340]">
          Tap a profile for the real name, the three mystery missions, missed questions, and pictures.
        </p>
        <section className="mt-6 rounded-md border border-[#241c14]/15 bg-[#f6edd8] px-4 py-4" aria-label="Shining Ones">
          <h2 className="font-heading text-2xl leading-none">Shining Ones</h2>
          {shiningNames.length === 0 ? (
            <p className="mt-2 text-sm text-[#6b5340]">None assigned yet.</p>
          ) : (
            <p className="mt-2 text-sm leading-relaxed">{shiningNames.join(", ")}</p>
          )}
          <p className="mt-1 text-sm text-[#6b5340]">
            {shiningNames.length === 0
              ? "Three names are chosen Thursday, Oct 29 at 11:59 PM Pacific, from the readers signed up then. Their private note is to encourage people all weekend without being caught."
              : "Three readers. Their private note is to encourage people all weekend without being caught."}
          </p>
        </section>
        <a
          href="/api/admin/export"
          className="mt-4 inline-flex h-12 items-center rounded-md bg-[#8a6232] px-4 text-sm font-medium text-[#f6edd8]"
        >
          Download pictures for Google Drive
        </a>
        <p className="mt-2 text-xs leading-relaxed text-[#6b5340]">
          The folder is grouped by map name. Upload that zip to Google Drive, then open it there.
        </p>

        <AdminRoster readers={readers} />
      </main>
    </div>
  )
}
