import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { salesService } from '../services/salesService';
import { batchService } from '../services/batchService';
import { recipeService } from '../services/recipeService';
import type { Batch } from '../types/schema';

interface SalesFormProps {
    onSave: () => void;
    onCancel: () => void;
}

export const SalesForm: React.FC<SalesFormProps> = ({ onSave, onCancel }) => {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [recipes, setRecipes] = useState<Record<string, string>>({});
    const [selectedBatchId, setSelectedBatchId] = useState('');
    const [quantity, setQuantity] = useState<number>(0);
    const [unitPrice, setUnitPrice] = useState<number>(5); // Default price
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const [batchData, recipeData] = await Promise.all([
                batchService.getAllBatches(),
                recipeService.getAllRecipes()
            ]);
            // Filter for active batches (not completed? or all? let's show all for now)
            setBatches(batchData);

            const recipeMap: Record<string, string> = {};
            recipeData.forEach(r => recipeMap[r._id] = r.name);
            setRecipes(recipeMap);
        };
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await salesService.recordSale({
                batchId: selectedBatchId || undefined,
                date,
                quantitySold: quantity,
                unitPrice
            });
            onSave();
        } catch (error) {
            console.error('Failed to record sale', error);
            alert('Failed to record sale');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 animate-in fade-in slide-in-from-top-4 transition-colors">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Record New Sale</h3>
                <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <X size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source Batch (Optional)</label>
                    <select
                        value={selectedBatchId}
                        onChange={(e) => setSelectedBatchId(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                    >
                        <option value="">-- General Sale (No Batch) --</option>
                        {batches.map(b => (
                            <option key={b._id} value={b._id}>
                                {new Date(b.date).toLocaleDateString()} - {recipes[b.recipeId || ''] || 'Unknown'} ({b.targetYield} pcs)
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sale Date</label>
                    <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity Sold</label>
                    <input
                        type="number"
                        required
                        min="1"
                        value={quantity || ''}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit Price (KES)</label>
                    <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                    />
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total Revenue: <span className="font-bold text-green-600 dark:text-green-400">KES {(quantity * unitPrice).toFixed(2)}</span>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || quantity <= 0}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        <Save size={18} />
                        Record Sale
                    </button>
                </div>
            </div>
        </form>
    );
};
