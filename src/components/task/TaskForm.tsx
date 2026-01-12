/**
 * TaskForm - Form for creating/editing tasks
 */

import { Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'preact/hooks';
import {
	createTask,
	deleteTask,
	getTaskById,
	updateTask,
} from '../../store/taskStore';
import {
	closeTaskForm,
	isTaskFormOpen,
	selectedTaskId,
	taskFormMode,
} from '../../store/uiStore';
import type { Task, TaskPriority, TaskStatus } from '../../types';
import { cn } from '../../utils/cn';

const statuses: TaskStatus[] = ['Backlog', 'To Do', 'In Progress', 'Done'];
const priorities: TaskPriority[] = ['Low', 'Medium', 'High', 'Urgent'];
const colors = ['purple', 'yellow', 'orange', 'blue', 'green', 'red'];

export function TaskForm() {
	const [formData, setFormData] = useState<Partial<Task>>({
		title: '',
		description: '',
		startDate: new Date(),
		endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
		priority: 'Medium',
		status: 'To Do',
		color: 'blue',
		category: '',
		dependencies: [],
	});

	const isOpen = isTaskFormOpen.value;
	const mode = taskFormMode.value;

	// Load task data when editing
	useEffect(() => {
		if (mode === 'edit' && selectedTaskId.value) {
			const task = getTaskById(selectedTaskId.value);
			if (task) {
				setFormData(task);
			}
		} else {
			// Reset form for create mode
			setFormData({
				title: '',
				description: '',
				startDate: new Date(),
				endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
				priority: 'Medium',
				status: 'To Do',
				color: 'blue',
				category: '',
				dependencies: [],
			});
		}
	}, [mode, selectedTaskId.value]);

	const handleSubmit = async (e: Event) => {
		e.preventDefault();

		if (!formData.title || !formData.title.trim()) {
			alert('Please enter a task title');
			return;
		}

		if (!formData.startDate || !formData.endDate) {
			alert('Please select start and end dates');
			return;
		}

		console.log('Submitting task:', formData);

		try {
			if (mode === 'create') {
				const newTask: Task = {
					id: crypto.randomUUID(),
					title: formData.title.trim(),
					description: formData.description || '',
					startDate: formData.startDate!,
					endDate: formData.endDate!,
					priority: formData.priority!,
					status: formData.status!,
					color: formData.color!,
					category: formData.category,
					dependencies: formData.dependencies || [],
					createdAt: new Date(),
					updatedAt: new Date(),
				};
				console.log('Creating new task:', newTask);
				await createTask(newTask);
				console.log('Task created successfully');
			} else {
				const updatedTask: Task = {
					...(formData as Task),
					updatedAt: new Date(),
				};
				console.log('Updating task:', updatedTask);
				await updateTask(updatedTask);
				console.log('Task updated successfully');
			}
			closeTaskForm();
		} catch (error) {
			console.error('Failed to save task:', error);
			alert(
				`Failed to save task: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	};

	const handleDelete = async () => {
		if (!selectedTaskId.value) return;

		const confirmed = confirm(
			'Are you sure you want to delete this task? This action cannot be undone.'
		);
		if (!confirmed) return;

		try {
			console.log('Deleting task:', selectedTaskId.value);
			await deleteTask(selectedTaskId.value);
			console.log('Task deleted successfully');
			closeTaskForm();
		} catch (error) {
			console.error('Failed to delete task:', error);
			alert(
				`Failed to delete task: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
				{/* Header */}
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-gray-900">
						{mode === 'create' ? 'New Task' : 'Edit Task'}
					</h2>
					<button
						onClick={closeTaskForm}
						className="rounded p-1 hover:bg-gray-100"
						type="button"
					>
						<X className="h-5 w-5 text-gray-500" />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit}>
					{/* Title */}
					<div className="mb-4">
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Title *
						</label>
						<input
							type="text"
							value={formData.title}
							onInput={(e) =>
								setFormData({ ...formData, title: e.currentTarget.value })
							}
							className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							placeholder="Enter task title"
							required
						/>
					</div>

					{/* Description */}
					<div className="mb-4">
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Description
						</label>
						<textarea
							value={formData.description}
							onInput={(e) =>
								setFormData({ ...formData, description: e.currentTarget.value })
							}
							className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							placeholder="Enter task description"
							rows={3}
						/>
					</div>

					{/* Dates */}
					<div className="mb-4 grid grid-cols-2 gap-4">
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">
								Start Date *
							</label>
							<input
								type="date"
								value={formData.startDate?.toISOString().split('T')[0]}
								onInput={(e) =>
									setFormData({
										...formData,
										startDate: new Date(e.currentTarget.value),
									})
								}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								required
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">
								End Date *
							</label>
							<input
								type="date"
								value={formData.endDate?.toISOString().split('T')[0]}
								onInput={(e) =>
									setFormData({
										...formData,
										endDate: new Date(e.currentTarget.value),
									})
								}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								required
							/>
						</div>
					</div>

					{/* Status and Priority */}
					<div className="mb-4 grid grid-cols-2 gap-4">
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">
								Status
							</label>
							<select
								value={formData.status}
								onChange={(e) =>
									setFormData({
										...formData,
										status: e.currentTarget.value as TaskStatus,
									})
								}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							>
								{statuses.map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">
								Priority
							</label>
							<select
								value={formData.priority}
								onChange={(e) =>
									setFormData({
										...formData,
										priority: e.currentTarget.value as TaskPriority,
									})
								}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							>
								{priorities.map((priority) => (
									<option key={priority} value={priority}>
										{priority}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Category and Color */}
					<div className="mb-4 grid grid-cols-2 gap-4">
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">
								Category
							</label>
							<input
								type="text"
								value={formData.category}
								onInput={(e) =>
									setFormData({ ...formData, category: e.currentTarget.value })
								}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								placeholder="e.g., Feature, Bug"
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">
								Color
							</label>
							<select
								value={formData.color}
								onChange={(e) =>
									setFormData({ ...formData, color: e.currentTarget.value })
								}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							>
								{colors.map((color) => (
									<option key={color} value={color}>
										{color.charAt(0).toUpperCase() + color.slice(1)}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Actions */}
					<div className="flex justify-between gap-2">
						{mode === 'edit' && (
							<button
								type="button"
								onClick={handleDelete}
								className="flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
							>
								<Trash2 className="h-4 w-4" />
								Delete
							</button>
						)}

						<div className="ml-auto flex gap-2">
							<button
								type="button"
								onClick={closeTaskForm}
								className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
							>
								{mode === 'create' ? 'Create Task' : 'Save Changes'}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
