/**
 * TimelineGrid - Background grid for the timeline
 */

import { currentDate } from '../../store/uiStore';
import { cn } from '../../utils/cn';
import { getTimelineDates, isToday, isWeekend } from '../../utils/dateUtils';

export function TimelineGrid() {
	const timelineDates = getTimelineDates(currentDate.value);

	return (
		<div
			className="absolute inset-0 grid"
			style={{ gridTemplateColumns: 'repeat(14, 1fr)' }}
		>
			{timelineDates.map((date) => {
				const today = isToday(date);
				const weekend = isWeekend(date);

				return (
					<div
						key={date.toISOString()}
						className={cn(
							'relative border-r border-gray-200 last:border-r-0',
							weekend && 'bg-gray-100',
							today && 'bg-blue-50/30'
						)}
					>
						{/* Vertical grid line */}
						<div className="absolute inset-y-0 left-0 w-px bg-gray-200" />
					</div>
				);
			})}
		</div>
	);
}
