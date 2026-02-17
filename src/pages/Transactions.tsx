import { useEffect, useState } from 'react';
import { transactionService } from '../services/transactionService';
import { useTranslation } from 'react-i18next';
import { Edit2, Trash2, Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Transaction } from '../types';

const Transactions = () => {
    const { t } = useTranslation();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [showFilters, setShowFilters] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        loadTransactions();
    }, []);

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

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar esta transacción?')) {
            try {
                await transactionService.deleteTransaction(id);
                setTransactions(transactions.filter(t => t.id !== id));
            } catch (error) {
                console.error('Error deleting transaction:', error);
            }
        }
    };

    // Get unique categories for filter dropdown
    const uniqueCategories = transactions
        .map(t => t.category?.name || 'General')
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category?.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = categoryFilter ? (t.category?.name || 'General') === categoryFilter : true;

        const matchesDate = dateFilter ? t.date === dateFilter : true;

        return matchesSearch && matchesCategory && matchesDate;
    });

    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setDateFilter('');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{t('transactions.title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Gestiona todos tus movimientos</p>
                </div>

                <Link
                    to="/transactions/new"
                    className="bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-slate-900/10 flex items-center gap-2 transition-all active:scale-95 font-medium"
                >
                    <Plus className="h-5 w-5" />
                    <span>Nueva Transacción</span>
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4 transition-colors">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Buscar transacciones..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2.5 border rounded-lg transition-colors flex items-center gap-2 font-medium ${showFilters
                            ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-200 dark:border-indigo-500/50 text-indigo-600 dark:text-indigo-400'
                            : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600'
                            }`}
                    >
                        <Filter className="h-4 w-4" />
                        <span className="hidden md:inline">Filtros</span>
                        {(categoryFilter || dateFilter) && (
                            <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                        )}
                    </button>
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-200">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Categoría</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-3 text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            >
                                <option value="">Todas</option>
                                {uniqueCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Fecha</label>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-3 text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={clearFilters}
                                className="w-full py-2.5 px-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-lg"
                            >
                                Limpiar Filtros
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
                {loading ? (
                    <div className="p-12 text-center text-slate-400 dark:text-slate-500">Cargando...</div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="p-16 text-center text-slate-400 dark:text-slate-500">
                        No se encontraron transacciones
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Descripción</th>
                                    <th className="px-6 py-4">Categoría</th>
                                    <th className="px-6 py-4 text-right">Monto</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                                {filteredTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span>{new Date(transaction.date).toLocaleDateString()}</span>
                                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                                    {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900 dark:text-white">{transaction.description}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200">
                                                {transaction.category?.name || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-bold ${transaction.category?.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                                {transaction.category?.type === 'income' ? '+' : '-'}${transaction.amount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    to={`/transactions/edit/${transaction.id}`}
                                                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(transaction.id)}
                                                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;
