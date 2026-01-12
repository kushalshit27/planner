/**
 * Import/Export utilities for tasks
 * Handles JSON serialization and file operations
 */

import type { Task } from '../types';

interface ExportData {
	version: string;
	exportedAt: string;
	tasks: Task[];
}

/**
 * Serialize tasks for export (convert Dates to ISO strings)
 */
function serializeTasksForExport(tasks: Task[]): unknown[] {
	return tasks.map((task) => ({
		...task,
		startDate: task.startDate.toISOString(),
		endDate: task.endDate.toISOString(),
		createdAt: task.createdAt.toISOString(),
		updatedAt: task.updatedAt.toISOString(),
	}));
}

/**
 * Deserialize tasks from import (convert ISO strings to Dates)
 */
function deserializeTasksFromImport(data: unknown[]): Task[] {
	return data.map((item) => {
		const task = item as Record<string, unknown>;
		return {
			...task,
			startDate: new Date(task.startDate as string),
			endDate: new Date(task.endDate as string),
			createdAt: new Date(task.createdAt as string),
			updatedAt: new Date(task.updatedAt as string),
		} as Task;
	});
}

/**
 * Export tasks to JSON file
 */
export function exportTasks(tasks: Task[]): void {
	const exportData: ExportData = {
		version: '1.0',
		exportedAt: new Date().toISOString(),
		tasks: serializeTasksForExport(tasks) as Task[],
	};

	const json = JSON.stringify(exportData, null, 2);
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = `planner-tasks-${new Date().toISOString().split('T')[0]}.json`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

/**
 * Import tasks from JSON file
 */
export function importTasks(
	file: File,
	callback: (tasks: Task[], error?: string) => void
): void {
	const reader = new FileReader();

	reader.onload = (e) => {
		try {
			const content = e.target?.result as string;
			console.log('Parsing import file:', file.name);

			const data = JSON.parse(content) as ExportData;

			// Validate data structure
			if (!data.version || !Array.isArray(data.tasks)) {
				console.error('Invalid file structure:', data);
				callback([], 'Invalid file format. Expected Planner export file.');
				return;
			}

			console.log(`Found ${data.tasks.length} tasks in import file`);

			// Deserialize tasks
			const tasks = deserializeTasksFromImport(data.tasks);

			// Basic validation
			for (const [index, task] of tasks.entries()) {
				if (!task.id || !task.title || !task.startDate || !task.endDate) {
					console.error(`Invalid task at index ${index}:`, task);
					callback([], `Invalid task data at position ${index + 1}.`);
					return;
				}

				// Validate dates are valid Date objects
				if (
					Number.isNaN(task.startDate.getTime()) ||
					Number.isNaN(task.endDate.getTime())
				) {
					console.error(`Invalid dates in task ${task.id}:`, task);
					callback([], `Invalid date format in task "${task.title}".`);
					return;
				}
			}

			console.log('Import file validation successful');
			callback(tasks);
		} catch (error) {
			console.error('Import parse error:', error);
			callback([], `Failed to parse file: ${(error as Error).message}`);
		}
	};

	reader.onerror = () => {
		callback([], 'Failed to read file.');
	};

	reader.readAsText(file);
}

/**
 * Validate imported tasks
 */
export function validateImportedTasks(tasks: Task[]): {
	valid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (!Array.isArray(tasks) || tasks.length === 0) {
		errors.push('No tasks found in import file.');
		return { valid: false, errors };
	}

	for (const [index, task] of tasks.entries()) {
		if (!task.id) errors.push(`Task ${index + 1}: Missing ID`);
		if (!task.title) errors.push(`Task ${index + 1}: Missing title`);
		if (!task.startDate || Number.isNaN(task.startDate.getTime())) {
			errors.push(`Task ${index + 1}: Invalid start date`);
		}
		if (!task.endDate || Number.isNaN(task.endDate.getTime())) {
			errors.push(`Task ${index + 1}: Invalid end date`);
		}
		if (task.startDate > task.endDate) {
			errors.push(`Task ${index + 1}: Start date is after end date`);
		}
	}

	return { valid: errors.length === 0, errors };
}
