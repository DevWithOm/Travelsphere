import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Wallet, Plus, Tag, AlertCircle, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTrip, addExpense } from '../api';

export default function Budget() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const tripId = searchParams.get('id');

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expenseForm, setExpenseForm] = useState({ category: 'Food', amount: '', description: '' });
    const [submitting, setSubmitting] = useState(false);

    const categories = ['Food', 'Accommodation', 'Transport', 'Activities', 'Souvenirs', 'Other'];
    const CATEGORY_COLORS = {
        'Food': '#f59e0b', // amber-500
        'Accommodation': '#3b82f6', // blue-500
        'Transport': '#10b981', // emerald-500
        'Activities': '#8b5cf6', // violet-500
        'Souvenirs': '#ec4899', // pink-500
        'Other': '#6b7280' // gray-500
    };

    const fetchTripData = useCallback(() => {
        getTrip(tripId)
            .then(res => {
                setTrip(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.response?.data?.detail || 'Expedition details missing.');
                setLoading(false);
            });
    }, [tripId]);

    useEffect(() => {
        if (!tripId) {
            setTimeout(() => setLoading(false), 0);
            return;
        }
        fetchTripData();
    }, [tripId, fetchTripData]);

    const totalSpent = useMemo(() => {
        if (!trip || !trip.expenses) return 0;
        return trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    }, [trip]);

    const expensesByCategory = useMemo(() => {
        if (!trip || !trip.expenses || trip.expenses.length === 0) return [];
        
        const aggregated = trip.expenses.reduce((acc, exp) => {
            if (!acc[exp.category]) {
                acc[exp.category] = 0;
            }
            acc[exp.category] += exp.amount;
            return acc;
        }, {});

        // Convert to array format for Recharts
        return Object.entries(aggregated)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value); // Sort by highest expense
    }, [trip]);


    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!expenseForm.amount) return;

        setSubmitting(true);
        try {
            const expenseData = {
                ...expenseForm,
                amount: parseFloat(expenseForm.amount)
            };
            const response = await addExpense(tripId, expenseData);

            if (response.status === 200) {
                setExpenseForm({ category: 'Food', amount: '', description: '' });
                fetchTripData(); // refresh the data
            }
        } catch (err) {
            console.error("Failed to ledger expense", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-vintage-leather">
                <div className="w-12 h-12 border-4 border-vintage-brass/30 border-t-vintage-leather rounded-full animate-spin mb-4"></div>
                <p className="font-mono text-lg animate-pulse">Consulting the ledgers...</p>
            </div>
        );
    }

    if (error || !tripId) {
        return (
            <div className="vintage-card max-w-2xl mx-auto text-center py-12">
                <AlertCircle className="w-16 h-16 text-vintage-accent mx-auto mb-4" />
                <h2 className="text-3xl font-serif font-bold text-vintage-ink mb-2">Record Not Found</h2>
                <p className="text-vintage-ink/70 font-mono mb-6 pb-6 border-b border-vintage-brass/20">
                    No trip identifier was provided, or the ledger could not be located.
                </p>
                <button onClick={() => navigate('/')} className="vintage-button">
                    Return to Planning Desk
                </button>
            </div>
        );
    }

    const remaining = trip.budget - totalSpent;
    const isOverBudget = remaining < 0;
    const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: trip.currency || 'USD' });

    // Custom Tooltip for the Pie Chart
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white/90 border border-vintage-brass/30 p-3 rounded shadow-lg backdrop-blur-sm">
                    <p className="font-serif font-bold text-vintage-ink mb-1">{data.name}</p>
                    <p className="font-mono text-vintage-leather">{currencyFormat.format(data.value)}</p>
                </div>
            );
        }
        return null;
    };


    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700 pb-12">

            {/* Dashboard Header - Analytics Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="vintage-card flex flex-col justify-center text-center transform hover:scale-105 transition-transform duration-300">
                    <span className="font-mono text-xs tracking-widest uppercase opacity-70 mb-1">Total Treasury</span>
                    <span className="text-4xl font-serif font-bold text-vintage-ink tracking-tight">{currencyFormat.format(trip.budget)}</span>
                    <div className="mt-2 text-xs font-mono text-vintage-ink/60">Allocated Budget</div>
                </div>

                <div className="vintage-card flex flex-col justify-center text-center transform hover:scale-105 transition-transform duration-300 bg-vintage-brass/5">
                    <span className="font-mono text-xs tracking-widest uppercase opacity-70 mb-1">Estimated Cost</span>
                    <span className="text-4xl font-serif font-bold text-vintage-leather tracking-tight">{currencyFormat.format(totalSpent)}</span>
                    <div className="mt-2 text-xs font-mono text-vintage-ink/60">Total Disbursed</div>
                </div>

                <div className={`vintage-card flex flex-col justify-center text-center transform hover:scale-105 transition-transform duration-300 ${isOverBudget ? 'bg-red-50 border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'bg-emerald-50 border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.05)]'}`}>
                    <span className="font-mono text-xs tracking-widest uppercase opacity-70 mb-1">Remaining Budget</span>
                    <span className={`text-4xl font-serif font-bold tracking-tight ${isOverBudget ? 'text-red-700' : 'text-emerald-700'}`}>
                        {currencyFormat.format(remaining)}
                    </span>
                    <div className={`mt-2 text-xs font-mono ${isOverBudget ? 'text-red-600/70' : 'text-emerald-700/70'}`}>
                       {isOverBudget ? 'Exceeding Limits' : 'Available Funds'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Ledger entry form */}
                <div className="lg:col-span-1 border-r border-vintage-brass/20 pr-0 lg:pr-8">
                    <div className="vintage-card sticky top-24 bg-white/60 backdrop-blur-md">
                        <h3 className="text-xl font-serif font-bold text-vintage-ink mb-6 pb-2 border-b border-vintage-brass/30 flex items-center">
                            <Plus className="mr-2 w-5 h-5 text-vintage-leather" /> Log Expenditure
                        </h3>

                        <form onSubmit={handleAddExpense} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold tracking-widest text-vintage-leather/80 uppercase mb-2">Category</label>
                                <div className="relative">
                                    <select
                                        value={expenseForm.category}
                                        onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                                        className="vintage-input appearance-none cursor-pointer"
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-vintage-leather">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold tracking-widest text-vintage-leather/80 uppercase mb-2">Amount</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 font-mono font-bold text-vintage-ink/60">{trip.currency || 'USD'}</span>
                                    <input
                                        type="number"
                                        required
                                        min="0.01" step="0.01"
                                        value={expenseForm.amount}
                                        onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                                        className="vintage-input pl-12 pr-3"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold tracking-widest text-vintage-leather/80 uppercase mb-2">Notes</label>
                                <input
                                    type="text"
                                    value={expenseForm.description}
                                    onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                                    className="vintage-input"
                                    placeholder="Optional details..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full vintage-button mt-6 shadow-md hover:shadow-lg transition-all ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                            >
                                {submitting ? 'Recording...' : 'Record to Ledger'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Dashboard Analytics & List */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Activity Cost Breakdown Chart */}
                    <div className="vintage-card bg-gradient-to-br from-white/80 to-vintage-brass/5">
                        <h3 className="text-xl font-serif font-bold text-vintage-ink mb-6 pb-2 border-b border-vintage-brass/30 flex items-center">
                            <PieChartIcon className="mr-2 w-5 h-5 text-vintage-leather" /> Activity Cost Breakdown
                        </h3>

                        {!trip.expenses || trip.expenses.length === 0 ? (
                             <div className="h-64 flex items-center justify-center text-vintage-ink/50 font-mono text-sm">
                                Awaiting expenditure data to render analytics.
                             </div>
                        ) : (
                            <div className="h-80 w-full animate-in fade-in duration-1000">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={expensesByCategory}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={3}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {expensesByCategory.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS['Other']} 
                                                    className="hover:opacity-80 transition-opacity duration-300 outline-none"
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend 
                                            verticalAlign="bottom" 
                                            height={36}
                                            iconType="circle"
                                            formatter={(value) => <span className="font-mono text-xs text-vintage-ink ml-1">{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Expenses List */}
                    <div className="vintage-card">
                        <h3 className="text-xl font-serif font-bold text-vintage-ink mb-6 pb-2 border-b border-vintage-brass/30 flex items-center">
                            <Wallet className="mr-2 w-5 h-5 text-vintage-leather" /> Recent Transactions
                        </h3>

                        {!trip.expenses || trip.expenses.length === 0 ? (
                            <div className="text-center py-10 opacity-70">
                                <div className="w-16 h-16 rounded-full bg-vintage-brass/10 flex items-center justify-center mx-auto mb-4">
                                     <Tag className="w-6 h-6 text-vintage-leather/50" />
                                </div>
                                <p className="font-serif italic text-vintage-ink text-lg">The ledger pages are bare.</p>
                                <p className="font-mono text-sm mt-2">Log your first expenditure using the form.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {/* Reversed to show newest first if we assume they are appended */}
                                {[...trip.expenses].reverse().map((exp, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white/60 rounded-lg border border-vintage-brass/20 shadow-sm transition-all hover:bg-white hover:shadow-md hover:-translate-y-0.5 group">
                                        <div className="flex items-center gap-4">
                                            <div 
                                                className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm"
                                                style={{ backgroundColor: CATEGORY_COLORS[exp.category] || CATEGORY_COLORS['Other'] }}
                                            >
                                                <span className="font-serif font-bold text-sm">{exp.category.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-vintage-ink font-serif text-lg group-hover:text-vintage-accent transition-colors">{exp.category}</p>
                                                {exp.description && <p className="text-xs font-mono text-vintage-ink/60 mt-0.5">{exp.description}</p>}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-mono font-bold text-lg text-vintage-ink">
                                                {currencyFormat.format(exp.amount)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}

