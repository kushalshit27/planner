/**
 * CRUD operations wrapper for IndexedDB
 * Provides high-level API for task and dependency management
 */

import type { Task } from '../types';
import { getDB, STORES } from './dbUtils';

/**
 * Serialize task for storage (convert Dates to ISO strings)
 */
function serializeTask(task: Task): unknown {
	return {
		...task,
		startDate: task.startDate.toISOString(),
		endDate: task.endDate.toISOString(),
		createdAt: task.createdAt.toISOString(),
		updatedAt: task.updatedAt.toISOString(),
	};
}

/**
 * Deserialize task from storage (convert ISO strings to Dates)
 */
function deserializeTask(data: Record<string, unknown>): Task {
	return {
		...data,
		startDate: new Date(data.startDate as string),
		endDate: new Date(data.endDate as string),
		createdAt: new Date(data.createdAt as string),
		updatedAt: new Date(data.updatedAt as string),
	} as Task;
}

/**
 * Create a new task in IndexedDB
 */
export async function createTask(task: Task): Promise<void> {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORES.TASKS], 'readwrite');
		const store = transaction.objectStore(STORES.TASKS);
		const request = store.add(serializeTask(task));

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

/**
 * Get a single task by ID
 */
async function _getTask(id: string): Promise<Task | undefined> {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORES.TASKS], 'readonly');
		const store = transaction.objectStore(STORES.TASKS);
		const request = store.get(id);

		request.onsuccess = () => {
			const result = request.result;
			resolve(result ? deserializeTask(result) : undefined);
		};
		request.onerror = () => reject(request.error);
	});
}

/**
 * Get all tasks from IndexedDB
 */
export async function getAllTasks(): Promise<Task[]> {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORES.TASKS], 'readonly');
		const store = transaction.objectStore(STORES.TASKS);
		const request = store.getAll();

		request.onsuccess = () => {
			const results = request.result || [];
			resolve(results.map(deserializeTask));
		};
		request.onerror = () => reject(request.error);
	});
}

/**
 * Update an existing task
 */
export async function updateTask(task: Task): Promise<void> {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORES.TASKS], 'readwrite');
		const store = transaction.objectStore(STORES.TASKS);
		const request = store.put(serializeTask(task));

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

/**
 * Delete a task by ID
 */
export async function deleteTask(id: string): Promise<void> {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORES.TASKS], 'readwrite');
		const store = transaction.objectStore(STORES.TASKS);
		const request = store.delete(id);

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

/**
 * Clear all tasks from IndexedDB
 */
export async function clearAllTasks(): Promise<void> {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORES.TASKS], 'readwrite');
		const store = transaction.objectStore(STORES.TASKS);
		const request = store.clear();

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

/**
 * Get tasks by date range
 */
async function _getTasksByDateRange(
	startDate: Date,
	endDate: Date
): Promise<Task[]> {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORES.TASKS], 'readonly');
		const store = transaction.objectStore(STORES.TASKS);
		const request = store.getAll();

		request.onsuccess = () => {
			const results = request.result || [];
			const tasks = results.map(deserializeTask);
			const filtered = tasks.filter(
				(task) => task.startDate <= endDate && task.endDate >= startDate
			);
			resolve(filtered);
		};
		request.onerror = () => reject(request.error);
	});
}

/**
 * Bulk create tasks
 */
export async function bulkCreateTasks(tasks: Task[]): Promise<void> {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORES.TASKS], 'readwrite');
		const store = transaction.objectStore(STORES.TASKS);

		transaction.oncomplete = () => resolve();
		transaction.onerror = () => reject(transaction.error);

		for (const task of tasks) {
			store.add(serializeTask(task));
		}
	});
}

/**
 * Save a setting to IndexedDB
 */
async function _saveSetting(key: string, value: unknown): Promise<void> {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORES.SETTINGS], 'readwrite');
		const store = transaction.objectStore(STORES.SETTINGS);
		const request = store.put({ key, value });

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

/**
 * Get a setting from IndexedDB
 */
async function _getSetting<T>(key: string): Promise<T | undefined> {
	const db = await getDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORES.SETTINGS], 'readonly');
		const store = transaction.objectStore(STORES.SETTINGS);
		const request = store.get(key);

		request.onsuccess = () => resolve(request.result?.value);
		request.onerror = () => reject(request.error);
	});
}
