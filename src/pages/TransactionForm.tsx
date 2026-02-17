import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { transactionService } from '../services/transactionService';
import { categoryService } from '../services/categoryService';
import type { Category } from '../services/categoryService';
import { ArrowLeft, Save, FileText, DollarSign, Tag } from 'lucide-react';

const TransactionForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Default form data
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        date: new Date().toISOString(), // Internal only, not shown
        type: 'expense' as 'income' | 'expense',
        category_id: ''
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalCategoryId = formData.category_id;

            // Simple auto-assign if list is not empty and nothing selected
            if (!finalCategoryId) {
                const defaultCat = categories.find(c => c.type === formData.type);
                if (defaultCat) finalCategoryId = defaultCat.id;
            }

            if (!finalCategoryId) {
                // Fallback: Create a temporary category "General" if absolutely needed
                if (categories.length === 0 || !categories.find(c => c.type === formData.type)) {
                    const newCat = await categoryService.createCategory({
                        name: 'General',
                        type: formData.type,
                        icon: 'circle'
                    });
                    finalCategoryId = newCat.id;
                }
            }

            const transactionData = {
                amount: parseFloat(formData.amount),
                description: formData.description,
                // ALWAYS use current time for new transactions. Keep original for edits.
                date: id ? formData.date : new Date().toISOString(),
                category_id: finalCategoryId,
            };

            if (id) {
                await transactionService.updateTransaction(id, transactionData);
            } else {
                await transactionService.createTransaction({
                    ...transactionData,
                } as any);
            }
            navigate('/', { replace: true });
        } catch (error: any) {
            console.error('Error saving transaction:', error);
            alert(`Error al guardar: ${error.message || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    };

    // Filter by type AND deduplicate by name to prevent UI clutter
    const filteredCategories = categories
        .filter(c => c.type === formData.type)
        .reduce((acc, current) => {
            const x = acc.find(item => item.name === current.name);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, [] as Category[])
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="max-w-2xl mx-auto py-8 text-slate-900 dark:text-white">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 font-medium transition-colors"
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
            </button>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/20 border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
                <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-6 border-b border-slate-100 dark:border-slate-700">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                        {id ? 'Editar Transacción' : 'Nueva Transacción'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Type Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Tipo</label>
                        <div className="flex gap-4 p-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'expense', category_id: '' })}
                                className={`flex-1 py-3 rounded-lg font-medium transition-all ${formData.type === 'expense'
                                    ? 'bg-white dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-sm border border-slate-100 dark:border-rose-500/50'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                            >
                                Gasto
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'income', category_id: '' })}
                                className={`flex-1 py-3 rounded-lg font-medium transition-all ${formData.type === 'income'
                                    ? 'bg-white dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-100 dark:border-emerald-500/50'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                            >
                                Ingreso
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Amount - SPANS FULL WIDTH NOW */}
                        <div className="col-span-full md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Monto</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5" />
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white font-medium placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>

                        {/* Date - REMOVED PER USER REQUEST */}

                        {/* Category */}
                        <div className="col-span-full">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Categoría</label>
                            <div className="relative">
                                <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5" />
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none"
                                >
                                    <option value="" className="bg-white dark:bg-slate-800">Seleccionar categoría</option>
                                    {filteredCategories.map(cat => (
                                        <option key={cat.id} value={cat.id} className="bg-white dark:bg-slate-800">{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="col-span-full">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Descripción</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5" />
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="Ej. Compra semanal"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 transform active:scale-[0.99] transition-all"
                        >
                            <Save className="h-5 w-5" />
                            {loading ? 'Guardando...' : 'Guardar Operación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;
