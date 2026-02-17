import { supabase } from './supabaseClient';

export interface Category {
    id: string;
    name: string;
    type: 'income' | 'expense';
    icon?: string;
}

export const categoryService = {
    isSeeding: false,

    async getCategories() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        let { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) throw error;
        if (!data) return [];

        // 1. CLEANUP: Check for duplicates immediately
        const uniqueKeys = new Set(data.map(c => `${c.name}-${c.type}`));
        if (data.length > uniqueKeys.size) {
            console.log('Duplicates detected in DB. Running cleanup...');
            await this.cleanupDuplicates(data);

            // Refetch fresh data after cleanup
            const { data: cleanData, error: cleanError } = await supabase
                .from('categories')
                .select('*')
                .order('name');
            if (cleanError) throw cleanError;
            data = cleanData || [];
        }

        // 2. SEEDING: If categories are scarce (<= 2) and not currently seeding
        if (data.length <= 2 && !this.isSeeding) {
            this.isSeeding = true;
            try {
                console.log('Few categories found. Seeding defaults...');
                await this.ensureDefaultCategories(user.id, data);

                // Fetch again after seeding
                const { data: newData, error: newError } = await supabase
                    .from('categories')
                    .select('*')
                    .order('name');

                if (newError) throw newError;
                return newData as Category[];
            } finally {
                this.isSeeding = false;
            }
        }

        return data as Category[];
    },

    async cleanupDuplicates(categories: Category[]) {
        const seen = new Set<string>();
        const idsToDelete: string[] = [];

        for (const cat of categories) {
            const key = `${cat.name}-${cat.type}`;
            if (seen.has(key)) {
                idsToDelete.push(cat.id);
            } else {
                seen.add(key);
            }
        }

        if (idsToDelete.length > 0) {
            console.log(`Removing ${idsToDelete.length} duplicate categories...`);
            const { error } = await supabase
                .from('categories')
                .delete()
                .in('id', idsToDelete);

            if (error) console.error('Error cleaning duplicates:', error);
        }
    },

    async ensureDefaultCategories(userId: string, existingCategories: Category[]) {
        const defaults = [
            // GASTOS
            { name: 'Alimentación', type: 'expense', icon: 'utensils', user_id: userId },
            { name: 'Transporte', type: 'expense', icon: 'bus', user_id: userId },
            { name: 'Vivienda', type: 'expense', icon: 'home', user_id: userId },
            { name: 'Entretenimiento', type: 'expense', icon: 'film', user_id: userId },
            { name: 'Salud', type: 'expense', icon: 'heart', user_id: userId },
            { name: 'Educación', type: 'expense', icon: 'book', user_id: userId },
            { name: 'Compras', type: 'expense', icon: 'shopping-bag', user_id: userId },
            { name: 'Servicios', type: 'expense', icon: 'wifi', user_id: userId },
            { name: 'Restaurantes', type: 'expense', icon: 'coffee', user_id: userId },
            { name: 'Viajes', type: 'expense', icon: 'map', user_id: userId },
            { name: 'Otros Gastos', type: 'expense', icon: 'circle', user_id: userId },
            // INGRESOS
            { name: 'Freelance', type: 'income', icon: 'laptop', user_id: userId },
            { name: 'Nómina', type: 'income', icon: 'briefcase', user_id: userId },
            { name: 'Inversiones', type: 'income', icon: 'trending-up', user_id: userId },
            { name: 'Regalos', type: 'income', icon: 'gift', user_id: userId },
            { name: 'Otros Ingresos', type: 'income', icon: 'plus-circle', user_id: userId }
        ];

        // Filter out categories that already exist (by name)
        const categoriesToInsert = defaults.filter(def =>
            !existingCategories.some(existing => existing.name === def.name)
        );

        if (categoriesToInsert.length > 0) {
            const { error } = await supabase
                .from('categories')
                .insert(categoriesToInsert);

            if (error) {
                console.error('Error seeding categories:', error);
            }
        }
    },

    async createCategory(category: Omit<Category, 'id'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuario no autenticado');

        const { data, error } = await supabase
            .from('categories')
            .insert([{ ...category, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;
        return data as Category;
    }
};
