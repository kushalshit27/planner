/**
 * Core type definitions for Planner app
 * Based on SPEC.md Section 4.3
 */

export type TaskStatus = 'Backlog' | 'To Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type DependencyType = 'FS' | 'SS' | 'FF';
export type ViewMode = 'Daily' | 'Weekly' | 'Monthly' | 'Timeline';

export interface Dependency {
	taskId: string;
	type: DependencyType;
}

export interface Task {
	id: string; // UUID
	title: string;
	description?: string;
	startDate: Date;
	endDate: Date;
	priority: TaskPriority;
	status: TaskStatus;
	category?: string;
	color: string;
	dependencies: Dependency[];
	assignee?: string; // Future feature
	createdAt: Date;
	updatedAt: Date;
}

// UI Store types
export interface UIState {
	currentView: ViewMode;
	selectedTaskId: string | null;
	isTaskFormOpen: boolean;
	isSidebarCollapsed: boolean;
	currentDate: Date;
}

// Timeline/Gantt types
export interface TimelineConfig {
	columnWidth: number;
	rowHeight: number;
	startDate: Date;
	endDate: Date;
}

export interface TaskBarPosition {
	x: number;
	y: number;
	width: number;
	height: number;
}
