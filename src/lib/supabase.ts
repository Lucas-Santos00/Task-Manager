import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export interface Sprint {
  id: string
  name: string
  start_date: string
  end_date: string
  goal: string | null
  is_active: boolean
  created_at: string
}

export interface Task {
  id: string
  sprint_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  assignee: string | null
  story_points: number | null
  created_at: string
  updated_at: string
}
