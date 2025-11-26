import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { ingredientService } from '../services/ingredientService';
import type { Unit } from '../types/schema';

interface IngredientFormProps {
    onSave: () => void;
    onCancel: () => void;
}

export const IngredientForm: React.FC<IngredientFormProps> = ({ onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [unit, setUnit] = useState<Unit>('kg');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ingredientService.addIngredient({
                name,
                unit,
                currentPrice: parseFloat(price),
            });
            onSave();
            setName('');
            setPrice('');
        } catch (error) {
            console.error('Failed to save ingredient', error);
            alert('Failed to save ingredient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">New Ingredient</h3>
                <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="e.g. Wheat Flour"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value as Unit)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="g">Gram (g)</option>
                        <option value="L">Liter (L)</option>
                        <option value="ml">Milliliter (ml)</option>
                        <option value="pcs">Pieces (pcs)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Price</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">KES</span>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save Ingredient'}
                </button>
            </div>
        </form>
    );
};
