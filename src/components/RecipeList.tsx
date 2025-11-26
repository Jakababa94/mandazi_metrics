import React, { useEffect, useState } from 'react';
import { Plus, ChefHat, ArrowRight } from 'lucide-react';
import { recipeService } from '../services/recipeService';
import type { Recipe } from '../types/schema';
import { RecipeForm } from './RecipeForm';

export const RecipeList: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadRecipes = async () => {
        try {
            const data = await recipeService.getAllRecipes();
            setRecipes(data);
        } catch (error) {
            console.error('Failed to load recipes', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecipes();
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
                    <p className="text-gray-500">Manage your production templates</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    disabled={showForm}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                    <Plus size={20} />
                    New Recipe
                </button>
            </div>

            {showForm && (
                <RecipeForm
                    onSave={() => {
                        setShowForm(false);
                        loadRecipes();
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
            ) : recipes.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-sm">
                        <ChefHat size={32} className="text-indigo-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No recipes yet</h3>
                    <p className="text-gray-500 mb-4">Create a recipe to start production</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="text-indigo-600 font-medium hover:text-indigo-700"
                    >
                        Create your first recipe
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recipes.map((recipe) => (
                        <div key={recipe._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                        <ChefHat size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{recipe.name}</h3>
                                        <p className="text-sm text-gray-500">{recipe.ingredients.length} ingredients</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4 py-3 border-y border-gray-50">
                                <div>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Yield</span>
                                    <div className="font-semibold text-gray-900">{recipe.expectedYield} pcs</div>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Wastage</span>
                                    <div className="font-semibold text-gray-900">{recipe.wastagePercent}%</div>
                                </div>
                            </div>

                            <button className="w-full py-2 flex items-center justify-center gap-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors">
                                Start Production <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
