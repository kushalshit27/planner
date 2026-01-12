/**
 * IndexedDB initialization and connection management
 * Schema v1: tasks, dependencies, settings object stores
 */

const DB_NAME = 'plannerDB';
const DB_VERSION = 1;

export const STORES = {
	TASKS: 'tasks',
	DEPENDENCIES: 'dependencies',
	SETTINGS: 'settings',
} as const;

let dbInstance: IDBDatabase | null = null;

/**
 * Initialize and open the IndexedDB connection
 */
export async function initDB(): Promise<IDBDatabase> {
	if (dbInstance) {
		return dbInstance;
	}

	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => {
			reject(new Error(`Failed to open database: ${request.error?.message}`));
		};

		request.onsuccess = () => {
			dbInstance = request.result;
			resolve(dbInstance);
		};

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;

			// Create tasks object store
			if (!db.objectStoreNames.contains(STORES.TASKS)) {
				const taskStore = db.createObjectStore(STORES.TASKS, { keyPath: 'id' });
				taskStore.createIndex('startDate', 'startDate', { unique: false });
				taskStore.createIndex('endDate', 'endDate', { unique: false });
				taskStore.createIndex('status', 'status', { unique: false });
				taskStore.createIndex('priority', 'priority', { unique: false });
			}

			// Create dependencies object store
			if (!db.objectStoreNames.contains(STORES.DEPENDENCIES)) {
				db.createObjectStore(STORES.DEPENDENCIES, {
					keyPath: 'id',
					autoIncrement: true,
				});
			}

			// Create settings object store
			if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
				db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
			}
		};
	});
}

/**
 * Get the current database instance
 */
export async function getDB(): Promise<IDBDatabase> {
	if (!dbInstance) {
		return initDB();
	}
	return dbInstance;
}

/**
 * Close the database connection
 */
function _closeDB(): void {
	if (dbInstance) {
		dbInstance.close();
		dbInstance = null;
	}
}
