import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, PieChart, Activity, Plus, Trash2 } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend
} from 'recharts';
import { salesService } from '../services/salesService';
import { batchService } from '../services/batchService';
import { SalesForm } from './SalesForm';
import type { Sale, Batch } from '../types/schema';

export const Dashboard: React.FC = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [showSaleForm, setShowSaleForm] = useState(false);
    // const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [salesData, batchData] = await Promise.all([
                salesService.getAllSales(),
                batchService.getAllBatches()
            ]);
            setSales(salesData);
            setBatches(batchData);
        } catch (error) {
            console.error('Failed to load dashboard data', error);
        } finally {
            // setLoading(false);
        }
    };

    const handleDeleteSale = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this sale?')) {
            try {
                await salesService.deleteSale(id);
                loadData();
            } catch (error) {
                console.error('Failed to delete sale', error);
            }
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Calculate Metrics
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalRevenue, 0);
    const totalCost = batches.reduce((sum, b) => sum + b.totalCost, 0);
    const netProfit = totalRevenue - totalCost;
    const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Prepare Chart Data (Daily)
    const dailyDataMap: Record<string, { date: string, revenue: number, cost: number }> = {};

    // Aggregate Sales
    sales.forEach(s => {
        if (!dailyDataMap[s.date]) dailyDataMap[s.date] = { date: s.date, revenue: 0, cost: 0 };
        dailyDataMap[s.date].revenue += s.totalRevenue;
    });

    // Aggregate Costs (Batches)
    batches.forEach(b => {
        if (!dailyDataMap[b.date]) dailyDataMap[b.date] = { date: b.date, revenue: 0, cost: 0 };
        dailyDataMap[b.date].cost += b.totalCost;
    });

    const chartData = Object.values(dailyDataMap).sort((a, b) => a.date.localeCompare(b.date));

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Business Overview & Financials</p>
                </div>
                <button
                    onClick={() => setShowSaleForm(true)}
                    disabled={showSaleForm}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    Record Sale
                </button>
            </div>

            {showSaleForm && (
                <SalesForm
                    onSave={() => {
                        setShowSaleForm(false);
                        loadData();
                    }}
                    onCancel={() => setShowSaleForm(false)}
                />
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">KES {totalRevenue.toLocaleString()}</div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                            <Activity size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Costs</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">KES {totalCost.toLocaleString()}</div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Profit</span>
                    </div>
                    <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        KES {netProfit.toLocaleString()}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                            <PieChart size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Gross Margin</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{margin.toFixed(1)}%</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Revenue vs Costs (Daily)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                <XAxis dataKey="date" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                    itemStyle={{ color: '#F3F4F6' }}
                                />
                                <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                                <Bar dataKey="revenue" fill="#16a34a" name="Revenue" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="cost" fill="#dc2626" name="Cost" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Profit Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                <XAxis dataKey="date" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                    itemStyle={{ color: '#F3F4F6' }}
                                />
                                <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                                <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="cost" stroke="#dc2626" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Sales List */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Sales</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                            <tr>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Quantity</th>
                                <th className="px-6 py-3 font-medium">Unit Price</th>
                                <th className="px-6 py-3 font-medium">Total</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {sales.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No sales recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                sales.map((sale) => (
                                    <tr key={sale._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                            {new Date(sale.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                            {sale.quantitySold}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                            KES {sale.unitPrice.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                            KES {sale.totalRevenue.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDeleteSale(sale._id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete Sale"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
