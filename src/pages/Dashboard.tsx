import { useEffect, useState, FormEvent } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { CircularProgress } from '../components/CircularProgress'

export function Dashboard() {
  const { session } = useAuth()
  const [totalHours, setTotalHours] = useState(0)
  const [goal, setGoal] = useState(100)
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState('100')
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!session) return
    setLoading(true)

    const [{ data: entries }, { data: goalRow }] = await Promise.all([
      supabase.from('hour_entries').select('duration_hours'),
      supabase.from('goals').select('*').eq('user_id', session.user.id).maybeSingle()
    ])

    const sum = (entries ?? []).reduce((acc, e) => acc + Number(e.duration_hours), 0)
    setTotalHours(sum)

    if (goalRow) {
      setGoal(Number(goalRow.target_hours))
      setGoalInput(String(goalRow.target_hours))
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [session])

  async function handleSaveGoal(e: FormEvent) {
    e.preventDefault()
    const value = parseFloat(goalInput)
    if (!value || value <= 0 || !session) return

    await supabase.from('goals').upsert({
      user_id: session.user.id,
      target_hours: value,
      updated_at: new Date().toISOString()
    })
    setGoal(value)
    setEditingGoal(false)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-forest">Your progress</h1>
      <p className="mt-1 text-sm text-ink/60">Total PCE hours logged toward your goal.</p>

      <div className="mt-8 flex flex-col items-center rounded-3xl border border-ink/10 bg-white p-8">
        {loading ? (
          <p className="text-sm text-ink/50">Loading…</p>
        ) : (
          <CircularProgress current={totalHours} goal={goal} />
        )}

        {editingGoal ? (
          <form onSubmit={handleSaveGoal} className="mt-6 flex gap-2">
            <input
              type="number"
              min="1"
              step="1"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              className="w-28 rounded-xl border border-ink/15 px-3 py-2 text-center outline-none focus:border-forest"
            />
            <button type="submit" className="rounded-xl bg-forest px-4 py-2 font-medium text-sand hover:bg-forest/90">
              Save
            </button>
          </form>
        ) : (
          <button
            onClick={() => setEditingGoal(true)}
            className="mt-6 text-sm font-medium text-forest hover:underline"
          >
            Edit goal
          </button>
        )}
      </div>
    </div>
  )
}
