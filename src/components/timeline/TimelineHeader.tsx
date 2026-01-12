/**
 * TimelineHeader - Column headers showing dates for the timeline
 */

import { currentDate } from '../../store/uiStore';
import { cn } from '../../utils/cn';
import {
	getDayName,
	getDayOfMonth,
	getTimelineDates,
	isToday,
	isWeekend,
} from '../../utils/dateUtils';

export function TimelineHeader() {
	const timelineDates = getTimelineDates(currentDate.value);

	return (
		<div
			className="grid border-b border-gray-200 bg-white"
			style={{ gridTemplateColumns: 'repeat(14, 1fr)' }}
		>
			{timelineDates.map((date) => {
				const today = isToday(date);
				const weekend = isWeekend(date);

				return (
					<div
						key={date.toISOString()}
						className={cn(
							'flex flex-col items-center justify-center border-r border-gray-200 py-3 last:border-r-0',
							weekend && 'bg-gray-100',
							today && 'bg-blue-50'
						)}
					>
						<div
							className={cn(
								'text-xs font-medium uppercase',
								today ? 'text-blue-600' : 'text-gray-500'
							)}
						>
							{getDayName(date)}
						</div>
						<div
							className={cn(
								'mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
								today && 'bg-blue-600 text-white',
								!today && 'text-gray-900'
							)}
						>
							{getDayOfMonth(date)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
