/**
 * MainContent component - Main area for timeline/calendar views
 */

import { currentView } from '../../store/uiStore';
import { WeeklyView } from '../views/WeeklyView';

export function MainContent() {
	return (
		<main className="flex-1 overflow-auto bg-gray-50">
			{currentView.value === 'Weekly' && <WeeklyView />}
			{currentView.value === 'Daily' && (
				<div className="flex h-full items-center justify-center text-gray-500">
					Daily view coming soon...
				</div>
			)}
			{currentView.value === 'Monthly' && (
				<div className="flex h-full items-center justify-center text-gray-500">
					Monthly view coming soon...
				</div>
			)}
			{currentView.value === 'Timeline' && (
				<div className="flex h-full items-center justify-center text-gray-500">
					Timeline view coming soon...
				</div>
			)}
		</main>
	);
}
