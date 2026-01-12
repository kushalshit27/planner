/**
 * TaskCard - Individual task item in the sidebar
 */

import { AlertCircle, Trash2 } from 'lucide-react';
import { deleteTask } from '../../store/taskStore';
import {
	openEditTaskForm,
	selectedTaskId,
	selectTask,
} from '../../store/uiStore';
import type { Task } from '../../types';
import { cn } from '../../utils/cn';

interface TaskCardProps {
	task: Task;
}

const priorityColors: Record<string, string> = {
	Low: 'text-gray-500',
	Medium: 'text-blue-500',
	High: 'text-orange-500',
	Urgent: 'text-red-500',
};

export function TaskCard({ task }: TaskCardProps) {
	const isSelected = selectedTaskId.value === task.id;

	const handleClick = () => {
		selectTask(task.id);
		openEditTaskForm(task.id);
	};

	const handleDelete = async (e: Event) => {
		e.stopPropagation();

		const confirmed = confirm(
			`Delete "${task.title}"? This action cannot be undone.`
		);
		if (!confirmed) return;

		try {
			await deleteTask(task.id);
		} catch (error) {
			console.error('Failed to delete task:', error);
			alert('Failed to delete task. Please try again.');
		}
	};

	return (
		<div
			onClick={handleClick}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					handleClick();
				}
			}}
			role="button"
			tabIndex={0}
			className={cn(
				'group cursor-pointer px-4 py-3 transition-colors hover:bg-gray-50',
				isSelected && 'bg-blue-50 hover:bg-blue-50'
			)}
		>
			<div className="flex items-start gap-3">
				{/* Checkbox */}
				<input
					type="checkbox"
					checked={task.status === 'Done'}
					onChange={(e) => {
						e.stopPropagation();
						// TODO: Update task status
					}}
					className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300"
				/>

				{/* Task content */}
				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between gap-2">
						<h3
							className={cn(
								'text-sm font-medium',
								task.status === 'Done'
									? 'text-gray-500 line-through'
									: 'text-gray-900'
							)}
						>
							{task.title}
						</h3>

						<div className="flex items-center gap-1">
							{/* Priority indicator */}
							{task.priority !== 'Low' && (
								<AlertCircle
									className={cn(
										'h-4 w-4 shrink-0',
										priorityColors[task.priority]
									)}
								/>
							)}

							{/* Delete button */}
							<button
								onClick={handleDelete}
								className="rounded p-1 opacity-0 transition-opacity hover:bg-red-50 group-hover:opacity-100"
								title="Delete task"
								type="button"
							>
								<Trash2 className="h-3.5 w-3.5 text-red-600" />
							</button>
						</div>
					</div>

					{/* Task metadata */}
					<div className="mt-1 flex items-center gap-2">
						{/* Status badge */}
						<span
							className={cn(
								'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
								task.status === 'Backlog' && 'bg-gray-100 text-gray-700',
								task.status === 'To Do' && 'bg-blue-100 text-blue-700',
								task.status === 'In Progress' &&
									'bg-yellow-100 text-yellow-700',
								task.status === 'Done' && 'bg-green-100 text-green-700'
							)}
						>
							{task.status}
						</span>

						{/* Category */}
						{task.category && (
							<span className="text-xs text-gray-500">{task.category}</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
