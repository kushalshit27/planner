const DB_NAME = 'plannerDB';
const DB_VERSION = 1;

export type StoreNames = 'tasks' | 'dependencies' | 'settings';

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('tasks')) {
        const store = db.createObjectStore('tasks', { keyPath: 'id' });
        store.createIndex('startDate', 'startDate');
        store.createIndex('endDate', 'endDate');
        store.createIndex('status', 'status');
        store.createIndex('priority', 'priority');
        store.createIndex('category', 'category');
        store.createIndex('createdAt', 'createdAt');
      }
      if (!db.objectStoreNames.contains('dependencies')) {
        const depStore = db.createObjectStore('dependencies', {
          keyPath: 'id',
          autoIncrement: true,
        });
        depStore.createIndex('sourceTaskId', 'sourceTaskId');
        depStore.createIndex('targetTaskId', 'targetTaskId');
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function runTx<T>(
  storeName: StoreNames,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T> | T | Promise<T>
): Promise<T> {
  const db = await openDatabase();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const result = fn(store);

    if (result instanceof IDBRequest) {
      result.onsuccess = () => resolve(result.result as T);
      result.onerror = () => reject(result.error);
    } else if (result instanceof Promise) {
      result.then(resolve).catch(reject);
      tx.onerror = () => reject(tx.error);
    } else {
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
    }
  });
}
