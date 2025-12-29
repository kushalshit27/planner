import { useSignal } from '@preact/signals';
import dayjs from 'dayjs';
import { CalendarRange, Plus, Trash2 } from 'lucide-react';
import { removeTask, saveTask, tasks } from '../../store/taskStore';
import type { Status, Task } from '../../types';
import { cn } from '../../utils/cn';

type TaskListProps = {
	syncing?: boolean;
};

const statusStyles: Record<Status, string> = {
	backlog: 'bg-slate-100 text-slate-700 border border-slate-200',
	'in-progress': 'bg-blue-100 text-blue-700 border border-blue-200',
	todo: 'bg-amber-50 text-amber-700 border border-amber-200',
	done: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

export function TaskList({ syncing = false }: TaskListProps) {
	const title = useSignal('');
	const start = useSignal(dayjs().format('YYYY-MM-DD'));
	const end = useSignal(dayjs().add(2, 'day').format('YYYY-MM-DD'));

	const sorted = [...tasks.value].sort(
		(a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf()
	);

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		if (!title.value.trim()) return;

		const startDate = dayjs(start.value);
		const endDate = dayjs(end.value);
		if (!startDate.isValid() || !endDate.isValid()) return;

		await saveTask({
			title: title.value.trim(),
			startDate: startDate.toDate(),
			endDate: endDate.toDate(),
		});

		title.value = '';
		start.value = dayjs().format('YYYY-MM-DD');
		end.value = dayjs().add(2, 'day').format('YYYY-MM-DD');
	};

	const handleDelete = async (task: Task) => {
		await removeTask(task.id);
	};

	return (
		<div class="space-y-5 text-sm">
			<form
				onSubmit={handleSubmit}
				class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-4 shadow-sm"
			>
				<div class="flex items-center gap-2 text-slate-600 text-xs font-semibold uppercase tracking-[0.18em]">
					<CalendarRange class="h-4 w-4" />
					Quick add task
				</div>
				<div class="space-y-3">
					<input
						type="text"
						placeholder="Give your task a clear title"
						aria-label="Task title"
						value={title.value}
						onInput={(e) => {
							title.value = (e.target as HTMLInputElement).value;
						}}
						class="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
					/>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<label class="flex flex-col gap-1 text-xs text-slate-600 font-medium">
							Start date
							<input
								type="date"
								value={start.value}
								onInput={(e) => {
									start.value = (e.target as HTMLInputElement).value;
								}}
								class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
							/>
						</label>
						<label class="flex flex-col gap-1 text-xs text-slate-600 font-medium">
							End date
							<input
								type="date"
								value={end.value}
								onInput={(e) => {
									end.value = (e.target as HTMLInputElement).value;
								}}
								class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
							/>
						</label>
					</div>
					<p class="text-xs text-slate-500">
						Tip: Dates default to today and two days ahead. Adjust as needed.
					</p>
				</div>
				<button
					type="submit"
					disabled={syncing}
					class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-semibold shadow-md transition hover:-translate-y-px hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-60"
				>
					<Plus class="h-4 w-4" />
					Add task
				</button>
			</form>

			{sorted.length === 0 && (
				<p class="text-slate-500 text-sm">
					No tasks yet. Seed data or add a new task.
				</p>
			)}

			<div class="space-y-3">
				{sorted.map((task: Task) => (
					<div
						key={task.id}
						class="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-px hover:shadow-md"
					>
						<div class="flex items-start justify-between gap-4">
							<div class="space-y-2">
								<div class="flex flex-wrap items-center gap-2">
									<span class="font-semibold text-slate-900 text-sm sm:text-base">
										{task.title}
									</span>
									<span
										class={cn(
											'text-[12px] rounded-md px-2.5 py-1 font-semibold uppercase tracking-wide',
											statusStyles[task.status]
										)}
									>
										{task.status}
									</span>
								</div>
								<p class="text-xs text-slate-600">
									{dayjs(task.startDate).format('MMM D')} →{' '}
									{dayjs(task.endDate).format('MMM D')}
								</p>
							</div>
							<button
								type="button"
								class="text-slate-400 hover:text-rose-500 transition"
								aria-label={`Delete ${task.title}`}
								onClick={() => void handleDelete(task)}
							>
								<Trash2 class="h-5 w-5" />
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
