import { useEffect, useState, FormEvent } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import type { Workplace } from '../types'

export function Workplaces() {
  const { session } = useAuth()
  const [workplaces, setWorkplaces] = useState<Workplace[]>([])
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [manager, setManager] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editManager, setEditManager] = useState('')
  const [editPhoneNumber, setEditPhoneNumber] = useState('')

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('workplaces')
      .select('*')
      .order('created_at', { ascending: false })
    setWorkplaces(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !session) return
    await supabase.from('workplaces').insert({
      name: name.trim(),
      notes: notes.trim() || null,
      manager: manager.trim() || null,
      phone_number: phoneNumber.trim() || null,
      user_id: session.user.id
    })
    setName('')
    setNotes('')
    setManager('')
    setPhoneNumber('')
    load()
  }

  function startEdit(workplace: Workplace) {
    setEditingId(workplace.id)
    setEditName(workplace.name)
    setEditNotes(workplace.notes ?? '')
    setEditManager(workplace.manager ?? '')
    setEditPhoneNumber(workplace.phone_number ?? '')
  }

  async function handleSaveEdit(id: string, e: FormEvent) {
    e.preventDefault()
    if (!editName.trim() || !session) return

    await supabase
      .from('workplaces')
      .update({
        name: editName.trim(),
        notes: editNotes.trim() || null,
        manager: editManager.trim() || null,
        phone_number: editPhoneNumber.trim() || null
      })
      .eq('id', id)
      .eq('user_id', session.user.id)

    setEditingId(null)
    setEditName('')
    setEditNotes('')
    setEditManager('')
    setEditPhoneNumber('')
    load()
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName('')
    setEditNotes('')
    setEditManager('')
    setEditPhoneNumber('')
  }

  async function handleDelete(id: string) {
    await supabase.from('workplaces').delete().eq('id', id)
    load()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-forest">Workplaces</h1>
      <p className="mt-1 text-sm text-ink/60">The employers you've done PCE hours at.</p>

      <form onSubmit={handleAdd} className="mt-6 flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            placeholder="Employer name (e.g. Riverside Urgent Care)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-xl border border-ink/15 px-3 py-2 outline-none focus:border-forest"
          />
          <input
            placeholder="Manager"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            className="flex-1 rounded-xl border border-ink/15 px-3 py-2 outline-none focus:border-forest"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1 rounded-xl border border-ink/15 px-3 py-2 outline-none focus:border-forest"
          />
          <input
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="flex-1 rounded-xl border border-ink/15 px-3 py-2 outline-none focus:border-forest"
          />
        </div>
        <button type="submit" className="rounded-xl bg-forest px-4 py-2 font-medium text-sand hover:bg-forest/90 sm:self-start">
          Add
        </button>
      </form>

      <ul className="mt-6 space-y-2">
        {loading && <li className="text-sm text-ink/50">Loading…</li>}
        {!loading && workplaces.length === 0 && (
          <li className="text-sm text-ink/50">No workplaces yet - add your first one above.</li>
        )}
        {workplaces.map((w) => (
          <li key={w.id} className="rounded-2xl border border-ink/10 bg-white p-4">
            {editingId === w.id ? (
              <form onSubmit={(e) => handleSaveEdit(w.id, e)} className="flex flex-col gap-2">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="rounded-xl border border-ink/15 px-3 py-2 outline-none focus:border-forest"
                />
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={editManager}
                    onChange={(e) => setEditManager(e.target.value)}
                    className="flex-1 rounded-xl border border-ink/15 px-3 py-2 outline-none focus:border-forest"
                  />
                  <input
                    value={editPhoneNumber}
                    onChange={(e) => setEditPhoneNumber(e.target.value)}
                    className="flex-1 rounded-xl border border-ink/15 px-3 py-2 outline-none focus:border-forest"
                  />
                </div>
                <input
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="rounded-xl border border-ink/15 px-3 py-2 outline-none focus:border-forest"
                />
                <div className="flex gap-2">
                  <button type="submit" className="rounded-xl bg-forest px-3 py-2 text-sm font-medium text-sand hover:bg-forest/90">
                    Save
                  </button>
                  <button type="button" onClick={cancelEdit} className="rounded-xl border border-ink/15 px-3 py-2 text-sm text-ink/70 hover:bg-ink/5">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{w.name}</p>
                  {w.manager && <p className="text-sm text-ink/60">Manager: {w.manager}</p>}
                  {w.phone_number && <p className="text-sm text-ink/60">Phone: {w.phone_number}</p>}
                  {w.notes && <p className="text-sm text-ink/50">{w.notes}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label={`Edit ${w.name}`}
                    onClick={() => startEdit(w)}
                    className="text-sm text-forest hover:underline"
                  >
                    ✎
                  </button>
                  <button onClick={() => handleDelete(w.id)} className="text-sm text-clay hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
