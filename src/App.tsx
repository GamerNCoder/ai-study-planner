import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import { DAYS, aiCoachTip, buildPlan, type Task, uid } from './lib/planner'

const grid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
  gap: '1rem',
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
    <div style={{ width: '100%', maxWidth: 920, margin: '0 auto', padding: 'clamp(0.75rem, 3vw, 1.5rem)' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(1.35rem, 4vw, 1.75rem)' }}>AI Study Planner</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.35rem', lineHeight: 1.5 }}>
          Rule-based weekly blocks + study coach tips (no API keys). Responsive web; see <code>MOBILE.md</code> for Expo.
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

      <div style={grid}>
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
              style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: 16 }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: 8 }}>
            <span style={{ display: 'block', fontSize: 12, color: '#94a3b8' }}>Subject</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: 16 }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: 8 }}>
            <span style={{ display: 'block', fontSize: 12, color: '#94a3b8' }}>Minutes</span>
            <input
              type="number"
              min={15}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: 16 }}
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
              style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', fontSize: 16 }}
            />
          </label>
          <button
            type="button"
            onClick={addTask}
            style={{
              padding: '12px 18px',
              minHeight: 44,
              borderRadius: 8,
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 16,
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
                  style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', minHeight: 44, padding: '4px 8px' }}
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
