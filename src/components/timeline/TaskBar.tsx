/**
 * TaskBar - Visual representation of a task on the timeline
 */

import { useState } from 'preact/hooks';
import { updateTask } from '../../store/taskStore';
import { currentDate, openEditTaskForm, selectTask } from '../../store/uiStore';
import type { Task } from '../../types';
import { cn } from '../../utils/cn';
import {
	addDays,
	formatDate,
	getDaysDiff,
	getWeekStart,
} from '../../utils/dateUtils';

interface TaskBarProps {
	task: Task;
	index: number;
}

const TASK_BAR_HEIGHT = 32;
const ROW_HEIGHT = 48;
const VIEW_DAYS = 14;
const COLUMN_WIDTH = 100 / VIEW_DAYS; // Percentage

// Task color mapping from SPEC.md
const colorClasses: Record<string, string> = {
	purple: 'bg-purple-300 hover:bg-purple-400',
	yellow: 'bg-yellow-200 hover:bg-yellow-300',
	orange: 'bg-orange-300 hover:bg-orange-400',
	blue: 'bg-blue-300 hover:bg-blue-400',
	green: 'bg-green-300 hover:bg-green-400',
	red: 'bg-red-300 hover:bg-red-400',
};

export function TaskBar({ task, index }: TaskBarProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [isResizing, setIsResizing] = useState<'start' | 'end' | null>(null);
	const [dragStartX, setDragStartX] = useState(0);
	const [dragOffsetDays, setDragOffsetDays] = useState(0);
	const [resizeOffsetDays, setResizeOffsetDays] = useState(0);

	const weekStart = getWeekStart(currentDate.value);
	const weekEnd = new Date(weekStart);
	weekEnd.setDate(weekEnd.getDate() + (VIEW_DAYS - 1));

	// Calculate position based on task dates
	const taskStart = new Date(task.startDate);
	const taskEnd = new Date(task.endDate);

	// Days from week start to task start
	const daysFromStart = getDaysDiff(weekStart, taskStart);

	// Task duration in days
	const duration = getDaysDiff(taskStart, taskEnd) + 1;

	// Calculate position and width as percentages
	let leftPercent = Math.max(
		0,
		(daysFromStart + dragOffsetDays) * COLUMN_WIDTH
	);
	let widthPercent = Math.min(
		duration * COLUMN_WIDTH,
		(VIEW_DAYS - daysFromStart - dragOffsetDays) * COLUMN_WIDTH
	);

	// Adjust for resizing
	if (isResizing === 'start') {
		leftPercent = Math.max(
			0,
			(daysFromStart + resizeOffsetDays) * COLUMN_WIDTH
		);
		widthPercent = Math.max(
			COLUMN_WIDTH,
			(duration - resizeOffsetDays) * COLUMN_WIDTH
		);
	} else if (isResizing === 'end') {
		widthPercent = Math.max(
			COLUMN_WIDTH,
			(duration + resizeOffsetDays) * COLUMN_WIDTH
		);
	}

	// Calculate dynamic dates for display/tooltip
	let displayStartDate = task.startDate;
	let displayEndDate = task.endDate;

	if (isDragging) {
		displayStartDate = addDays(task.startDate, dragOffsetDays);
		displayEndDate = addDays(task.endDate, dragOffsetDays);
	} else if (isResizing === 'start') {
		displayStartDate = addDays(task.startDate, resizeOffsetDays);
	} else if (isResizing === 'end') {
		displayEndDate = addDays(task.endDate, resizeOffsetDays);
	}

	// Progress percentage based on status
	const progressPercent =
		task.status === 'Done'
			? 100
			: task.status === 'In Progress'
				? 50
				: task.status === 'To Do'
					? 10
					: 0;

	// Don't render if task is completely outside the week view
	if (daysFromStart >= VIEW_DAYS || daysFromStart + duration < 0) {
		return null;
	}

	const colorClass = colorClasses[task.color] || colorClasses.blue;
	const topPosition = index * ROW_HEIGHT + (ROW_HEIGHT - TASK_BAR_HEIGHT) / 2;

	const handleClick = () => {
		if (!isDragging && !isResizing) {
			selectTask(task.id);
			openEditTaskForm(task.id);
		}
	};

	const handleMouseDown = (e: MouseEvent) => {
		if (e.button === 0) {
			// Left click only
			setIsDragging(true);
			setDragStartX(e.clientX);
			setDragOffsetDays(0);
			e.preventDefault();
			e.stopPropagation();
		}
	};

	const handleResizeStart = (e: MouseEvent, edge: 'start' | 'end') => {
		e.stopPropagation();
		e.preventDefault();
		setIsResizing(edge);
		setDragStartX(e.clientX);
		setResizeOffsetDays(0);
	};

	const handleMouseMove = (e: MouseEvent) => {
		const timeline = document.querySelector('.timeline-content');
		if (!timeline) return;

		const timelineWidth = timeline.clientWidth;
		const pixelsPerDay = timelineWidth / VIEW_DAYS;
		const deltaX = e.clientX - dragStartX;
		const dayOffset = Math.round(deltaX / pixelsPerDay);

		if (isDragging) {
			setDragOffsetDays(dayOffset);
			e.preventDefault();
		} else if (isResizing) {
			setResizeOffsetDays(dayOffset);
			e.preventDefault();
		}
	};

	const handleMouseUp = async (e: MouseEvent) => {
		if (isDragging) {
			setIsDragging(false);

			if (dragOffsetDays !== 0) {
				// Update task dates - move entire task
				const newStartDate = addDays(task.startDate, dragOffsetDays);
				const newEndDate = addDays(task.endDate, dragOffsetDays);

				try {
					await updateTask({
						...task,
						startDate: newStartDate,
						endDate: newEndDate,
						updatedAt: new Date(),
					});
					console.log(`Task moved by ${dragOffsetDays} days`);
				} catch (error) {
					console.error('Failed to update task position:', error);
				}
			}

			setDragOffsetDays(0);
			e.preventDefault();
		} else if (isResizing) {
			const edge = isResizing;
			setIsResizing(null);

			if (resizeOffsetDays !== 0) {
				let newStartDate = task.startDate;
				let newEndDate = task.endDate;

				if (edge === 'start') {
					// Resize from start - change start date only
					newStartDate = addDays(task.startDate, resizeOffsetDays);
					// Ensure start is before end
					if (newStartDate >= task.endDate) {
						newStartDate = addDays(task.endDate, -1);
					}
				} else if (edge === 'end') {
					// Resize from end - change end date only
					newEndDate = addDays(task.endDate, resizeOffsetDays);
					// Ensure end is after start
					if (newEndDate <= task.startDate) {
						newEndDate = addDays(task.startDate, 1);
					}
				}

				try {
					await updateTask({
						...task,
						startDate: newStartDate,
						endDate: newEndDate,
						updatedAt: new Date(),
					});
					console.log(
						`Task resized: ${edge} edge moved by ${resizeOffsetDays} days`
					);
				} catch (error) {
					console.error('Failed to resize task:', error);
				}
			}

			setResizeOffsetDays(0);
			e.preventDefault();
		}
	};

	// Add global mouse event listeners when dragging or resizing
	if (isDragging || isResizing) {
		document.addEventListener('mousemove', handleMouseMove as any);
		document.addEventListener('mouseup', handleMouseUp as any);

		// Cleanup
		setTimeout(() => {
			document.removeEventListener('mousemove', handleMouseMove as any);
			document.removeEventListener('mouseup', handleMouseUp as any);
		}, 0);
	}

	return (
		<div
			onClick={handleClick}
			onMouseDown={handleMouseDown as any}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					handleClick();
				}
			}}
			role="button"
			tabIndex={0}
			className={cn(
				'group absolute rounded-md transition-all select-none overflow-hidden',
				'flex items-center',
				'shadow-sm border border-black/5',
				isDragging || isResizing
					? 'cursor-grabbing shadow-lg opacity-90 z-50 ring-2 ring-blue-400 ring-offset-1'
					: 'cursor-grab',
				colorClass
			)}
			style={{
				left: `${leftPercent}%`,
				top: `${topPosition}px`,
				width: `${widthPercent}%`,
				height: `${TASK_BAR_HEIGHT}px`,
				minWidth: '24px', // Reduced min-width
			}}
			title={`${task.title}\n${formatDate(displayStartDate)} - ${formatDate(displayEndDate)}\nStatus: ${task.status}\nDrag to reschedule • Resize edges to adjust duration`}
		>
			{/* Progress bar background */}
			<div
				className="absolute left-0 top-0 bottom-0 bg-black/10 transition-all duration-300"
				style={{ width: `${progressPercent}%` }}
			/>

			{/* Left resize handle */}
			<div
				onMouseDown={(e) => handleResizeStart(e as any, 'start')}
				className={cn(
					'absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize z-20',
					'opacity-0 hover:opacity-100 transition-opacity',
					'flex items-center justify-center'
				)}
				title="Drag start date"
			>
				<div className="h-4 w-1 bg-black/20 rounded-full" />
			</div>

			<div className="flex min-w-0 flex-1 items-center gap-2 px-3 relative z-10">
				{/* Task title */}
				<span className="truncate text-xs font-semibold text-gray-900 drop-shadow-sm select-none">
					{task.title}
				</span>
			</div>

			{/* Priority indicator (right side) */}
			{task.priority === 'Urgent' && (
				<div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
					<span className="block h-2 w-2 rounded-full bg-red-500 shadow-sm ring-1 ring-white/50" />
				</div>
			)}

			{/* Right resize handle */}
			<div
				onMouseDown={(e) => handleResizeStart(e as any, 'end')}
				className={cn(
					'absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize z-20',
					'opacity-0 hover:opacity-100 transition-opacity',
					'flex items-center justify-center'
				)}
				title="Drag end date"
			>
				<div className="h-4 w-1 bg-black/20 rounded-full" />
			</div>
		</div>
	);
}
