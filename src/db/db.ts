import PouchDBDefault from 'pouchdb-browser';
import PouchFindDefault from 'pouchdb-find';
import type { DocType } from '../types/schema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PouchDB = ((PouchDBDefault as any).default || PouchDBDefault) as unknown as typeof PouchDBDefault;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PouchFind = ((PouchFindDefault as any).default || PouchFindDefault) as unknown as typeof PouchFindDefault;

PouchDB.plugin(PouchFind);

const db = new PouchDB<DocType>('mandazi_db');

export default db;

// Helper to generate IDs
export const generateId = (type: string) => `${type}_${crypto.randomUUID()}`;
