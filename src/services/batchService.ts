import db, { generateId } from '../db/db';
import type { Batch } from '../types/schema';

export const batchService = {
    async createBatch(batch: Omit<Batch, '_id' | 'type' | 'status'>) {
        const newBatch: Batch = {
            _id: generateId('batch'),
            type: 'batch',
            status: 'planned',
            ...batch,
        };
        return await db.put(newBatch);
    },

    async getAllBatches() {
        const result = await db.find({
            selector: { type: 'batch' },
            sort: [{ '_id': 'desc' }] // Simple sort by ID (roughly time) for now
        });
        return result.docs as Batch[];
    },

    async updateBatch(batch: Batch) {
        return await db.put(batch);
    },

    async getBatch(id: string) {
        return await db.get<Batch>(id);
    },

    async deleteBatch(id: string) {
        const doc = await db.get(id);
        return await db.remove(doc);
    }
};
