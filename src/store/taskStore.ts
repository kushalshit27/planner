/**
 * Task store using Preact Signals
 * Manages task state and syncs with IndexedDB
 */

import { computed, signal } from '@preact/signals';
import type { Task } from '../types';
import {
	createTask as dbCreateTask,
	deleteTask as dbDeleteTask,
	updateTask as dbUpdateTask,
	getAllTasks,
} from '../utils/storageUtils';

// Signal for all tasks
export const tasks = signal<Task[]>([]);

// Signal for loading state
export const isLoading = signal<boolean>(false);

// Computed signal for tasks sorted by start date
export const sortedTasks = computed(() => {
	return [...tasks.value].sort(
		(a, b) => a.startDate.getTime() - b.startDate.getTime()
	);
});

// Computed signal for tasks by status
export const tasksByStatus = computed(() => {
	const grouped: Record<string, Task[]> = {
		Backlog: [],
		'To Do': [],
		'In Progress': [],
		Done: [],
	};

	for (const task of tasks.value) {
		grouped[task.status].push(task);
	}

	return grouped;
});

/**
 * Load all tasks from IndexedDB
 */
export async function loadTasks(): Promise<void> {
	isLoading.value = true;
	try {
		const allTasks = await getAllTasks();
		tasks.value = allTasks;
	} catch (error) {
		console.error('Failed to load tasks:', error);
	} finally {
		isLoading.value = false;
	}
}

/**
 * Create a new task
 */
export async function createTask(task: Task): Promise<void> {
	try {
		await dbCreateTask(task);
		tasks.value = [...tasks.value, task];
	} catch (error) {
		console.error('Failed to create task:', error);
		throw error;
	}
}

/**
 * Update an existing task
 */
export async function updateTask(updatedTask: Task): Promise<void> {
	try {
		await dbUpdateTask(updatedTask);
		tasks.value = tasks.value.map((task) =>
			task.id === updatedTask.id ? updatedTask : task
		);
	} catch (error) {
		console.error('Failed to update task:', error);
		throw error;
	}
}

/**
 * Delete a task
 */
export async function deleteTask(id: string): Promise<void> {
	try {
		await dbDeleteTask(id);
		tasks.value = tasks.value.filter((task) => task.id !== id);
	} catch (error) {
		console.error('Failed to delete task:', error);
		throw error;
	}
}

/**
 * Get a task by ID
 */
export function getTaskById(id: string): Task | undefined {
	return tasks.value.find((task) => task.id === id);
}
