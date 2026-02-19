"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { productService } from '@/app/(products)/services/ProductApi';
import { useStashStore } from '@/store/CartStore';
import DashboardNavbar from '@/app/(products)/components/navbar';
import Footer from "@/components/footer";

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get('search')?.toLowerCase() || "";

    const {
        data: products,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['products'],
        queryFn: () => productService.getAllProducts(0, 50), // Increased limit for denser grid
        staleTime: 1000 * 60 * 5,
    });

    const filteredProducts = products?.filter((product) => {
        const titleMatch = product.title?.toLowerCase().includes(searchTerm);
        const sellerMatch = product.sellerId?.toLowerCase().includes(searchTerm);
        return titleMatch || sellerMatch;
    });

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <DashboardNavbar />

            <main className="flex-grow p-2 md:p-6 max-w-[1800px] mx-auto w-full">
                <header className="mb-6 px-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                        <h2 className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Discovery</h2>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase leading-none text-slate-900">
                        {searchTerm ? `Search: ${searchTerm}` : "Market."}
                    </h1>
                </header>

                {/* 1. LOADING STATE */}
                {isLoading && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-4">
                        {[...Array(21)].map((_, i) => (
                            <div key={i} className="animate-pulse space-y-2">
                                <div className="aspect-[4/5] bg-slate-100 rounded-xl" />
                                <div className="h-2 bg-slate-100 w-3/4 rounded mx-1" />
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. PRODUCT GRID (7 Columns Web / 3 Columns Mobile) */}
                {!isLoading && !isError && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-2 gap-y-8 md:gap-x-4 md:gap-y-12">
                        {filteredProducts && filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center border border-slate-100 rounded-3xl bg-slate-50/50">
                                <p className="text-slate-400 font-black uppercase text-[9px] tracking-[0.3em]">No matches.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

function ProductCard({ product }) {
    const addToStash = useStashStore((state) => state.addToStash);

    return (
        <div className="flex flex-col group w-full">
            {/* IMAGE CONTAINER */}
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 mb-2 border border-slate-100 transition-all duration-500 hover:shadow-md">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-[6px] font-black text-slate-300">NULL</div>
                )}

                <div className="absolute top-1 right-1 bg-slate-900/90 backdrop-blur-sm text-white text-[6px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="w-0.5 h-0.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    LIVE
                </div>
            </div>

            {/* TEXT DETAILS */}
            <div className="px-0.5 mb-2">
                <div className="flex flex-col leading-tight min-w-0">
                    <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest mb-0.5 truncate">
                        {product.sellerId?.substring(0, 5) || "STASH"}
                    </span>
                    <h3 className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase tracking-tight truncate">
                        {product.title || "Untitled"}
                    </h3>
                </div>
                <div className="mt-0.5">
                    <span className="text-xs md:text-sm font-black text-slate-900">
                        ${Number(product.price).toLocaleString()}
                    </span>
                </div>
            </div>

            {/* COMPACT BUTTON */}
            <button
                onClick={() => addToStash(product)}
                className="w-full border border-slate-200 py-1.5 rounded-md text-[8px] font-black uppercase tracking-tighter text-slate-800 hover:bg-emerald-500 hover:text-[#0a192f] hover:border-emerald-500 transition-all active:scale-[0.95] bg-white whitespace-nowrap overflow-hidden"
            >
                Add to Stash
            </button>
        </div>
    );
}