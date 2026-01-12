/**
 * Sidebar component - Left panel with task list
 */

import { Trash2 } from 'lucide-react';
import { clearAllTasks } from '../../store/taskStore';
import { isSidebarCollapsed } from '../../store/uiStore';
import { cn } from '../../utils/cn';
import { TaskList } from '../task/TaskList';

export function Sidebar() {
	const handleClearAll = async () => {
		const confirmed = window.confirm(
			'Are you sure you want to clear all tasks? This action cannot be undone.'
		);

		if (confirmed) {
			try {
				await clearAllTasks();
				console.log('All tasks cleared successfully');
			} catch (error) {
				console.error('Failed to clear tasks:', error);
				alert('Failed to clear tasks. Please try again.');
			}
		}
	};

	return (
		<aside
			className={cn(
				'border-r border-gray-200 bg-white transition-all duration-300',
				isSidebarCollapsed.value ? 'w-0' : 'w-80'
			)}
		>
			{!isSidebarCollapsed.value && (
				<div className="flex h-full flex-col">
					<div className="border-b border-gray-200 px-4 py-3">
						<div className="flex items-center justify-between">
							<h2 className="text-sm font-semibold text-gray-700">
								Work Items
							</h2>
							<button
								onClick={handleClearAll}
								className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
								title="Clear all tasks"
							>
								<Trash2 className="h-3.5 w-3.5" />
								Clear
							</button>
						</div>
					</div>
					<div className="flex-1 overflow-y-auto">
						<TaskList />
					</div>
				</div>
			)}
		</aside>
	);
}
