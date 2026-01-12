/**
 * GanttChart - Main timeline/Gantt chart component
 * Inspired by frappe-gantt structure
 */

import { sortedTasks } from '../../store/taskStore';
import { TaskBar } from './TaskBar';
import { TimelineGrid } from './TimelineGrid';
import { TimelineHeader } from './TimelineHeader';

export function GanttChart() {
	const tasks = sortedTasks.value;

	return (
		<div className="flex h-full flex-col bg-white">
			{/* Timeline header with dates */}
			<TimelineHeader />

			{/* Timeline content area */}
			<div className="timeline-content relative flex-1 overflow-auto">
				{/* Background grid */}
				<div className="absolute inset-0">
					<TimelineGrid />
				</div>

				{/* Task bars layer */}
				<div
					className="relative"
					style={{
						height: `${tasks.length * 48 + 24}px`,
						minHeight: '100%',
					}}
				>
					{tasks.map((task, index) => (
						<TaskBar key={task.id} task={task} index={index} />
					))}
				</div>

				{/* Empty state */}
				{tasks.length === 0 && (
					<div className="flex h-full items-center justify-center">
						<div className="text-center">
							<p className="text-sm text-gray-500">No tasks yet</p>
							<p className="mt-1 text-xs text-gray-400">
								Click "New Task" to create your first task
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
