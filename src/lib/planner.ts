/** Pure scheduling + tips — safe to reuse from a future Expo / React Native app. */

export type Task = {
  id: string
  title: string
  subject: string
  minutes: number
  dueDay: number
}

export type Block = {
  day: string
  start: string
  task: string
  minutes: number
}

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function uid() {
  return Math.random().toString(36).slice(2, 10)
}

export function buildPlan(tasks: Task[]): Block[] {
  const sorted = [...tasks].sort((a, b) => a.dueDay - b.dueDay || b.minutes - a.minutes)
  const blocks: Block[] = []
  let dayIdx = 0
  let slot = 16
  for (const t of sorted) {
    let remaining = t.minutes
    while (remaining > 0 && dayIdx < 5) {
      const chunk = Math.min(90, remaining)
      const h = Math.floor(slot)
      const m = (slot % 1) * 60
      blocks.push({
        day: DAYS[dayIdx],
        start: `${h.toString().padStart(2, '0')}:${m === 0 ? '00' : '30'}`,
        task: `${t.subject}: ${t.title}`,
        minutes: chunk,
      })
      remaining -= chunk
      slot += chunk / 60
      if (slot >= 21) {
        slot = 16
        dayIdx += 1
      }
    }
  }
  return blocks
}

export function aiCoachTip(tasks: Task[]): string {
  const total = tasks.reduce((s, t) => s + t.minutes, 0)
  if (total === 0) return 'Add tasks to get scheduling tips.'
  if (total > 900)
    return 'Heavy week: prioritize deadlines, use 50/10 breaks, and sleep ≥7h — consistency beats cramming.'
  if (tasks.some((t) => t.minutes > 180))
    return 'Large tasks detected: split into 45–60m blocks with a clear “definition of done” each session.'
  return 'Balanced load: alternate subjects, review yesterday’s notes for 10m before new material.'
}
