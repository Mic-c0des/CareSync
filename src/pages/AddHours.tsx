import { useEffect, useState, FormEvent } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import type { Workplace, HourEntry } from '../types'

export function AddHours() {
  const { session } = useAuth()
  const [workplaces, setWorkplaces] = useState<Workplace[]>([])
  const [entries, setEntries] = useState<(HourEntry & { workplaces: { name: string } | null })[]>([])
  const [workplaceId, setWorkplaceId] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')

  async function load() {
    const [{ data: wp }, { data: en }] = await Promise.all([
      supabase.from('workplaces').select('*').order('name'),
      supabase
        .from('hour_entries')
        .select('*, workplaces(name)')
        .order('entry_date', { ascending: false })
    ])
    setWorkplaces(wp ?? [])
    setEntries((en as any) ?? [])
    if (wp && wp.length && !workplaceId) setWorkplaceId(wp[0].id)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    const hrs = parseFloat(duration)
    if (!workplaceId || !hrs || hrs <= 0 || !session) return

    await supabase.from('hour_entries').insert({
      workplace_id: workplaceId,
      entry_date: date,
      duration_hours: hrs,
      notes: notes.trim() || null,
      user_id: session.user.id
    })
    setDuration('')
    setNotes('')
    load()
  }

  async function handleDelete(id: string) {
    await supabase.from('hour_entries').delete().eq('id', id)
    load()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-forest">Log Hours</h1>
      <p className="mt-1 text-sm text-ink/60">Add a shift or session at one of your workplaces.</p>

      {workplaces.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-ink/10 bg-white p-4 text-sm text-ink/60">
          Add a workplace first on the Workplaces tab, then come back here to log hours.
        </p>
      ) : (
        <form onSubmit={handleAdd} className="mt-6 space-y-3 rounded-2xl border border-ink/10 bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-ink/80">Workplace</label>
              <select
                value={workplaceId}
                onChange={(e) => setWorkplaceId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-ink/15 px-3 py-2 outline-none focus:border-forest"
              >
                {workplaces.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-ink/80">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-ink/15 px-3 py-2 outline-none focus:border-forest"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-ink/80">Duration (hours)</label>
            <input
              type="number"
              step="0.25"
              min="0.25"
              placeholder="e.g. 6.5"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/15 px-3 py-2 outline-none focus:border-forest"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/80">Notes (optional)</label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/15 px-3 py-2 outline-none focus:border-forest"
            />
          </div>
          <button type="submit" className="w-full rounded-xl bg-forest py-2 font-medium text-sand hover:bg-forest/90">
            Log hours
          </button>
        </form>
      )}

      <ul className="mt-6 space-y-2">
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-4">
            <div>
              <p className="font-medium text-ink">
                {entry.workplaces?.name ?? 'Unknown workplace'}: {entry.duration_hours} hrs
              </p>
              <p className="text-sm text-ink/50">
                {new Date(entry.entry_date + 'T00:00:00').toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
                {entry.notes ? ` · ${entry.notes}` : ''}
              </p>
            </div>
            <button onClick={() => handleDelete(entry.id)} className="text-sm text-clay hover:underline">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
