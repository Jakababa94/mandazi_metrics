import React, { useEffect, useState } from 'react';
import { Plus, Package, Trash } from 'lucide-react';
import { ingredientService } from '../services/ingredientService';
import type { Ingredient } from '../types/schema';
import { IngredientForm } from './IngredientForm';

export const IngredientList: React.FC = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadIngredients = async () => {
        try {
            const data = await ingredientService.getAllIngredients();
            setIngredients(data);
        } catch (error) {
            console.error('Failed to load ingredients', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (ingredient: Ingredient) => {
        if (window.confirm(`Are you sure you want to delete "${ingredient.name}"?`)) {
            try {
                await ingredientService.deleteIngredient(ingredient);
                loadIngredients();
            } catch (error) {
                console.error('Failed to delete ingredient', error);
                alert('Failed to delete ingredient');
            }
        }
    };

    useEffect(() => {
        loadIngredients();
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ingredients</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your pantry and current prices</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    disabled={showForm}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                    <Plus size={20} />
                    Add Ingredient
                </button>
            </div>

            {showForm && (
                <IngredientForm
                    onSave={() => {
                        setShowForm(false);
                        loadIngredients();
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
            ) : ingredients.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors">
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-full inline-block mb-4 shadow-sm">
                        <Package size={32} className="text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No ingredients yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Add your first ingredient to get started</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300"
                    >
                        Add an ingredient
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ingredients.map((ing) => (
                        <div key={ing._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group relative">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
                                    <Package size={20} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                                        {ing.unit}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(ing)}
                                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                        title="Delete Ingredient"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{ing.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Last updated: {new Date(ing.lastUpdated).toLocaleDateString()}</p>

                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">KES {ing.currentPrice.toFixed(2)}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">/ {ing.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
