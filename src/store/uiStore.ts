/**
 * UI store using Preact Signals
 * Manages UI state (view mode, selected task, etc.)
 */

import { signal } from '@preact/signals';
import dayjs from 'dayjs';
import type { ViewMode } from '../types';

// Current view mode
export const currentView = signal<ViewMode>('Weekly');

// Selected task ID
export const selectedTaskId = signal<string | null>(null);

// Task form state
export const isTaskFormOpen = signal<boolean>(false);
export const taskFormMode = signal<'create' | 'edit'>('create');

// Sidebar collapsed state
export const isSidebarCollapsed = signal<boolean>(false);

// Current date for timeline navigation
export const currentDate = signal<Date>(new Date());

// Timeline zoom level (column width in pixels)
export const timelineZoom = signal<number>(45);

/**
 * Change the current view mode
 */
export function setView(view: ViewMode): void {
	currentView.value = view;
}

/**
 * Select a task
 */
export function selectTask(id: string | null): void {
	selectedTaskId.value = id;
}

/**
 * Open task form for creating a new task
 */
export function openCreateTaskForm(): void {
	taskFormMode.value = 'create';
	isTaskFormOpen.value = true;
}

/**
 * Open task form for editing an existing task
 */
export function openEditTaskForm(taskId: string): void {
	taskFormMode.value = 'edit';
	selectedTaskId.value = taskId;
	isTaskFormOpen.value = true;
}

/**
 * Close task form
 */
export function closeTaskForm(): void {
	isTaskFormOpen.value = false;
	if (taskFormMode.value === 'create') {
		selectedTaskId.value = null;
	}
}

/**
 * Toggle sidebar collapsed state
 */
export function toggleSidebar(): void {
	isSidebarCollapsed.value = !isSidebarCollapsed.value;
}

/**
 * Navigate to today
 */
export function goToToday(): void {
	currentDate.value = new Date();
}

/**
 * Navigate to previous period
 */
export function goToPrevious(): void {
	const current = dayjs(currentDate.value);

	switch (currentView.value) {
		case 'Daily':
			currentDate.value = current.subtract(1, 'day').toDate();
			break;
		case 'Weekly':
			currentDate.value = current.subtract(1, 'week').toDate();
			break;
		case 'Monthly':
			currentDate.value = current.subtract(1, 'month').toDate();
			break;
		default:
			currentDate.value = current.subtract(1, 'week').toDate();
	}
}

/**
 * Navigate to next period
 */
export function goToNext(): void {
	const current = dayjs(currentDate.value);

	switch (currentView.value) {
		case 'Daily':
			currentDate.value = current.add(1, 'day').toDate();
			break;
		case 'Weekly':
			currentDate.value = current.add(1, 'week').toDate();
			break;
		case 'Monthly':
			currentDate.value = current.add(1, 'month').toDate();
			break;
		default:
			currentDate.value = current.add(1, 'week').toDate();
	}
}
