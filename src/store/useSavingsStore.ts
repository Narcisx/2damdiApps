import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SavingsState {
    isEnabled: boolean;

    // Configuración Redondeo (Gastos)
    roundingEnabled: boolean;

    // Configuración Retención (Ingresos)
    retentionEnabled: boolean;
    retentionPercentage: number; // 0-100%

    // Fondos Simulados
    investedAmount: number;
    selectedFund: 'sp500' | 'tech' | 'green' | null;

    toggleRounding: () => void;
    toggleRetention: () => void;
    setRetentionPercentage: (pct: number) => void;
    setInvestedAmount: (amount: number) => void;
    setSelectedFund: (fund: 'sp500' | 'tech' | 'green' | null) => void;
}

export const useSavingsStore = create<SavingsState>()(
    persist(
        (set) => ({
            isEnabled: true,
            roundingEnabled: false,
            retentionEnabled: false,
            retentionPercentage: 10,
            investedAmount: 0,
            selectedFund: null,

            toggleRounding: () => set((state) => ({ roundingEnabled: !state.roundingEnabled })),
            toggleRetention: () => set((state) => ({ retentionEnabled: !state.retentionEnabled })),
            setRetentionPercentage: (pct) => set({ retentionPercentage: pct }),
            setInvestedAmount: (amount) => set({ investedAmount: amount }),
            setSelectedFund: (fund) => set({ selectedFund: fund }),
        }),
        {
            name: 'savings-storage',
        }
    )
);
