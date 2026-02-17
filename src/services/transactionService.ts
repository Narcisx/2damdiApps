import { supabase } from './supabaseClient';
import type { Transaction } from '../types';

export const transactionService = {
    async getTransactions() {
        const { data, error } = await supabase
            .from('transactions')
            .select('*, category:categories(*)')
            .order('date', { ascending: false });

        if (error) throw error;
        return data as Transaction[];
    },

    async createTransaction(transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuario no autenticado');

        // 1. Create the main transaction
        const { data, error } = await supabase
            .from('transactions')
            .insert([{ ...transaction, user_id: user.id }])
            .select('*, category:categories(*)')
            .single();

        if (error) throw error;

        // 2. SAVINGS LOGIC (Auto-interception)
        try {
            // Import dynamically to avoid circular dependencies if any, or just use standard import at top if clean
            const { useSavingsStore } = await import('../store/useSavingsStore');
            const { categoryService } = await import('./categoryService');

            const savingsState = useSavingsStore.getState();

            // LOGIC A: Rounding (Redondeo) on Expenses
            if (savingsState.roundingEnabled && transaction.category_id && transaction.amount > 0) {
                // Fetch category type to ensure it's an expense
                // Optimization: In a real app we might have the category object already, but here we check type safely
                const { data: catData } = await supabase.from('categories').select('type').eq('id', transaction.category_id).single();

                if (catData?.type === 'expense') {
                    const amount = Number(transaction.amount);
                    const ceil = Math.ceil(amount);
                    if (ceil > amount) {
                        const diff = Number((ceil - amount).toFixed(2));
                        if (diff > 0) {
                            console.log(`[Savings] Rounding triggered: ${amount} -> ${ceil}. Saving ${diff}€`);

                            // Find or Create "Ahorro Automático" category
                            // We use a specific name/icon for savings
                            const categories = await categoryService.getCategories();
                            let savingCat = categories.find(c => c.name === 'Ahorro e Inversión' && c.type === 'expense');

                            if (!savingCat) {
                                savingCat = await categoryService.createCategory({
                                    name: 'Ahorro e Inversión',
                                    type: 'expense',
                                    icon: 'piggy-bank'
                                });
                            }

                            // Create the savings transaction
                            await supabase.from('transactions').insert([{
                                user_id: user.id,
                                amount: diff,
                                description: `💰 Redondeo: ${transaction.description}`,
                                category_id: savingCat.id,
                                date: transaction.date
                            }]);

                            // Update virtual invested amount
                            savingsState.setInvestedAmount(savingsState.investedAmount + diff);
                        }
                    }
                }
            }

            // LOGIC B: Retention (Retención) on Income
            if (savingsState.retentionEnabled && transaction.category_id && transaction.amount > 0) {
                const { data: catData } = await supabase.from('categories').select('type').eq('id', transaction.category_id).single();

                if (catData?.type === 'income') {
                    const amount = Number(transaction.amount);
                    const retentionAmount = Number((amount * (savingsState.retentionPercentage / 100)).toFixed(2));

                    if (retentionAmount > 0) {
                        console.log(`[Savings] Retention triggered: ${savingsState.retentionPercentage}% of ${amount}. Saving ${retentionAmount}€`);

                        // Find or Create "Ahorro Automático" category
                        const categories = await categoryService.getCategories();
                        let savingCat = categories.find(c => c.name === 'Ahorro e Inversión' && c.type === 'expense'); // Treated as expense from main balance to savings pot

                        if (!savingCat) {
                            savingCat = await categoryService.createCategory({
                                name: 'Ahorro e Inversión',
                                type: 'expense',
                                icon: 'piggy-bank'
                            });
                        }

                        // Create the savings transaction (Expense from main account)
                        await supabase.from('transactions').insert([{
                            user_id: user.id,
                            amount: retentionAmount,
                            description: `🏦 Retención Automática (${savingsState.retentionPercentage}%)`,
                            category_id: savingCat.id,
                            date: transaction.date
                        }]);

                        // Update virtual invested amount
                        savingsState.setInvestedAmount(savingsState.investedAmount + retentionAmount);
                    }
                }
            }

        } catch (err) {
            console.error('[Savings] Error processing savings logic:', err);
            // Don't block the main flow if savings logic fails
        }

        return data as Transaction;
    },

    async updateTransaction(id: string, updates: Partial<Transaction>) {
        const { data, error } = await supabase
            .from('transactions')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Transaction;
    },

    async deleteTransaction(id: string) {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
