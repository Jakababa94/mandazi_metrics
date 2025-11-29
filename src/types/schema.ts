export type Unit = 'kg' | 'g' | 'L' | 'ml' | 'pcs';

export interface Ingredient {
    _id: string;
    _rev?: string;
    type: 'ingredient';
    name: string;
    unit: Unit;
    currentPrice: number;
    lastUpdated: string; // ISO Date
}

export interface RecipeIngredient {
    ingredientId: string;
    quantity: number;
    unit: Unit;
}

export interface Recipe {
    _id: string;
    _rev?: string;
    type: 'recipe';
    name: string;
    date: string; // ISO Date
    expectedYield: number;
    wastagePercent: number;
    ingredients: RecipeIngredient[];
}

export interface Batch {
    _id: string;
    _rev?: string;
    type: 'batch';
    recipeId?: string;
    date: string; // ISO Date
    targetYield: number;
    actualYield?: number;
    totalCost: number;
    costPerUnit?: number;
    status: 'planned' | 'in-progress' | 'completed';
    notes?: string;
}

export interface Sale {
    _id: string;
    _rev?: string;
    type: 'sale';
    batchId?: string;
    date: string; // ISO Date
    quantitySold: number;
    unitPrice: number;
    totalRevenue: number;
}

export interface FixedCost {
    _id: string;
    _rev?: string;
    type: 'fixed_cost';
    name: string;
    amount: number;
    period: 'monthly' | 'weekly';
    allocationMethod: 'per_batch' | 'production_hours';
}

export interface User {
    _id: string;
    _rev?: string;
    type: 'user';
    name: string;
    email: string;
    passwordHash: string; // In a real app, never store plain text. We'll simulate hash or store as is for this local demo but named 'Hash' to imply intent.
    createdAt: string;
}

export type DocType = Ingredient | Recipe | Batch | Sale | FixedCost | User;
