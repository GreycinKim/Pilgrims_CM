export type QuizMark = {
  prompt: string
  choices: [string, string, string]
  chosen: number
  answer: number
  hard: boolean
}
