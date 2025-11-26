import db, { generateId } from '../db/db';
import type { Ingredient } from '../types/schema';

export const ingredientService = {
    async addIngredient(ingredient: Omit<Ingredient, '_id' | 'type' | 'lastUpdated'>) {
        const newIngredient: Ingredient = {
            _id: generateId('ingredient'),
            type: 'ingredient',
            ...ingredient,
            lastUpdated: new Date().toISOString(),
        };
        return await db.put(newIngredient);
    },

    async getAllIngredients() {
        const result = await db.find({
            selector: { type: 'ingredient' },
        });
        return result.docs as Ingredient[];
    },

    async updateIngredient(ingredient: Ingredient) {
        ingredient.lastUpdated = new Date().toISOString();
        return await db.put(ingredient);
    },

    async deleteIngredient(ingredient: Ingredient) {
        if (!ingredient._rev) throw new Error('Document revision is missing');
        return await db.remove(ingredient._id, ingredient._rev);
    }
};
