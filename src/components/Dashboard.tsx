import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, PieChart, Activity, Plus } from 'lucide-react';
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
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Business Overview & Financials</p>
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
                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Revenue</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">KES {totalRevenue.toLocaleString()}</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <Activity size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Costs</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">KES {totalCost.toLocaleString()}</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Net Profit</span>
                    </div>
                    <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        KES {netProfit.toLocaleString()}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <PieChart size={20} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Gross Margin</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{margin.toFixed(1)}%</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue vs Costs (Daily)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#16a34a" name="Revenue" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="cost" fill="#dc2626" name="Cost" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="cost" stroke="#dc2626" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
