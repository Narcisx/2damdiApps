import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    signOut: () => Promise<void>;
    checkUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    loading: true,
    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null });
    },
    checkUser: async () => {
        try {
            set({ loading: true });
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                set({ user: session.user, session });
            } else {
                set({ user: null, session: null });
            }
        } catch (error) {
            console.error('Error verificando usuario:', error);
            set({ user: null, session: null });
        } finally {
            set({ loading: false });
        }
    },
}));
