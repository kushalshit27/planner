/**
 * Sample data generator for testing
 */

import type { Task } from '../types';

export function generateSampleTasks(): Task[] {
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const nextWeek = new Date(today);
	nextWeek.setDate(nextWeek.getDate() + 7);

	return [
		{
			id: crypto.randomUUID(),
			title: 'Initial brainstorming',
			description: 'Gather requirements and create initial project plan',
			startDate: new Date(today),
			endDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
			priority: 'High',
			status: 'In Progress',
			color: 'purple',
			category: 'Planning',
			dependencies: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: crypto.randomUUID(),
			title: 'Develop wireframe',
			description: 'Create wireframes for all main screens',
			startDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
			endDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
			priority: 'High',
			status: 'To Do',
			color: 'yellow',
			category: 'Design',
			dependencies: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: crypto.randomUUID(),
			title: 'Client meeting',
			description: 'Present wireframes and get feedback',
			startDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
			endDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
			priority: 'Urgent',
			status: 'To Do',
			color: 'orange',
			category: 'Meeting',
			dependencies: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: crypto.randomUUID(),
			title: 'Create prototype',
			description: 'Build interactive prototype based on approved wireframes',
			startDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
			endDate: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
			priority: 'Medium',
			status: 'To Do',
			color: 'blue',
			category: 'Development',
			dependencies: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: crypto.randomUUID(),
			title: 'Test design with users',
			description: 'Conduct usability testing with target users',
			startDate: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
			endDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
			priority: 'Medium',
			status: 'Backlog',
			color: 'green',
			category: 'Testing',
			dependencies: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];
}
