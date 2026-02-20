import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStashStore = create(
    persist(
        (set) => ({
            stash: [],


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


            removeFromStash: (productId) => set((state) => ({
                stash: state.stash.filter((item) => item.id !== productId),
            })),

            updateQuantity: (productId, newQuantity) => set((state) => ({
                stash: state.stash.map((item) =>
                    item.id === productId
                        ? { ...item, quantity: newQuantity }
                        : item
                ),
            })),


            clearStash: () => set({ stash: [] }),
        }),
        {
            name: 'user-stash-storage',
        }
    )
);