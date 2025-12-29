import { useSignal } from '@preact/signals';
import { Database, RefreshCw } from 'lucide-react';
import { useEffect } from 'preact/hooks';
import { TaskList } from './components/task/TaskList';
import { Timeline } from './components/timeline/Timeline';
import { hydrateTasks, seedSampleTasks, tasks } from './store/taskStore';
import { cn } from './utils/cn';

export function App() {
	const isSyncing = useSignal(false);

	useEffect(() => {
		const load = async () => {
			isSyncing.value = true;
			await hydrateTasks();
			isSyncing.value = false;
		};
		void load();
	}, [isSyncing]);

	const handleSeed = async () => {
		isSyncing.value = true;
		await seedSampleTasks();
		isSyncing.value = false;
	};

	const handleRefresh = async () => {
		isSyncing.value = true;
		await hydrateTasks();
		isSyncing.value = false;
	};

	return (
		<div class="min-h-screen bg-[#f6f8fb] text-slate-900">
			<header class="border-b bg-white/85 backdrop-blur shadow-sm">
				<div class="max-w-6xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 py-5">
					<div class="space-y-1">
						<p class="text-xs uppercase tracking-[0.18em] text-slate-500">
							Planner
						</p>
						<h1 class="text-2xl font-semibold">Weekly Timeline</h1>
						<p class="text-sm text-slate-600 max-w-xl">
							Plan tasks, drag bars to adjust dates, and keep a clear view of
							your week.
						</p>
					</div>
					<div class="flex flex-wrap items-center gap-2 sm:gap-3">
						<button
							type="button"
							class={cn(
								'inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-px hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60'
							)}
							onClick={handleRefresh}
							disabled={isSyncing.value}
						>
							<RefreshCw class="h-4 w-4" />
							{isSyncing.value ? 'Syncing…' : 'Refresh'}
						</button>
						<button
							type="button"
							class={cn(
								'inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-3.5 py-2.5 text-sm font-semibold shadow-md transition hover:-translate-y-px hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60'
							)}
							onClick={handleSeed}
							disabled={isSyncing.value}
						>
							<Database class="h-4 w-4" />
							Seed sample tasks
						</button>
					</div>
				</div>
			</header>

			<main class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 px-4 py-8">
				<section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
					<div class="flex items-center justify-between mb-4">
						<div class="space-y-1">
							<p class="text-xs uppercase tracking-[0.14em] text-slate-500">
								Tasks
							</p>
							<h2 class="text-xl font-semibold">Work items</h2>
						</div>
						<span class="text-xs text-slate-500">
							{tasks.value.length} total
						</span>
					</div>
					<TaskList syncing={isSyncing.value} />
				</section>

				<section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm overflow-hidden">
					<div class="flex items-center justify-between mb-4">
						<div class="space-y-1">
							<p class="text-xs uppercase tracking-[0.14em] text-slate-500">
								Timeline
							</p>
							<h2 class="text-xl font-semibold">Weekly Gantt</h2>
							<p class="text-xs text-slate-600">
								Drag bars to move tasks. Grab the ends to resize.
							</p>
						</div>
					</div>
					<div class="overflow-x-auto">
						<Timeline />
					</div>
				</section>
			</main>
		</div>
	);
}
