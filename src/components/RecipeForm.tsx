import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Trash2 } from 'lucide-react';
import { recipeService } from '../services/recipeService';
import { ingredientService } from '../services/ingredientService';
import type { Ingredient, RecipeIngredient } from '../types/schema';

interface RecipeFormProps {
    onSave: () => void;
    onCancel: () => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [expectedYield, setExpectedYield] = useState<number>(0);
    const [wastagePercent, setWastagePercent] = useState<number>(5);
    const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
    const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        ingredientService.getAllIngredients().then(setAvailableIngredients);
    }, []);

    const addIngredientRow = () => {
        if (availableIngredients.length === 0) return;
        setIngredients([
            ...ingredients,
            { ingredientId: availableIngredients[0]._id, quantity: 0, unit: availableIngredients[0].unit }
        ]);
    };

    const updateIngredientRow = (index: number, field: keyof RecipeIngredient, value: any) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };

        // If ingredient changes, update unit to match default
        if (field === 'ingredientId') {
            const ing = availableIngredients.find(i => i._id === value);
            if (ing) {
                newIngredients[index].unit = ing.unit;
            }
        }

        setIngredients(newIngredients);
    };

    const removeIngredientRow = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await recipeService.addRecipe({
                name,
                date,
                expectedYield,
                wastagePercent,
                ingredients
            });
            onSave();
        } catch (error) {
            console.error('Failed to save recipe', error);
            alert('Failed to save recipe');
        } finally {
            setLoading(false);
        }
    };

    // Calculate estimated cost (simple version without wastage for preview)
    const estimatedCost = ingredients.reduce((acc, item) => {
        const ing = availableIngredients.find(i => i._id === item.ingredientId);
        if (!ing) return acc;
        // Simple cost calc - assumes unit match for now (TODO: conversion)
        return acc + (item.quantity * ing.currentPrice);
    }, 0);

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 animate-in fade-in slide-in-from-top-4 transition-colors">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">New Recipe</h3>
                <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <X size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipe Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                        placeholder="e.g. Standard Mandazi Batch"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Yield (pcs)</label>
                    <input
                        type="number"
                        required
                        min="1"
                        value={expectedYield || ''}
                        onChange={(e) => setExpectedYield(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wastage %</label>
                    <input
                        type="number"
                        required
                        min="0"
                        max="100"
                        value={wastagePercent}
                        onChange={(e) => setWastagePercent(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                    />
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ingredients</label>
                    <button
                        type="button"
                        onClick={addIngredientRow}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1"
                    >
                        <Plus size={16} /> Add Ingredient
                    </button>
                </div>

                <div className="space-y-3">
                    {ingredients.map((row, index) => (
                        <div key={index} className="flex gap-3 items-start">
                            <div className="flex-1">
                                <select
                                    value={row.ingredientId}
                                    onChange={(e) => updateIngredientRow(index, 'ingredientId', e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                                >
                                    {availableIngredients.map(ing => (
                                        <option key={ing._id} value={ing._id}>{ing.name} ({ing.unit})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-24">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={row.quantity || ''}
                                    onChange={(e) => updateIngredientRow(index, 'quantity', parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                                    placeholder="Qty"
                                />
                            </div>
                            <div className="w-24 pt-2 text-sm text-gray-500 dark:text-gray-400">
                                {row.unit}
                            </div>
                            <button
                                type="button"
                                onClick={() => removeIngredientRow(index)}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {ingredients.length === 0 && (
                        <div className="text-center py-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-sm transition-colors">
                            No ingredients added yet.
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Est. Raw Cost: <span className="font-semibold text-gray-900 dark:text-white">KES {estimatedCost.toFixed(2)}</span>
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
                        disabled={loading || ingredients.length === 0}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        <Save size={18} />
                        Save Recipe
                    </button>
                </div>
            </div>
        </form>
    );
};
