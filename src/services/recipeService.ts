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

        try {
            // 1. Find all batches for this recipe
            const batchesResult = await db.find({
                selector: {
                    type: 'batch',
                    recipeId: recipe._id
                }
            });
            const batches = batchesResult.docs;
            const batchIds = batches.map(b => b._id);

            // 2. Find all sales for these batches
            let sales: any[] = [];
            if (batchIds.length > 0) {
                const salesResult = await db.find({
                    selector: {
                        type: 'sale',
                        batchId: { $in: batchIds }
                    }
                });
                sales = salesResult.docs;
            }

            // 3. Prepare bulk delete
            const toDelete = [
                recipe,
                ...batches,
                ...sales
            ].map(doc => ({ ...doc, _deleted: true }));

            return await db.bulkDocs(toDelete);
        } catch (error) {
            console.error("Error performing cascade delete:", error);
            throw error;
        }
    }
};
