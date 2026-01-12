/**
 * Sidebar component - Left panel with task list
 */

import { isSidebarCollapsed } from '../../store/uiStore';
import { cn } from '../../utils/cn';
import { TaskList } from '../task/TaskList';

export function Sidebar() {
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
						<h2 className="text-sm font-semibold text-gray-700">Work Items</h2>
					</div>
					<div className="flex-1 overflow-y-auto">
						<TaskList />
					</div>
				</div>
			)}
		</aside>
	);
}
