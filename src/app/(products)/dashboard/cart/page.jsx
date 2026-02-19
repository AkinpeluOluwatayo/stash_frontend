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

    // SHIPPO LOGIC: Shipping is now 0 until calculated via API at checkout
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

            <main className="flex-grow max-w-5xl mx-auto w-full p-6 md:p-16">
                <button onClick={() => router.back()} className="flex items-center gap-2 group mb-8">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-slate-900 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                        <svg className="w-3 h-3 md:w-4 md:h-4 text-slate-900 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                    <span className="text-[8px] md:text-xs font-black uppercase tracking-tighter text-slate-900">Back</span>
                </button>

                <div className="flex flex-col md:flex-row items-start gap-10 md:gap-16">
                    {/* LEFT SIDE: ITEMS */}
                    <section className="w-full md:w-7/12 space-y-4">
                        <header className="mb-6">
                            <h1 className="text-xl md:text-4xl font-black italic tracking-tighter uppercase text-slate-900">
                                Bag<span className="text-emerald-500">.</span>
                            </h1>
                        </header>

                        {stash.length > 0 ? (
                            stash.map((item) => (
                                <div key={item.id} className="flex flex-row items-center gap-4 p-4 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-20 h-20 md:w-28 md:h-28 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-grow flex flex-col justify-between h-20 md:h-28 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xs md:text-sm font-black uppercase tracking-tighter text-slate-900 truncate pr-4">
                                                {item.title}
                                            </h3>
                                            <button onClick={() => removeFromStash(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center bg-slate-100 rounded-lg p-1">
                                                <button onClick={() => handleQtyChange(item.id, item.quantity || 1, -1)} className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-emerald-600 font-bold">−</button>
                                                <span className="text-[10px] font-black text-slate-900 w-8 text-center">{item.quantity || 1}</span>
                                                <button onClick={() => handleQtyChange(item.id, item.quantity || 1, 1)} className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-emerald-600 font-bold">+</button>
                                            </div>
                                            <p className="text-sm md:text-xl font-black text-slate-900 tracking-tighter">
                                                ${(item.price * (item.quantity || 1)).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Your stash is empty</p>
                            </div>
                        )}
                    </section>

                    {/* RIGHT SIDE: SUMMARY */}
                    <section className="w-full md:w-5/12 sticky top-24">
                        <div className="bg-[#0a192f] rounded-[2rem] p-8 shadow-2xl">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8 text-center">Checkout Details</h2>

                            <div className="space-y-4 mb-10">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-white/40">Subtotal</span>
                                    <span className="text-white">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-white/40">Shipping</span>
                                    <span className="text-emerald-400 font-bold">Calculated at checkout</span>
                                </div>
                                <div className="h-px bg-white/10 my-6"></div>
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-white/30 text-[8px] font-black uppercase mb-1 tracking-widest">Current Total</span>
                                        <span className="text-3xl font-black text-white tracking-tighter">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push('/dashboard/checkout')}
                                disabled={stash.length === 0}
                                className="w-full bg-emerald-500 text-[#0a192f] py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-10 shadow-lg shadow-emerald-500/20"
                            >
                                Proceed to Shipping
                            </button>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}