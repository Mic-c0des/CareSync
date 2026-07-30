export interface Workplace {
  id: string
  user_id: string
  name: string
  notes: string | null
  created_at: string
}

export interface HourEntry {
  id: string
  user_id: string
  workplace_id: string
  entry_date: string
  duration_hours: number
  notes: string | null
  created_at: string
}

export interface Goal {
  user_id: string
  target_hours: number
  updated_at: string
}
