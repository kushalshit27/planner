/**
 * Task store using Preact Signals
 * Manages task state and syncs with IndexedDB
 */

import { computed, signal } from '@preact/signals';
import type { Task } from '../types';
import {
	clearAllTasks as dbClearAllTasks,
	createTask as dbCreateTask,
	deleteTask as dbDeleteTask,
	updateTask as dbUpdateTask,
	getAllTasks,
} from '../utils/storageUtils';

// Signal for all tasks
export const tasks = signal<Task[]>([]);

// Signal for loading state
const isLoading = signal<boolean>(false);

// Computed signal for tasks sorted by start date
export const sortedTasks = computed(() => {
	return [...tasks.value].sort(
		(a, b) => a.startDate.getTime() - b.startDate.getTime()
	);
});

// Computed signal for tasks by status
const _tasksByStatus = computed(() => {
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
 * Clear all tasks
 */
export async function clearAllTasks(): Promise<void> {
	try {
		await dbClearAllTasks();
		tasks.value = [];
	} catch (error) {
		console.error('Failed to clear all tasks:', error);
		throw error;
	}
}

/**
 * Get a task by ID
 */
export function getTaskById(id: string): Task | undefined {
	return tasks.value.find((task) => task.id === id);
}

/**
 * Import tasks from array (replaces existing tasks)
 */
export async function importTasks(
	importedTasks: Task[],
	merge = false
): Promise<void> {
	console.log(
		`importTasks called: merge=${merge}, count=${importedTasks.length}`
	);

	try {
		if (!merge) {
			// Replace mode: clear existing tasks first
			console.log('Replace mode: clearing all tasks');
			await dbClearAllTasks();

			// Add all imported tasks
			for (const task of importedTasks) {
				// Ensure updatedAt is set to now for imported tasks
				const taskToImport = {
					...task,
					updatedAt: new Date(),
				};
				await dbCreateTask(taskToImport);
			}
			console.log(`Replace mode: imported ${importedTasks.length} tasks`);
		} else {
			// Merge mode: update existing tasks or create new ones
			const existingTasks = tasks.value;
			const existingTaskMap = new Map(existingTasks.map((t) => [t.id, t]));
			console.log(`Merge mode: ${existingTaskMap.size} existing tasks`);

			let updated = 0;
			let created = 0;

			for (const importedTask of importedTasks) {
				// Update the updatedAt timestamp
				const taskToImport = {
					...importedTask,
					updatedAt: new Date(),
				};

				if (existingTaskMap.has(importedTask.id)) {
					// Task exists, update it
					console.log(`Updating existing task: ${importedTask.id}`);
					await dbUpdateTask(taskToImport);
					updated++;
				} else {
					// New task, create it
					console.log(`Creating new task: ${importedTask.id}`);
					await dbCreateTask(taskToImport);
					created++;
				}
			}

			console.log(`Merge mode: updated ${updated}, created ${created} tasks`);
		}

		// Reload all tasks from DB to sync with UI
		console.log('Reloading tasks from DB');
		await loadTasks();
		console.log(`Import complete: ${tasks.value.length} total tasks in store`);
	} catch (error) {
		console.error('Failed to import tasks:', error);
		throw error;
	}
}
