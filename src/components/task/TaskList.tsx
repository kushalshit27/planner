/**
 * TaskList - List of tasks in the sidebar
 */

import { tasks } from '../../store/taskStore';
import { TaskCard } from './TaskCard';

export function TaskList() {
	const taskList = tasks.value;

	if (taskList.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<p className="text-sm text-gray-500">No tasks yet</p>
				<p className="mt-1 text-xs text-gray-400">
					Create a task to get started
				</p>
			</div>
		);
	}

	return (
		<div className="divide-y divide-gray-100">
			{taskList.map((task) => (
				<TaskCard key={task.id} task={task} />
			))}
		</div>
	);
}
