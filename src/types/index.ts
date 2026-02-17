export type TransactionType = 'income' | 'expense';

export interface Category {
    id: string;
    name: string;
    type: TransactionType;
    icon?: string;
    user_id: string;
}

export interface Transaction {
    id: string;
    user_id: string;
    amount: number;
    description: string;
    date: string;
    category_id?: string;
    category?: Category;
    file_url?: string; // For receipts/images
    currency?: string;
    created_at?: string;
}

export interface Profile {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
    updated_at?: string;
}
