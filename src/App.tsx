/**
 * Main App component
 */

import { useEffect } from 'preact/hooks';
import { Header } from './components/layout/Header';
import { MainContent } from './components/layout/MainContent';
import { Sidebar } from './components/layout/Sidebar';
import { TaskForm } from './components/task/TaskForm';
import { loadTasks } from './store/taskStore';
import { initDB } from './utils/dbUtils';
import { generateSampleTasks } from './utils/sampleData';
import { bulkCreateTasks } from './utils/storageUtils';

export function App() {
	useEffect(() => {
		// Initialize IndexedDB and load tasks on mount
		const initialize = async () => {
			try {
				console.log('Initializing database...');
				await initDB();
				console.log('Database initialized successfully');

				console.log('Loading tasks...');
				await loadTasks();
				console.log('Tasks loaded successfully');

				// Check if we need to seed sample data
				const tasks = (await import('./store/taskStore')).tasks.value;
				if (tasks.length === 0) {
					console.log('No tasks found, seeding sample data...');
					const sampleTasks = generateSampleTasks();
					await bulkCreateTasks(sampleTasks);
					await loadTasks();
					console.log('Sample data seeded successfully');
				}
			} catch (error) {
				console.error('Failed to initialize app:', error);
			}
		};

		initialize();
	}, []);

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<div className="flex flex-1 overflow-hidden">
				<Sidebar />
				<MainContent />
			</div>
			<TaskForm />
		</div>
	);
}
