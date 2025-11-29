import db, { generateId } from '../db/db';
import type { Sale } from '../types/schema';
import { batchService } from './batchService';

export const salesService = {
    async recordSale(sale: Omit<Sale, '_id' | 'type' | 'totalRevenue'>) {
        const newSale: Sale = {
            _id: generateId('sale'),
            type: 'sale',
            ...sale,
            totalRevenue: sale.quantitySold * sale.unitPrice
        };

        const result = await db.put(newSale);

        if (sale.batchId) {
            try {
                const batch = await batchService.getBatch(sale.batchId);
                if (batch) {
                    batch.status = 'completed';
                    await batchService.updateBatch(batch);
                }
            } catch (error) {
                console.error('Failed to autocomplete batch', error);
            }
        }

        return result;
    },

    async getAllSales() {
        const result = await db.find({
            selector: { type: 'sale' },
            sort: [{ '_id': 'desc' }]
        });
        return result.docs as Sale[];
    },

    async getSalesByBatch(batchId: string) {
        const result = await db.find({
            selector: {
                type: 'sale',
                batchId: batchId
            }
        });
        return result.docs as Sale[];
    },

    async deleteSale(id: string) {
        const doc = await db.get(id);
        return await db.remove(doc);
    }
};
