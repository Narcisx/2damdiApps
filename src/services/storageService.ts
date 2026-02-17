import { supabase } from './supabaseClient';

export interface FileItem {
    name: string;
    id: string; // We'll use name as ID for simplicity or get metadata
    url: string;
    created_at: string;
    metadata?: any;
}

export const storageService = {
    async uploadFile(file: File) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuario no autenticado');

        const filePath = `${user.id}/${Date.now()}_${file.name}`;
        const { error } = await supabase.storage
            .from('receipts')
            .upload(filePath, file);

        if (error) throw error;
        return filePath;
    },

    async getFiles() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuario no autenticado');

        const { data, error } = await supabase.storage
            .from('receipts')
            .list(user.id + '/', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            });

        if (error) throw error;

        // Transform to useful objects with URLs
        const filesWithUrls = await Promise.all(data.map(async (file) => {
            const { data: { publicUrl } } = supabase.storage
                .from('receipts')
                .getPublicUrl(`${user.id}/${file.name}`);

            return {
                ...file,
                url: publicUrl,
                id: file.id || file.name
            };
        }));

        return filesWithUrls as FileItem[];
    },

    async deleteFile(name: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuario no autenticado');

        const { error } = await supabase.storage
            .from('receipts')
            .remove([`${user.id}/${name}`]);

        if (error) throw error;
    }
};
