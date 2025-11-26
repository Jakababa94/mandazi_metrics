import React, { useEffect, useState } from 'react';
import { Plus, Factory, Calendar, Trash2 } from 'lucide-react';
import { batchService } from '../services/batchService';
import { recipeService } from '../services/recipeService';
import type { Batch } from '../types/schema';
import { BatchForm } from './BatchForm';

export const BatchList: React.FC = () => {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [recipes, setRecipes] = useState<Record<string, string>>({});
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [batchData, recipeData] = await Promise.all([
                batchService.getAllBatches(),
                recipeService.getAllRecipes()
            ]);
            setBatches(batchData);

            const recipeMap: Record<string, string> = {};
            recipeData.forEach(r => recipeMap[r._id] = r.name);
            setRecipes(recipeMap);
        } catch (error) {
            console.error('Failed to load batches', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const getStatusColor = (status: Batch['status']) => {
        switch (status) {
            case 'planned': return 'bg-blue-100 text-blue-700';
            case 'in-progress': return 'bg-yellow-100 text-yellow-700';
            case 'completed': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this batch?')) {
            try {
                await batchService.deleteBatch(id);
                loadData();
            } catch (error) {
                console.error('Failed to delete batch', error);
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Production</h1>
                    <p className="text-gray-500">Track your baking batches</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    disabled={showForm}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                    <Plus size={20} />
                    Start Batch
                </button>
            </div>

            {showForm && (
                <BatchForm
                    onSave={() => {
                        setShowForm(false);
                        loadData();
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
            ) : batches.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-sm">
                        <Factory size={32} className="text-indigo-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No production history</h3>
                    <p className="text-gray-500 mb-4">Start your first batch to track costs</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="text-indigo-600 font-medium hover:text-indigo-700"
                    >
                        Start a batch
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {batches.map((batch) => (
                        <div key={batch._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                    <Factory size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-900 text-lg">
                                            {batch.recipeId ? recipes[batch.recipeId] : 'Unknown Recipe'}
                                        </h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wide ${getStatusColor(batch.status)}`}>
                                            {batch.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} /> {new Date(batch.date).toLocaleDateString()}
                                        </span>
                                        <span>
                                            Target: <strong>{batch.targetYield} pcs</strong>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Total Cost</div>
                                    <div className="font-bold text-gray-900">KES {batch.totalCost.toFixed(2)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Cost / Unit</div>
                                    <div className="font-bold text-indigo-600">KES {batch.costPerUnit?.toFixed(2)}</div>
                                </div>
                                <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    Details
                                </button>
                                <button
                                    onClick={() => handleDelete(batch._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Batch"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
