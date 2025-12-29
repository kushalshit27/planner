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
			<header class="border-b bg-white/80 backdrop-blur">
				<div class="max-w-6xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-4">
					<div>
						<p class="text-xs uppercase tracking-wide text-slate-500">
							Planner
						</p>
						<h1 class="text-2xl font-semibold">Weekly Timeline</h1>
					</div>
					<div class="flex items-center gap-2">
						<button
							type="button"
							class={cn(
								'inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 bg-white hover:bg-slate-50'
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
								'inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-3 py-2 text-sm font-semibold shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60'
							)}
							onClick={handleSeed}
							disabled={isSyncing.value}
						>
							<Database class="h-4 w-4" />
							Seed from IndexedDB
						</button>
					</div>
				</div>
			</header>

			<main class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 px-4 py-6">
				<section class="rounded-2xl border bg-white p-4 shadow-sm">
					<div class="flex items-center justify-between mb-3">
						<div>
							<p class="text-xs uppercase tracking-wide text-slate-500">
								Tasks
							</p>
							<h2 class="text-lg font-semibold">Work items</h2>
						</div>
						<span class="text-xs text-slate-500">
							{tasks.value.length} total
						</span>
					</div>
					<TaskList syncing={isSyncing.value} />
				</section>

				<section class="rounded-2xl border bg-white p-4 shadow-sm overflow-hidden">
					<div class="flex items-center justify-between mb-3">
						<div>
							<p class="text-xs uppercase tracking-wide text-slate-500">
								Timeline
							</p>
							<h2 class="text-lg font-semibold">Weekly Gantt</h2>
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
