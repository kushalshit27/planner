/**
 * WeeklyView - Main weekly timeline view
 */

import { GanttChart } from '../timeline/GanttChart';

export function WeeklyView() {
	return (
		<div className="h-full">
			<GanttChart />
		</div>
	);
}
