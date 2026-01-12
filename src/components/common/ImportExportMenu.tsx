/**
 * ImportExportMenu - Dropdown for import/export operations
 */

import { Download, FileJson, Upload } from 'lucide-react';
import { useRef, useState } from 'preact/hooks';
import {
	importTasks as importTasksToStore,
	tasks,
} from '../../store/taskStore';
import { cn } from '../../utils/cn';
import {
	exportTasks,
	importTasks as parseImportFile,
} from '../../utils/importExport';

interface ImportExportMenuProps {
	className?: string;
}

export function ImportExportMenu({ className }: ImportExportMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleExport = () => {
		try {
			exportTasks(tasks.value);
			setSuccess(`Exported ${tasks.value.length} tasks`);
			setTimeout(() => setSuccess(null), 3000);
			setIsOpen(false);
		} catch (err) {
			setError(`Export failed: ${(err as Error).message}`);
			setTimeout(() => setError(null), 3000);
		}
	};

	const handleImportClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		setError(null);
		setSuccess(null);

		parseImportFile(file, async (importedTasks, errorMsg) => {
			if (errorMsg) {
				setError(errorMsg);
				setTimeout(() => setError(null), 5000);
				return;
			}

			if (!importedTasks || importedTasks.length === 0) {
				setError('No tasks found in the file');
				setTimeout(() => setError(null), 5000);
				return;
			}

			try {
				const merge = importMode === 'merge';
				console.log(
					`Starting import: mode=${merge ? 'merge' : 'replace'}, count=${importedTasks.length}`
				);

				await importTasksToStore(importedTasks, merge);

				const successMsg = merge
					? `Merged ${importedTasks.length} tasks successfully`
					: `Imported ${importedTasks.length} tasks successfully`;
				console.log(successMsg);
				setSuccess(successMsg);
				setTimeout(() => setSuccess(null), 5000);
				setIsOpen(false);
			} catch (err) {
				const errorMessage = `Import failed: ${(err as Error).message}`;
				console.error(errorMessage, err);
				setError(errorMessage);
				setTimeout(() => setError(null), 5000);
			}
		});

		// Reset input
		target.value = '';
	};

	return (
		<div className={cn('relative', className)}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
				type="button"
			>
				<FileJson className="h-4 w-4" />
				Data
			</button>

			{isOpen && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 z-10"
						onClick={() => setIsOpen(false)}
						onKeyDown={() => {}}
					/>

					{/* Dropdown menu */}
					<div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-lg">
						<div className="p-4">
							<h3 className="mb-3 text-sm font-semibold text-gray-900">
								Import / Export Tasks
							</h3>

							{/* Export section */}
							<div className="mb-4">
								<button
									onClick={handleExport}
									className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50"
									type="button"
									disabled={tasks.value.length === 0}
								>
									<Download className="h-5 w-5 text-blue-600" />
									<div className="flex-1">
										<div className="text-sm font-medium text-gray-900">
											Export Tasks
										</div>
										<div className="text-xs text-gray-500">
											Download as JSON ({tasks.value.length} tasks)
										</div>
									</div>
								</button>
							</div>

							{/* Import section */}
							<div className="space-y-3">
								<div className="text-xs font-medium text-gray-700">
									Import Mode:
								</div>
								<div className="flex gap-2">
									<label className="flex flex-1 items-center gap-2 rounded border border-gray-200 px-3 py-2 text-xs cursor-pointer hover:bg-gray-50">
										<input
											type="radio"
											name="importMode"
											value="replace"
											checked={importMode === 'replace'}
											onChange={() => setImportMode('replace')}
											className="text-blue-600"
										/>
										<span>Replace All</span>
									</label>
									<label className="flex flex-1 items-center gap-2 rounded border border-gray-200 px-3 py-2 text-xs cursor-pointer hover:bg-gray-50">
										<input
											type="radio"
											name="importMode"
											value="merge"
											checked={importMode === 'merge'}
											onChange={() => setImportMode('merge')}
											className="text-blue-600"
										/>
										<span>Merge</span>
									</label>
								</div>

								<button
									onClick={handleImportClick}
									className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50"
									type="button"
								>
									<Upload className="h-5 w-5 text-green-600" />
									<div className="flex-1">
										<div className="text-sm font-medium text-gray-900">
											Import Tasks
										</div>
										<div className="text-xs text-gray-500">
											Upload JSON file
										</div>
									</div>
								</button>

								<input
									ref={fileInputRef}
									type="file"
									accept=".json,application/json"
									onChange={handleFileChange}
									className="hidden"
								/>
							</div>

							{/* Status messages */}
							{error && (
								<div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
									{error}
								</div>
							)}
							{success && (
								<div className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
									{success}
								</div>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
