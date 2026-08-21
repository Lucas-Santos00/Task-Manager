'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, type Sprint, type Task, type TaskStatus, type Priority } from '@/lib/supabase'
import KanbanBoard from '@/components/KanbanBoard'
import SprintHeader from '@/components/SprintHeader'
import SprintModal from '@/components/SprintModal'
import TaskModal from '@/components/TaskModal'
import EmptyState from '@/components/EmptyState'

export default function Home() {
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showSprintModal, setShowSprintModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('backlog')

  const fetchSprints = useCallback(async () => {
    const { data } = await supabase
      .from('sprints')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) {
      setSprints(data)
      const active = data.find(s => s.is_active) ?? data[0] ?? null
      setActiveSprint(active)
    }
  }, [])

  const fetchTasks = useCallback(async (sprintId: string) => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('sprint_id', sprintId)
      .order('created_at', { ascending: true })
    if (data) setTasks(data)
  }, [])

  useEffect(() => {
    fetchSprints().finally(() => setLoading(false))
  }, [fetchSprints])

  useEffect(() => {
    if (!activeSprint) return
    fetchTasks(activeSprint.id)

    const channel = supabase
      .channel(`tasks-${activeSprint.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `sprint_id=eq.${activeSprint.id}`,
      }, () => fetchTasks(activeSprint.id))
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [activeSprint, fetchTasks])

  const handleMoveTask = async (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
    await supabase.from('tasks').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', taskId)
  }

  const handleDeleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
    await supabase.from('tasks').delete().eq('id', taskId)
  }

  const handleOpenNewTask = (status: TaskStatus) => {
    setEditingTask(null)
    setDefaultStatus(status)
    setShowTaskModal(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowTaskModal(true)
  }

  const handleSaveTask = async (data: Partial<Task>) => {
    if (!activeSprint) return
    if (editingTask) {
      const updated = { ...data, updated_at: new Date().toISOString() }
      await supabase.from('tasks').update(updated).eq('id', editingTask.id)
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...updated } : t))
    } else {
      const newTask = {
        sprint_id: activeSprint.id,
        title: data.title ?? '',
        description: data.description ?? null,
        status: data.status ?? 'backlog',
        priority: data.priority ?? 'medium',
        assignee: data.assignee ?? null,
        story_points: data.story_points ?? null,
      }
      const { data: created } = await supabase.from('tasks').insert(newTask).select().single()
      if (created) setTasks(prev => [...prev, created])
    }
    setShowTaskModal(false)
  }

  const handleSaveSprint = async (data: Partial<Sprint>) => {
    if (data.is_active) {
      await supabase.from('sprints').update({ is_active: false }).neq('id', 'none')
    }
    const { data: created } = await supabase.from('sprints').insert(data).select().single()
    if (created) {
      setSprints(prev => [created, ...prev])
      setActiveSprint(created)
    }
    setShowSprintModal(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 12 }}>
        <div className="spinner" />
        <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Carregando...</span>
        <style>{`.spinner{width:18px;height:18px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SprintHeader
        activeSprint={activeSprint}
        sprints={sprints}
        tasks={tasks}
        onSelectSprint={s => { setActiveSprint(s); fetchTasks(s.id) }}
        onNewSprint={() => setShowSprintModal(true)}
      />

      {!activeSprint ? (
        <EmptyState onNewSprint={() => setShowSprintModal(true)} />
      ) : (
        <KanbanBoard
          tasks={tasks}
          onMoveTask={handleMoveTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          onNewTask={handleOpenNewTask}
        />
      )}

      {showSprintModal && (
        <SprintModal onSave={handleSaveSprint} onClose={() => setShowSprintModal(false)} />
      )}

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          defaultStatus={defaultStatus}
          onSave={handleSaveTask}
          onClose={() => setShowTaskModal(false)}
        />
      )}
    </div>
  )
}
