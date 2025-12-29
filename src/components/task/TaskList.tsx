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
	backlog: 'bg-slate-100 text-slate-700',
	'in-progress': 'bg-blue-100 text-blue-700',
	todo: 'bg-amber-100 text-amber-700',
	done: 'bg-emerald-100 text-emerald-700',
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
		<div class="space-y-4 text-sm">
			<form
				onSubmit={handleSubmit}
				class="rounded-xl border bg-slate-50 p-3 space-y-3"
			>
				<div class="flex items-center gap-2 text-slate-600 text-xs font-medium uppercase tracking-wide">
					<CalendarRange class="h-4 w-4" />
					Quick add task
				</div>
				<div class="space-y-2">
					<input
						type="text"
						placeholder="Task title"
						value={title.value}
						onInput={(e) => {
							title.value = (e.target as HTMLInputElement).value;
						}}
						class="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
						<label class="flex flex-col gap-1 text-xs text-slate-600">
							Start date
							<input
								type="date"
								value={start.value}
								onInput={(e) => {
									start.value = (e.target as HTMLInputElement).value;
								}}
								class="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</label>
						<label class="flex flex-col gap-1 text-xs text-slate-600">
							End date
							<input
								type="date"
								value={end.value}
								onInput={(e) => {
									end.value = (e.target as HTMLInputElement).value;
								}}
								class="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</label>
					</div>
				</div>
				<button
					type="submit"
					disabled={syncing}
					class="inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-3 py-2 text-sm font-semibold shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-60"
				>
					<Plus class="h-4 w-4" />
					Add task
				</button>
			</form>

			{sorted.length === 0 && (
				<p class="text-slate-500">No tasks yet. Seed data or add a new task.</p>
			)}

			<div class="space-y-2">
				{sorted.map((task: Task) => (
					<div
						key={task.id}
						class="rounded-xl border bg-white px-4 py-3 shadow-sm"
					>
						<div class="flex items-start justify-between gap-3">
							<div class="space-y-1">
								<div class="flex items-center gap-2">
									<span class="font-semibold text-slate-900">{task.title}</span>
									<span
										class={cn(
											'text-[11px] rounded-full px-2 py-0.5 font-semibold',
											statusStyles[task.status]
										)}
									>
										{task.status.toUpperCase()}
									</span>
								</div>
								<p class="text-xs text-slate-600">
									{dayjs(task.startDate).format('ddd, MMM D YYYY')} →{' '}
									{dayjs(task.endDate).format('ddd, MMM D YYYY')}
								</p>
							</div>
							<button
								type="button"
								class="text-slate-400 hover:text-slate-600"
								aria-label={`Delete ${task.title}`}
								onClick={() => void handleDelete(task)}
							>
								<Trash2 class="h-4 w-4" />
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
