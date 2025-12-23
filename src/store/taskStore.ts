import { signal, computed } from '@preact/signals';
import dayjs from 'dayjs';
import type { Task, Priority, Status } from '../types';
import { deleteTaskById, getAllTasks, replaceTasks, upsertTask } from '../utils/storageUtils';

export const tasks = signal<Task[]>([]);
export const taskById = (id: string) => computed(() => tasks.value.find((t) => t.id === id));

const palette = ['#3B82F6', '#6366F1', '#22C55E', '#F97316', '#EC4899', '#14B8A6'];

function buildSampleTasks(): Task[] {
  const base = dayjs().startOf('week');
  return [
    {
      id: crypto.randomUUID(),
      title: 'Design layout',
      description: 'Create the first-pass layout for the weekly timeline',
      startDate: base.add(2, 'day').toDate(),
      endDate: base.add(4, 'day').toDate(),
      priority: 'high',
      status: 'in-progress',
      category: 'design',
      color: palette[1],
      dependencies: [],
      createdAt: dayjs().toDate(),
      updatedAt: dayjs().toDate()
    },
    {
      id: crypto.randomUUID(),
      title: 'Connect IndexedDB',
      description: 'Wire up persistence helpers to hydrate tasks',
      startDate: base.add(1, 'day').toDate(),
      endDate: base.add(1, 'day').toDate(),
      priority: 'medium',
      status: 'todo',
      category: 'dev',
      color: palette[0],
      dependencies: [],
      createdAt: dayjs().toDate(),
      updatedAt: dayjs().toDate()
    },
    {
      id: crypto.randomUUID(),
      title: 'Polish timeline',
      description: 'Improve responsiveness and spacing for bars',
      startDate: base.add(4, 'day').toDate(),
      endDate: base.add(6, 'day').toDate(),
      priority: 'medium',
      status: 'backlog',
      category: 'ui',
      color: palette[2],
      dependencies: [],
      createdAt: dayjs().toDate(),
      updatedAt: dayjs().toDate()
    }
  ];
}

export async function hydrateTasks(): Promise<void> {
  const rows = await getAllTasks();
  if (rows.length === 0) {
    const sample = buildSampleTasks();
    await replaceTasks(sample);
    tasks.value = sample;
    return;
  }
  tasks.value = rows;
}

export async function seedSampleTasks(): Promise<void> {
  const sample = buildSampleTasks();
  await replaceTasks(sample);
  tasks.value = sample;
}

export async function saveTask(partial: {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  priority?: Priority;
  status?: Status;
  category?: string;
  color?: string;
}): Promise<void> {
  const now = dayjs();
  const task: Task = {
    id: crypto.randomUUID(),
    title: partial.title,
    description: partial.description ?? '',
    startDate: partial.startDate,
    endDate: partial.endDate,
    priority: partial.priority ?? 'medium',
    status: partial.status ?? 'todo',
    category: partial.category ?? 'general',
    color: partial.color ?? palette[0],
    dependencies: [],
    createdAt: now.toDate(),
    updatedAt: now.toDate()
  };

  await upsertTask(task);
  await hydrateTasks();
}

export async function removeTask(id: string): Promise<void> {
  await deleteTaskById(id);
  await hydrateTasks();
}

export async function moveTaskDates(id: string, startDate: Date, endDate: Date): Promise<void> {
  await import('../utils/storageUtils').then(({ updateTaskDates }) => updateTaskDates(id, startDate, endDate));
  await hydrateTasks();
}
