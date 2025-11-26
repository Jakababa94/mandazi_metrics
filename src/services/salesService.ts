import db, { generateId } from '../db/db';
import type { Sale } from '../types/schema';

export const salesService = {
    async recordSale(sale: Omit<Sale, '_id' | 'type' | 'totalRevenue'>) {
        const newSale: Sale = {
            _id: generateId('sale'),
            type: 'sale',
            ...sale,
            totalRevenue: sale.quantitySold * sale.unitPrice
        };
        return await db.put(newSale);
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
    }
};
