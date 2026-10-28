import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getInitialSeedData } from '../data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

// In-memory cache + file sync to prevent race conditions
let memoryDb = null;
let writeQueue = Promise.resolve();

/**
 * Ensures DB is initialized with seed data if file does not exist
 */
export async function initDb() {
  try {
    const fileExists = await fs.access(DB_PATH).then(() => true).catch(() => false);
    if (!fileExists) {
      console.log('⚡ Initializing database with realistic seed data...');
      const initialData = await getInitialSeedData();
      await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      memoryDb = initialData;
      console.log('✅ Database initialized successfully at:', DB_PATH);
    } else {
      const content = await fs.readFile(DB_PATH, 'utf-8');
      memoryDb = JSON.parse(content);
      console.log('✅ Database loaded successfully from file.');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

/**
 * Internal helper to persist in-memory DB to disk safely
 */
async function persistDb() {
  writeQueue = writeQueue.then(async () => {
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(memoryDb, null, 2), 'utf-8');
    } catch (err) {
      console.error('❌ Failed to persist db.json:', err);
    }
  });
  return writeQueue;
}

/**
 * Service API Abstraction
 */
export const db = {
  async getCollection(collectionName) {
    if (!memoryDb) await initDb();
    return memoryDb[collectionName] || [];
  },

  async find(collectionName, filterFn = () => true) {
    if (!memoryDb) await initDb();
    const list = memoryDb[collectionName] || [];
    return list.filter(filterFn);
  },

  async findOne(collectionName, filterFn) {
    if (!memoryDb) await initDb();
    const list = memoryDb[collectionName] || [];
    return list.find(filterFn) || null;
  },

  async findById(collectionName, id) {
    if (!memoryDb) await initDb();
    const list = memoryDb[collectionName] || [];
    return list.find(item => item.id === id) || null;
  },

  async insert(collectionName, item) {
    if (!memoryDb) await initDb();
    if (!memoryDb[collectionName]) {
      memoryDb[collectionName] = [];
    }
    memoryDb[collectionName].push(item);
    await persistDb();
    return item;
  },

  async update(collectionName, id, updates) {
    if (!memoryDb) await initDb();
    const list = memoryDb[collectionName] || [];
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    await persistDb();
    return list[index];
  },

  async remove(collectionName, id) {
    if (!memoryDb) await initDb();
    const list = memoryDb[collectionName] || [];
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return false;

    const removed = list.splice(index, 1);
    await persistDb();
    return removed[0];
  },

  async replaceCollection(collectionName, newArray) {
    if (!memoryDb) await initDb();
    memoryDb[collectionName] = newArray;
    await persistDb();
    return newArray;
  }
};

