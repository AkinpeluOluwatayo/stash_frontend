"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStashStore } from '@/store/CartStore';
import DashboardNavbar from '@/app/(products)/components/navbar';
import Footer from "@/components/footer";

export default function SuccessPage() {
    const router = useRouter();
    const { clearStash } = useStashStore(); // Make sure this matches your store's clear method

    useEffect(() => {
        // Clear the cart since the purchase was successful
        if (clearStash) {
            clearStash();
        }
    }, [clearStash]);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <DashboardNavbar />
            <main className="flex-grow flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-slate-50 rounded-[2.5rem] p-12 text-center shadow-sm">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/20">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-black uppercase text-slate-900 mb-4 tracking-tight">Payment Successful!</h1>
                    <p className="text-slate-500 text-sm font-bold uppercase mb-10 leading-relaxed tracking-wide">
                        Your order has been placed. Check your email for the receipt and shipping updates.
                    </p>

                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full bg-[#0a192f] text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-emerald-500 transition-all"
                    >
                        Back to Shop
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
}