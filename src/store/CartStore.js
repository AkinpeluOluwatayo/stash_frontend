import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStashStore = create(
    persist(
        (set) => ({
            stash: [],

            // Action to add an item
            addToStash: (product) => set((state) => {
                const exists = state.stash.find((item) => item.id === product.id);
                if (exists) {
                    return {
                        stash: state.stash.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: (item.quantity || 1) + 1 }
                                : item
                        ),
                    };
                }
                return { stash: [...state.stash, { ...product, quantity: 1 }] };
            }),

            // Action to remove an item
            removeFromStash: (productId) => set((state) => ({
                stash: state.stash.filter((item) => item.id !== productId),
            })),

            // --- ADDED THIS FUNCTION ---
            // Action to update quantity directly (Fixes the TypeError)
            updateQuantity: (productId, newQuantity) => set((state) => ({
                stash: state.stash.map((item) =>
                    item.id === productId
                        ? { ...item, quantity: newQuantity }
                        : item
                ),
            })),

            // Action to clear the stash
            clearStash: () => set({ stash: [] }),
        }),
        {
            name: 'user-stash-storage', // Saves to localStorage automatically
        }
    )
);