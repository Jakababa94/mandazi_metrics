import React, { useState, useEffect } from 'react';
import { Save, X, Calculator } from 'lucide-react';
import { recipeService } from '../services/recipeService';
import { batchService } from '../services/batchService';
import { ingredientService } from '../services/ingredientService';
import type { Recipe, Ingredient } from '../types/schema';

interface BatchFormProps {
    onSave: () => void;
    onCancel: () => void;
}

export const BatchForm: React.FC<BatchFormProps> = ({ onSave, onCancel }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipeId, setSelectedRecipeId] = useState('');
    const [targetYield, setTargetYield] = useState<number>(0);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    useEffect(() => {
        recipeService.getAllRecipes().then(setRecipes);
        ingredientService.getAllIngredients().then(setIngredients);
    }, []);

    const selectedRecipe = recipes.find(r => r._id === selectedRecipeId);

    const handleRecipeChange = (recipeId: string) => {
        setSelectedRecipeId(recipeId);
        const recipe = recipes.find(r => r._id === recipeId);
        if (recipe) {
            setTargetYield(recipe.expectedYield);
        }
    };

    const calculateEstimatedCost = () => {
        if (!selectedRecipe || !targetYield) return 0;

        const scaleFactor = targetYield / selectedRecipe.expectedYield;

        let totalCost = 0;
        selectedRecipe.ingredients.forEach(ri => {
            const ing = ingredients.find(i => i._id === ri.ingredientId);
            if (ing) {
                // Simple cost: qty * price (assuming unit match for MVP)
                // Apply wastage factor from recipe
                const rawCost = (ri.quantity * scaleFactor) * ing.currentPrice;
                const wastageMultiplier = 1 / (1 - (selectedRecipe.wastagePercent / 100));
                totalCost += rawCost * wastageMultiplier;
            }
        });

        return totalCost;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRecipe) return;

        setLoading(true);
        try {
            const estimatedCost = calculateEstimatedCost();

            await batchService.createBatch({
                recipeId: selectedRecipe._id,
                date,
                targetYield,
                totalCost: estimatedCost,
                // Initial cost per unit estimate
                costPerUnit: estimatedCost / targetYield
            });
            onSave();
        } catch (error) {
            console.error('Failed to start batch', error);
            alert('Failed to start batch');
        } finally {
            setLoading(false);
        }
    };

    const estCost = calculateEstimatedCost();

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 animate-in fade-in slide-in-from-top-4 transition-colors">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Start Production Batch</h3>
                <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <X size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Recipe</label>
                    <select
                        required
                        value={selectedRecipeId}
                        onChange={(e) => handleRecipeChange(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                    >
                        <option value="">-- Choose a recipe --</option>
                        {recipes.map(r => (
                            <option key={r._id} value={r._id}>{r.name} (Yield: {r.expectedYield})</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Production Date</label>
                    <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Yield (pcs)</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            required
                            min="1"
                            value={targetYield || ''}
                            onChange={(e) => setTargetYield(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                        />
                        {selectedRecipe && (
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                Scale: {(targetYield / selectedRecipe.expectedYield).toFixed(2)}x
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900/40 flex flex-col justify-center transition-colors">
                    <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-medium mb-1">
                        <Calculator size={16} /> Estimated Cost
                    </div>
                    <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-200">
                        KES {estCost.toFixed(2)}
                    </div>
                    <div className="text-sm text-indigo-600 dark:text-indigo-400">
                        ~ {(estCost / (targetYield || 1)).toFixed(2)} per unit
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || !selectedRecipe}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    <Save size={18} />
                    Start Batch
                </button>
            </div>
        </form>
    );
};
