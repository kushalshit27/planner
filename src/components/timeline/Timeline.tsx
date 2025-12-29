import { useSignal } from '@preact/signals';
import dayjs from 'dayjs';
import { moveTaskDates, tasks } from '../../store/taskStore';
import type { Task } from '../../types';
import { cn } from '../../utils/cn';

const ROW_HEIGHT = 72;
const TASK_HEIGHT = 48;
const DAY_WIDTH = 140;

export function Timeline() {
	const drag = useSignal<{
		id: string;
		pointerId: number;
		startX: number;
		mode: 'move' | 'resize-start' | 'resize-end';
		originStart: dayjs.Dayjs;
		originEnd: dayjs.Dayjs;
		durationDays: number;
		delta: number;
	} | null>(null);

	const list = [...tasks.value].sort(
		(a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf()
	);
	const startOfWeek = (list[0] ? dayjs(list[0].startDate) : dayjs()).startOf(
		'week'
	);
	const days = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));

	if (list.length === 0) {
		return (
			<p class="text-slate-500 text-sm">
				No tasks yet. Add tasks or seed from IndexedDB.
			</p>
		);
	}

	return (
		<div class="w-full min-w-[920px] pb-2">
			<div class="grid grid-cols-7 gap-3 text-center text-xs text-slate-700 mb-4">
				{days.map((d) => (
					<div
						key={d.toString()}
						class="py-3 rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-xs"
					>
						<div class="font-semibold text-sm">{d.format('ddd')}</div>
						<div class="text-[12px] text-slate-600">{d.format('MMM D')}</div>
					</div>
				))}
			</div>

			<div
				class="relative border border-slate-200 rounded-xl bg-slate-50/80 overflow-hidden"
				style={{ minHeight: `${ROW_HEIGHT * Math.max(1, list.length)}px` }}
			>
				<div class="absolute inset-0 grid grid-cols-7">
					{days.map((d, idx) => (
						<div
							key={d.toString()}
							class={cn(
								'border-r border-dashed border-slate-300',
								idx === days.length - 1 && 'border-r-0'
							)}
						/>
					))}
				</div>

				<div class="relative">
					{list.map((task: Task, idx: number) => {
						const _offsetDays = dayjs(task.startDate).diff(startOfWeek, 'day');
						const durationDays = Math.max(
							1,
							dayjs(task.endDate).diff(task.startDate, 'day') + 1
						);
						const isActive = drag.value?.id === task.id;
						const delta = isActive ? (drag.value?.delta ?? 0) : 0;

						let displayStart = dayjs(task.startDate);
						let displayEnd = dayjs(task.endDate);

						if (isActive) {
							if (drag.value?.mode === 'move') {
								displayStart = drag.value.originStart.add(delta, 'day');
								displayEnd = drag.value.originEnd.add(delta, 'day');
							} else if (drag.value?.mode === 'resize-start') {
								const maxDelta = drag.value.durationDays - 1;
								const clamped = Math.min(delta, maxDelta - 1);
								displayStart = drag.value.originStart.add(clamped, 'day');
							} else if (drag.value?.mode === 'resize-end') {
								const minDelta = 1 - drag.value.durationDays;
								const clamped = Math.max(
									delta,
									minDelta + drag.value.durationDays - 1
								);
								displayEnd = drag.value.originEnd.add(clamped, 'day');
							}
						}

						const finalDuration = Math.max(
							1,
							displayEnd.diff(displayStart, 'day') + 1
						);
						const left = displayStart.diff(startOfWeek, 'day') * DAY_WIDTH;
						const width = finalDuration * DAY_WIDTH;
						const top = idx * ROW_HEIGHT + (ROW_HEIGHT - TASK_HEIGHT) / 2;

						return (
							<div
								key={task.id}
								class="absolute rounded-xl text-white text-xs px-4 py-2 shadow-md transition will-change-transform"
								style={{
									left: `${left}px`,
									width: `${width}px`,
									top: `${top}px`,
									height: `${TASK_HEIGHT}px`,
									backgroundColor: task.color,
								}}
								onPointerDown={(e) => {
									(e.currentTarget as HTMLElement).setPointerCapture(
										e.pointerId
									);
									drag.value = {
										id: task.id,
										pointerId: e.pointerId,
										startX: e.clientX,
										mode: 'move',
										originStart: dayjs(task.startDate),
										originEnd: dayjs(task.endDate),
										durationDays,
										delta: 0,
									};
								}}
								onPointerMove={(e) => {
									if (!drag.value || drag.value.id !== task.id) return;
									const deltaPx = e.clientX - drag.value.startX;
									const deltaDays = Math.round(deltaPx / DAY_WIDTH);
									drag.value = { ...drag.value, delta: deltaDays };
								}}
								onPointerUp={async (e) => {
									if (!drag.value || drag.value.id !== task.id) return;
									(e.currentTarget as HTMLElement).releasePointerCapture(
										e.pointerId
									);
									const deltaDays = drag.value.delta;
									let newStart = drag.value.originStart;
									let newEnd = drag.value.originEnd;

									if (drag.value.mode === 'move' && deltaDays !== 0) {
										newStart = drag.value.originStart.add(deltaDays, 'day');
										newEnd = drag.value.originEnd.add(deltaDays, 'day');
									}
									if (drag.value.mode === 'resize-start' && deltaDays !== 0) {
										const maxDelta = drag.value.durationDays - 1;
										const clamped = Math.min(deltaDays, maxDelta - 1);
										newStart = drag.value.originStart.add(clamped, 'day');
									}
									if (drag.value.mode === 'resize-end' && deltaDays !== 0) {
										const minDuration = 1;
										const clamped = Math.max(
											deltaDays,
											minDuration - drag.value.durationDays
										);
										newEnd = drag.value.originEnd.add(clamped, 'day');
									}

									if (newEnd.isBefore(newStart)) {
										newEnd = newStart.add(0, 'day');
									}

									await moveTaskDates(
										task.id,
										newStart.toDate(),
										newEnd.toDate()
									);
									drag.value = null;
								}}
								onPointerCancel={() => {
									drag.value = null;
								}}
							>
								<div class="flex items-center justify-between gap-2">
									<span class="font-semibold truncate">{task.title}</span>
									<span class="text-[10px] uppercase tracking-wide opacity-90">
										{task.status}
									</span>
								</div>
								<div class="text-[10px] text-blue-50">
									{dayjs(task.startDate).format('MMM D')} →{' '}
									{dayjs(task.endDate).format('MMM D')}
								</div>

								{/* Resize handles */}
								<div
									class="absolute inset-y-1 left-0 w-4 cursor-ew-resize rounded-l-md bg-white/25 hover:bg-white/40"
									onPointerDown={(e) => {
										e.stopPropagation();
										(e.currentTarget as HTMLElement).setPointerCapture(
											e.pointerId
										);
										drag.value = {
											id: task.id,
											pointerId: e.pointerId,
											startX: e.clientX,
											mode: 'resize-start',
											originStart: dayjs(task.startDate),
											originEnd: dayjs(task.endDate),
											durationDays,
											delta: 0,
										};
									}}
									onPointerMove={(e) => {
										if (
											!drag.value ||
											drag.value.id !== task.id ||
											drag.value.mode !== 'resize-start'
										)
											return;
										const deltaPx = e.clientX - drag.value.startX;
										const deltaDays = Math.round(deltaPx / DAY_WIDTH);
										drag.value = { ...drag.value, delta: deltaDays };
									}}
									onPointerUp={async (e) => {
										if (
											!drag.value ||
											drag.value.id !== task.id ||
											drag.value.mode !== 'resize-start'
										)
											return;
										(e.currentTarget as HTMLElement).releasePointerCapture(
											e.pointerId
										);
										const maxDelta = drag.value.durationDays - 1;
										const clamped = Math.min(drag.value.delta, maxDelta - 1);
										const newStart = drag.value.originStart.add(clamped, 'day');
										const newEnd = drag.value.originEnd;
										await moveTaskDates(
											task.id,
											newStart.toDate(),
											newEnd.toDate()
										);
										drag.value = null;
									}}
									onPointerCancel={() => {
										drag.value = null;
									}}
								/>
								<div
									class="absolute inset-y-1 right-0 w-4 cursor-ew-resize rounded-r-md bg-white/25 hover:bg-white/40"
									onPointerDown={(e) => {
										e.stopPropagation();
										(e.currentTarget as HTMLElement).setPointerCapture(
											e.pointerId
										);
										drag.value = {
											id: task.id,
											pointerId: e.pointerId,
											startX: e.clientX,
											mode: 'resize-end',
											originStart: dayjs(task.startDate),
											originEnd: dayjs(task.endDate),
											durationDays,
											delta: 0,
										};
									}}
									onPointerMove={(e) => {
										if (
											!drag.value ||
											drag.value.id !== task.id ||
											drag.value.mode !== 'resize-end'
										)
											return;
										const deltaPx = e.clientX - drag.value.startX;
										const deltaDays = Math.round(deltaPx / DAY_WIDTH);
										drag.value = { ...drag.value, delta: deltaDays };
									}}
									onPointerUp={async (e) => {
										if (
											!drag.value ||
											drag.value.id !== task.id ||
											drag.value.mode !== 'resize-end'
										)
											return;
										(e.currentTarget as HTMLElement).releasePointerCapture(
											e.pointerId
										);
										const minDuration = 1;
										const clamped = Math.max(
											drag.value.delta,
											minDuration - drag.value.durationDays
										);
										const newEnd = drag.value.originEnd.add(clamped, 'day');
										await moveTaskDates(
											task.id,
											drag.value.originStart.toDate(),
											newEnd.toDate()
										);
										drag.value = null;
									}}
									onPointerCancel={() => {
										drag.value = null;
									}}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
