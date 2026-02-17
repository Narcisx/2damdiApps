import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DollarSign, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { transactionService } from '../services/transactionService';
import type { Transaction } from '../types';
import { useAuthStore } from '../store/useAuthStore';

const Dashboard = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTransactions();
    }, []);

    // Get first name safely
    const fullName = user?.user_metadata?.full_name || user?.email || 'Usuario';
    const firstName = fullName.split(' ')[0];

    const loadTransactions = async () => {
        try {
            const data = await transactionService.getTransactions();
            setTransactions(data);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalBalance = transactions.reduce((acc, curr) => {
        return curr.category?.type === 'income' ? acc + curr.amount : acc - curr.amount;
    }, 0);

    const totalIncome = transactions
        .filter(t => t.category?.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = transactions
        .filter(t => t.category?.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const incomeFormatted = totalIncome.toFixed(2);
    const expenseFormatted = totalExpense.toFixed(2);

    // Calculate percentages (simple ratio vs total volume for demo purposes, unrelated to time as we dont have history easily)
    const totalVolume = totalIncome + totalExpense;
    const incomePct = totalVolume > 0 ? ((totalIncome / totalVolume) * 100).toFixed(0) : "0";
    const expensePct = totalVolume > 0 ? ((totalExpense / totalVolume) * 100).toFixed(0) : "0";


    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Hola, <span className="text-indigo-600 dark:text-indigo-400">{firstName}</span> 👋
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Resumen de tu actividad financiera reciente</p>
                </div>
                <Link
                    to="/transactions/new"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 font-medium"
                >
                    <Plus className="h-5 w-5" />
                    <span>Nueva Transacción</span>
                </Link>
            </div>

            {/* Stats Cards - Modern Gradient Look */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance Card */}
                <div className="relative overflow-hidden bg-slate-900 rounded-2xl p-6 shadow-xl text-white group border border-slate-800">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-500 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4 text-indigo-200">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                <DollarSign className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-sm tracking-wide uppercase">{t('dashboard.balance')}</span>
                        </div>
                        <h3 className="text-4xl font-bold mb-1 tracking-tight">${totalBalance.toFixed(2)}</h3>
                        <div className="flex items-center text-sm text-indigo-300 mt-2">
                            <Activity className="h-4 w-4 mr-1" />
                            <span>Actualizado ahora mismo</span>
                        </div>
                    </div>
                </div>

                {/* Income Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-slate-700">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-sm uppercase tracking-wide text-gray-400 dark:text-slate-400">{t('dashboard.income')}</span>
                        </div>
                        <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> {incomePct}%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">+${incomeFormatted}</h3>
                </div>

                {/* Expense Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-slate-700">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
                            <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg">
                                <TrendingDown className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-sm uppercase tracking-wide text-gray-400 dark:text-slate-400">{t('dashboard.expense')}</span>
                        </div>
                        <span className="flex items-center text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-full">
                            <ArrowDownRight className="h-3 w-3 mr-1" /> {expensePct}%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">-${expenseFormatted}</h3>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('dashboard.recent_transactions')}</h2>
                    <Link to="/transactions" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">Ver todo</Link>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                            <Activity className="h-8 w-8 text-gray-300 dark:text-slate-500" />
                        </div>
                        {t('dashboard.no_transactions')}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50 dark:divide-slate-700">
                        {transactions.slice(0, 5).map((transaction) => (
                            <div key={transaction.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${transaction.category?.type === 'income'
                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20'
                                        : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:bg-rose-100 dark:group-hover:bg-rose-500/20'
                                        }`}>
                                        {transaction.category?.type === 'income' ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white mb-0.5">{transaction.description}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(transaction.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`block text-lg font-bold ${transaction.category?.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                        {transaction.category?.type === 'income' ? '+' : '-'}${transaction.amount}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
