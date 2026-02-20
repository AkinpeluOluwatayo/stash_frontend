"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStashStore } from '@/store/CartStore';
import DashboardNavbar from '@/app/(products)/components/navbar';
import Footer from "@/components/footer";

export default function CartPage() {
    const router = useRouter();
    const { stash, removeFromStash, updateQuantity } = useStashStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const subtotal = stash.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    const shippingEstimate = 0;
    const total = subtotal + shippingEstimate;

    const handleQtyChange = (id, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty > 0) {
            updateQuantity(id, newQty);
        } else {
            removeFromStash(id);
        }
    };

    if (!isHydrated) return null;

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <DashboardNavbar />

            <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-16">
                <button onClick={() => router.back()} className="flex items-center gap-2 group mb-6">
                    <div className="w-6 h-6 rounded-full border border-slate-900 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                        <svg className="w-3 h-3 text-slate-900 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-slate-900">Back</span>
                </button>

                {/* CHANGED TO GRID: 12 columns, side-by-side always */}
                <div className="grid grid-cols-12 gap-4 md:gap-16 items-start">

                    {/* LEFT SIDE: ITEMS (Takes up 7/12 columns) */}
                    <section className="col-span-7 md:col-span-7 space-y-4">
                        <header className="mb-4">
                            <h1 className="text-xl md:text-4xl font-black italic tracking-tighter uppercase text-slate-900">
                                Bag<span className="text-emerald-500">.</span>
                            </h1>
                        </header>

                        {stash.length > 0 ? (
                            stash.map((item) => (
                                <div key={item.id} className="flex flex-row items-center gap-2 md:gap-4 p-2 md:p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
                                    <div className="w-12 h-12 md:w-28 md:h-28 bg-slate-50 rounded-lg md:rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-grow flex flex-col justify-between h-12 md:h-28 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-[8px] md:text-sm font-black uppercase tracking-tighter text-slate-900 truncate pr-1">
                                                {item.title}
                                            </h3>
                                            <button onClick={() => removeFromStash(item.id)} className="text-slate-300 hover:text-red-500">
                                                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center bg-slate-100 rounded-md p-0.5 md:p-1">
                                                <button onClick={() => handleQtyChange(item.id, item.quantity || 1, -1)} className="w-4 h-4 md:w-6 md:h-6 flex items-center justify-center text-slate-500 font-bold text-[10px] md:text-base">−</button>
                                                <span className="text-[8px] md:text-[10px] font-black text-slate-900 w-4 md:w-8 text-center">{item.quantity || 1}</span>
                                                <button onClick={() => handleQtyChange(item.id, item.quantity || 1, 1)} className="w-4 h-4 md:w-6 md:h-6 flex items-center justify-center text-slate-500 font-bold text-[10px] md:text-base">+</button>
                                            </div>
                                            <p className="text-[10px] md:text-xl font-black text-slate-900 tracking-tighter">
                                                ${(item.price * (item.quantity || 1)).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                <p className="text-[8px] font-black uppercase text-slate-300 tracking-widest">Empty</p>
                            </div>
                        )}
                    </section>

                    {/* RIGHT SIDE: SUMMARY (Takes up 5/12 columns) */}
                    <section className="col-span-5 md:col-span-5 sticky top-4 md:top-24">
                        <div className="bg-[#0a192f] rounded-xl md:rounded-[2rem] p-3 md:p-8 shadow-2xl">
                            <h2 className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4 md:mb-8 text-center">Summary</h2>

                            <div className="space-y-2 md:space-y-4 mb-4 md:mb-10">
                                <div className="flex justify-between text-[7px] md:text-[10px] font-black uppercase">
                                    <span className="text-white/40">Sub</span>
                                    <span className="text-white">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[7px] md:text-[10px] font-black uppercase">
                                    <span className="text-white/40">Ship</span>
                                    <span className="text-emerald-400 font-bold">NEXT</span>
                                </div>
                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex flex-col">
                                    <span className="text-white/30 text-[6px] md:text-[8px] font-black uppercase tracking-widest">Total</span>
                                    <span className="text-sm md:text-3xl font-black text-white tracking-tighter">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push('/dashboard/checkout')}
                                disabled={stash.length === 0}
                                className="w-full bg-emerald-500 text-[#0a192f] py-2 md:py-5 rounded-lg md:rounded-2xl font-black text-[7px] md:text-[11px] uppercase tracking-widest hover:bg-white transition-all disabled:opacity-10"
                            >
                                Checkout
                            </button>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}