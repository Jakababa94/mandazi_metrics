import db, { generateId } from '../db/db';
import type { Recipe } from '../types/schema';

export const recipeService = {
    async addRecipe(recipe: Omit<Recipe, '_id' | 'type'>) {
        const newRecipe: Recipe = {
            _id: generateId('recipe'),
            type: 'recipe',
            ...recipe,
        };
        return await db.put(newRecipe);
    },

    async getAllRecipes() {
        const result = await db.find({
            selector: { type: 'recipe' },
        });
        return result.docs as Recipe[];
    },

    async getRecipe(id: string) {
        return await db.get<Recipe>(id);
    },

    async updateRecipe(recipe: Recipe) {
        return await db.put(recipe);
    },

    async deleteRecipe(recipe: Recipe) {
        if (!recipe._rev) {
            throw new Error("Cannot delete recipe without _rev");
        }
        return await db.remove(recipe._id, recipe._rev);
    }
};
