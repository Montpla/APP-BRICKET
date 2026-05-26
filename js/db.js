// Database Manager - IndexedDB abstraction layer
class DatabaseManager {
  constructor(dbName = 'ARAYA_DB', version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
    this.stores = {
      projects: { keyPath: 'id' },
      chartOfAccounts: { keyPath: 'id' },
      journalEntries: { keyPath: 'id' },
      invoices: { keyPath: 'id' },
      imports: { keyPath: 'id' },
      budgetData: { keyPath: 'id' },
      expenseData: { keyPath: 'id' },
      salesData: { keyPath: 'id' }
    };
  }

  // Inicializar base de datos
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        // Crear stores
        Object.entries(this.stores).forEach(([name, config]) => {
          if (!db.objectStoreNames.contains(name)) {
            const store = db.createObjectStore(name, config);
            // Crear índices comunes
            store.createIndex('projectId', 'projectId', { unique: false });
            store.createIndex('createdAt', 'createdAt', { unique: false });
            if (name === 'journalEntries') {
              store.createIndex('date', 'date', { unique: false });
            }
            if (name === 'invoices') {
              store.createIndex('number', 'number', { unique: true });
              store.createIndex('status', 'status', { unique: false });
            }
          }
        });
      };
    });
  }

  // CRUD: Create
  async create(storeName, data) {
    if (!this.db) throw new Error('Database not initialized');
    const store = this.getStore(storeName, 'readwrite');
    data.id = data.id || this.generateUUID();
    data.createdAt = data.createdAt || Date.now();
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(data);
    });
  }

  // CRUD: Read
  async read(storeName, id) {
    if (!this.db) throw new Error('Database not initialized');
    const store = this.getStore(storeName, 'readonly');
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // CRUD: Update
  async update(storeName, id, data) {
    if (!this.db) throw new Error('Database not initialized');
    const store = this.getStore(storeName, 'readwrite');
    const updated = { id, ...data, updatedAt: Date.now() };
    return new Promise((resolve, reject) => {
      const request = store.put(updated);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(updated);
    });
  }

  // CRUD: Delete
  async delete(storeName, id) {
    if (!this.db) throw new Error('Database not initialized');
    const store = this.getStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(true);
    });
  }

  // Get all records from store
  async getAll(storeName, filters = {}) {
    if (!this.db) throw new Error('Database not initialized');
    const store = this.getStore(storeName, 'readonly');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        let results = request.result;
        // Apply filters
        if (filters.projectId) {
          results = results.filter(r => r.projectId === filters.projectId);
        }
        if (filters.status) {
          results = results.filter(r => r.status === filters.status);
        }
        resolve(results);
      };
    });
  }

  // Get by index
  async getByIndex(storeName, indexName, value) {
    if (!this.db) throw new Error('Database not initialized');
    const store = this.getStore(storeName, 'readonly');
    const index = store.index(indexName);
    return new Promise((resolve, reject) => {
      const request = index.getAll(value);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Get store
  getStore(storeName, mode = 'readonly') {
    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  // Generate UUID v4
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Clear all stores
  async clear(storeName = null) {
    if (!this.db) throw new Error('Database not initialized');
    if (storeName) {
      const store = this.getStore(storeName, 'readwrite');
      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(true);
      });
    } else {
      // Clear all stores
      const transaction = this.db.transaction(Object.keys(this.stores), 'readwrite');
      return new Promise((resolve, reject) => {
        Object.keys(this.stores).forEach(storeName => {
          transaction.objectStore(storeName).clear();
        });
        transaction.onerror = () => reject(transaction.error);
        transaction.oncomplete = () => resolve(true);
      });
    }
  }
}

// Global database instance
const db = new DatabaseManager();
