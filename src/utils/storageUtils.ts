import dayjs from 'dayjs';
import type { Task } from '../types';
import { runTx } from './dbUtils';

interface TaskRecord {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  priority: string;
  status: string;
  category?: string;
  color: string;
  dependencies: unknown[];
  createdAt: string;
  updatedAt: string;
}

function serializeTask(task: Task) {
  return {
    ...task,
    startDate: task.startDate.toISOString(),
    endDate: task.endDate.toISOString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

function deserializeTask(record: TaskRecord): Task {
  return {
    ...record,
    startDate: new Date(record.startDate),
    endDate: new Date(record.endDate),
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
  } as Task;
}

export async function getAllTasks(): Promise<Task[]> {
  const rows = await runTx<TaskRecord[]>('tasks', 'readonly', (store) => store.getAll());
  return rows.map(deserializeTask);
}

export async function upsertTask(task: Task): Promise<void> {
  const now = dayjs().toDate();
  const payload = serializeTask({ ...task, updatedAt: now });
  await runTx('tasks', 'readwrite', (store) => store.put(payload));
}

export async function updateTaskDates(id: string, startDate: Date, endDate: Date): Promise<void> {
  const all = await getAllTasks();
  const existing = all.find((t) => t.id === id);
  if (!existing) return;
  await upsertTask({ ...existing, startDate, endDate });
}

export async function seedTasks(tasks: Task[]): Promise<void> {
  await runTx('tasks', 'readwrite', (store) => {
    for (const t of tasks) {
      store.put(serializeTask(t));
    }
  });
}

export async function replaceTasks(tasks: Task[]): Promise<void> {
  await runTx('tasks', 'readwrite', (store) => {
    store.clear();
    for (const t of tasks) {
      store.put(serializeTask(t));
    }
    return true;
  });
}

export async function deleteTaskById(id: string): Promise<void> {
  await runTx('tasks', 'readwrite', (store) => store.delete(id));
}
