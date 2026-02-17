import { useState, useEffect } from 'react';
import { useSavingsStore } from '../store/useSavingsStore';
import { PiggyBank, TrendingUp, DollarSign, Wallet } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Savings = () => {
    const {
        roundingEnabled,
        toggleRounding,
        retentionEnabled,
        toggleRetention,
        retentionPercentage,
        setRetentionPercentage,
        investedAmount,
        selectedFund,
        setSelectedFund
    } = useSavingsStore();

    // Real Data State
    const [history, setHistory] = useState<any[]>([]);
    const [realBalance, setRealBalance] = useState(0);

    useEffect(() => {
        loadSavingsHistory();
    }, []);

    const loadSavingsHistory = async () => {
        try {
            // Import dynamically or use service
            const { transactionService } = await import('../services/transactionService');
            const allTransactions = await transactionService.getTransactions();

            // Filter for "Ahorro e Inversión"
            const savingsTx = allTransactions.filter(t => t.category?.name === 'Ahorro e Inversión');

            setHistory(savingsTx);

            // Calculate real balance
            const total = savingsTx.reduce((sum, t) => sum + Number(t.amount), 0);
            setRealBalance(total);

            // Sync with store if needed, but display real balance
            if (total !== investedAmount) {
                useSavingsStore.getState().setInvestedAmount(total);
            }

        } catch (error) {
            console.error('Error loading savings history:', error);
        }
    };

    // Mock data for charts
    const dataSP500 = [
        { name: 'Jan', value: 4000 }, { name: 'Feb', value: 4100 },
        { name: 'Mar', value: 4050 }, { name: 'Apr', value: 4300 },
        { name: 'May', value: 4450 }, { name: 'Jun', value: 4600 },
    ];

    const dataTech = [
        { name: 'Jan', value: 12000 }, { name: 'Feb', value: 11500 },
        { name: 'Mar', value: 13000 }, { name: 'Apr', value: 14200 },
        { name: 'May', value: 13800 }, { name: 'Jun', value: 15500 },
    ];

    const funds = [
        { id: 'sp500', name: 'S&P 500 Index', return: '+12.4%', color: '#10b981', risk: 'Medio' },
        { id: 'tech', name: 'Global Tech ETF', return: '+24.8%', color: '#6366f1', risk: 'Alto' },
        { id: 'green', name: 'Green Energy', return: '+8.2%', color: '#f59e0b', risk: 'Bajo' },
    ];

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Ahorro e Inversión</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Automatiza tu futuro financiero</p>
            </div>

            {/* Total Balance Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <PiggyBank className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <p className="text-indigo-100 mb-1 font-medium">Patrimonio Acumulado</p>
                    <h2 className="text-4xl font-bold mb-4">{realBalance.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</h2>
                    <div className="flex gap-2">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" /> +124.50€ este mes
                        </span>
                    </div>
                </div>
            </div>

            {/* Auto-Savings Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rounding Card */}
                <div className={`p-6 rounded-2xl border transition-all ${roundingEnabled ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-500/30' : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl">
                            <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={roundingEnabled} onChange={toggleRounding} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Redondeo Automático</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        De 1,80€ a 2,00€ → <span className="font-semibold text-emerald-600">0,20€</span> al ahorro.
                    </p>
                    <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 py-1 px-2 rounded-lg inline-block">
                        Pasivo activado
                    </div>
                </div>

                {/* Retention Card */}
                <div className={`p-6 rounded-2xl border transition-all ${retentionEnabled ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-500/30' : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl">
                            <Wallet className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={retentionEnabled} onChange={toggleRetention} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Retención de Ingresos</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Ahorra un porcentaje de cada ingreso que recibas.
                    </p>
                    {retentionEnabled && (
                        <div>
                            <div className="flex justify-between text-sm mb-1 text-slate-700 dark:text-slate-300 font-medium">
                                <span>Porcentaje</span>
                                <span>{retentionPercentage}%</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={retentionPercentage}
                                onChange={(e) => setRetentionPercentage(Number(e.target.value))}
                                className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer dark:bg-indigo-900"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Investment Funds */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-500" />
                    Fondos Disponibles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {funds.map((fund) => (
                        <div
                            key={fund.id}
                            onClick={() => setSelectedFund(fund.id as any)}
                            className={`cursor-pointer p-4 rounded-xl border transition-all ${selectedFund === fund.id ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-300'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`w-3 h-3 rounded-full`} style={{ backgroundColor: fund.color }}></span>
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{fund.risk}</span>
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-white">{fund.name}</h3>
                            <div className="mt-2 text-2xl font-bold text-emerald-500">{fund.return}</div>
                            <p className="text-xs text-slate-400">Rentabilidad anual</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-6">Proyección de Crecimiento</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedFund === 'tech' ? dataTech : dataSP500}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={selectedFund === 'tech' ? '#6366f1' : '#10b981'} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={selectedFund === 'tech' ? '#6366f1' : '#10b981'} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={selectedFund === 'tech' ? '#6366f1' : '#10b981'}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Savings History List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-white">Historial de Ahorro</h3>
                </div>
                {history.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                        Aún no tienes movimientos de ahorro.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Concepto</th>
                                    <th className="px-6 py-4 text-right">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {history.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            <div className="flex flex-col">
                                                <span>{new Date(tx.date).toLocaleDateString()}</span>
                                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                                    {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{tx.description}</td>
                                        <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                                            +{Number(tx.amount).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div >
    );
};

export default Savings;
