import { useMemo, useState } from 'react'

type Task = {
  id: string
  title: string
  subject: string
  minutes: number
  dueDay: number
}

type Block = {
  day: string
  start: string
  task: string
  minutes: number
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

/** Greedy weekly plan: sort by due day, pack 90-min study sessions per weekday afternoon. */
function buildPlan(tasks: Task[]): Block[] {
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

function aiCoachTip(tasks: Task[]): string {
  const total = tasks.reduce((s, t) => s + t.minutes, 0)
  if (total === 0) return 'Add tasks to get scheduling tips.'
  if (total > 900)
    return 'Heavy week: prioritize deadlines, use 50/10 breaks, and sleep ≥7h — consistency beats cramming.'
  if (tasks.some((t) => t.minutes > 180))
    return 'Large tasks detected: split into 45–60m blocks with a clear “definition of done” each session.'
  return 'Balanced load: alternate subjects, review yesterday’s notes for 10m before new material.'
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: uid(), title: 'Read ch.4 + notes', subject: 'AP CS', minutes: 120, dueDay: 2 },
    { id: uid(), title: 'Practice FRQs', subject: 'AP Calc', minutes: 90, dueDay: 4 },
  ])
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('General')
  const [minutes, setMinutes] = useState(60)
  const [dueDay, setDueDay] = useState(3)

  const plan = useMemo(() => buildPlan(tasks), [tasks])
  const tip = useMemo(() => aiCoachTip(tasks), [tasks])

  function addTask() {
    if (!title.trim()) return
    setTasks((t) => [...t, { id: uid(), title: title.trim(), subject, minutes, dueDay }])
    setTitle('')
  }

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '1.5rem' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>AI Study Planner</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.35rem' }}>
          Rule-based weekly blocks + study coach tips (no API keys). Optional: extend with your own LLM
          endpoint later.
        </p>
      </header>

      <section
        style={{
          background: '#111827',
          borderRadius: 12,
          padding: '1rem 1.25rem',
          marginBottom: '1rem',
          border: '1px solid #1f2937',
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Coach note</h2>
        <p style={{ margin: 0, color: '#cbd5e1' }}>{tip}</p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flexWrap: 'wrap' }}>
        <section
          style={{
            background: '#111827',
            borderRadius: 12,
            padding: '1rem 1.25rem',
            border: '1px solid #1f2937',
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Add task</h2>
          <label style={{ display: 'block', marginBottom: 8 }}>
            <span style={{ display: 'block', fontSize: 12, color: '#94a3b8' }}>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0' }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: 8 }}>
            <span style={{ display: 'block', fontSize: 12, color: '#94a3b8' }}>Subject</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0' }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: 8 }}>
            <span style={{ display: 'block', fontSize: 12, color: '#94a3b8' }}>Minutes</span>
            <input
              type="number"
              min={15}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0' }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: 12 }}>
            <span style={{ display: 'block', fontSize: 12, color: '#94a3b8' }}>Due (0=Mon … 6=Sun)</span>
            <input
              type="number"
              min={0}
              max={6}
              value={dueDay}
              onChange={(e) => setDueDay(Number(e.target.value))}
              style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0' }}
            />
          </label>
          <button
            type="button"
            onClick={addTask}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Add task
          </button>
          <ul style={{ paddingLeft: '1.1rem', color: '#cbd5e1' }}>
            {tasks.map((t) => (
              <li key={t.id}>
                <strong>{t.subject}</strong>: {t.title} — {t.minutes}m (due {DAYS[t.dueDay]}){' '}
                <button
                  type="button"
                  onClick={() => setTasks((x) => x.filter((y) => y.id !== t.id))}
                  style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}
                >
                  remove
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section
          style={{
            background: '#111827',
            borderRadius: 12,
            padding: '1rem 1.25rem',
            border: '1px solid #1f2937',
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Draft week (weekdays PM)</h2>
          {plan.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No blocks yet.</p>
          ) : (
            <ol style={{ color: '#cbd5e1', paddingLeft: '1.1rem' }}>
              {plan.map((b, i) => (
                <li key={i}>
                  <strong>{b.day}</strong> {b.start} — {b.minutes}m · {b.task}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  )
}
