"use server"

import { randomInt } from "node:crypto"
import { hash } from "bcryptjs"
import { getCurrentUser } from "@/lib/dal"
import { getUserById, setPasswordHash } from "@/lib/db"

const words = ["scroll", "lamp", "gate", "hill", "river", "star", "path", "crown", "key", "road"]

function temporaryPassword() {
  const pick = () => words[randomInt(words.length)] ?? "path"
  return `${pick()}-${pick()}-${randomInt(10, 100)}`
}

export async function resetReaderPassword(userId: string): Promise<{ password?: string; error?: string }> {
  const admin = await getCurrentUser()
  if (!admin?.admin) return { error: "Only an admin can set a password." }
  if (!getUserById(userId)) return { error: "That reader is not on the list." }
  const password = temporaryPassword()
  const passwordHash = await hash(password, 10)
  if (!setPasswordHash(userId, passwordHash)) return { error: "That password could not be set." }
  return { password }
}
