/**
 * Header component - Top navigation bar
 */

import { Calendar, ChevronLeft, ChevronRight, Menu, Plus } from 'lucide-react';
import {
	currentDate,
	currentView,
	goToNext,
	goToPrevious,
	goToToday,
	openCreateTaskForm,
	setView,
	toggleSidebar,
} from '../../store/uiStore';
import type { ViewMode } from '../../types';
import { cn } from '../../utils/cn';
import { formatDate } from '../../utils/dateUtils';

export function Header() {
	const views: ViewMode[] = ['Daily', 'Weekly', 'Monthly', 'Timeline'];

	return (
		<header className="border-b border-gray-200 bg-white px-4 py-3">
			<div className="flex items-center justify-between">
				{/* Left section */}
				<div className="flex items-center gap-4">
					<button
						onClick={toggleSidebar}
						className="rounded p-2 hover:bg-gray-100 lg:hidden"
						type="button"
					>
						<Menu className="h-5 w-5 text-gray-600" />
					</button>
					<h1 className="text-xl font-semibold text-gray-900">MyPlannerView</h1>
				</div>

				{/* Center section - Date navigation */}
				<div className="flex items-center gap-2">
					<button
						onClick={goToPrevious}
						className="rounded p-2 hover:bg-gray-100"
						type="button"
					>
						<ChevronLeft className="h-5 w-5 text-gray-600" />
					</button>

					<button
						onClick={goToToday}
						className="rounded px-3 py-2 text-sm font-medium hover:bg-gray-100"
						type="button"
					>
						Today
					</button>

					<div className="flex items-center gap-2 px-3">
						<Calendar className="h-4 w-4 text-gray-500" />
						<span className="text-sm font-medium text-gray-700">
							{formatDate(currentDate.value, 'MMMM YYYY')}
						</span>
					</div>

					<button
						onClick={goToNext}
						className="rounded p-2 hover:bg-gray-100"
						type="button"
					>
						<ChevronRight className="h-5 w-5 text-gray-600" />
					</button>
				</div>

				{/* Right section - View toggle and actions */}
				<div className="flex items-center gap-2">
					{/* View mode selector */}
					<div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
						{views.map((view) => (
							<button
								key={view}
								onClick={() => setView(view)}
								className={cn(
									'rounded px-3 py-1.5 text-sm font-medium transition-colors',
									currentView.value === view
										? 'bg-white text-blue-600 shadow-sm'
										: 'text-gray-600 hover:text-gray-900'
								)}
								type="button"
							>
								{view}
							</button>
						))}
					</div>

					{/* New task button */}
					<button
						onClick={openCreateTaskForm}
						className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
						type="button"
					>
						<Plus className="h-4 w-4" />
						New Task
					</button>
				</div>
			</div>
		</header>
	);
}
