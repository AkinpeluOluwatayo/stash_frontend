"use client";
import React from 'react';
import Image from 'next/image';
import { VirtuosoGrid } from 'react-virtuoso';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { productService } from '@/app/(products)/services/ProductApi';
import { useStashStore } from '@/store/CartStore';
import DashboardNavbar from '@/app/(products)/components/navbar';
import Footer from "@/components/footer";

function ProductCard({ product }) {
    const addToStash = useStashStore((state) => state.addToStash);
    return (
        <div className="flex flex-col group w-full">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 mb-2 border border-slate-100 transition-all duration-500 hover:shadow-md">
                {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.title || "Product"} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-[6px] font-black text-slate-300">NULL</div>
                )}
            </div>
            <div className="px-0.5 mb-2 leading-tight">
                <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest">{product.sellerId?.substring(0, 5) || "STASH"}</span>
                <h3 className="text-[10px] font-black text-slate-900 uppercase truncate">{product.title || "Untitled"}</h3>
                <span className="text-xs font-black text-slate-900">${Number(product.price).toLocaleString()}</span>
            </div>
            <button onClick={() => addToStash(product)} className="w-full border border-slate-200 py-1.5 rounded-md text-[8px] font-black uppercase text-slate-800 hover:bg-emerald-500 transition-all">
                Add to Stash
            </button>
        </div>
    );
}

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get('search')?.toLowerCase() || "";

    const { data: products, isLoading, isError } = useQuery({
        queryKey: ['products'],
        queryFn: () => productService.getAllProducts(0, 100), // Start with 100
        staleTime: 1000 * 60 * 5,
    });

    const filteredProducts = products?.filter((p) =>
        p.title?.toLowerCase().includes(searchTerm) || p.sellerId?.toLowerCase().includes(searchTerm)
    ) || [];

    return (
        // Remove 'overflow-hidden' from here so the page can scroll normally
        <div className="min-h-screen flex flex-col bg-white">
            <DashboardNavbar />

            <main className="flex-grow w-full max-w-[1800px] mx-auto">
                <header className="pt-6 pb-2 px-4 md:px-8">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                        <h2 className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Discovery</h2>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase text-slate-900">
                        {searchTerm ? `Search: ${searchTerm}` : "Market."}
                    </h1>
                </header>

                {!isLoading && !isError && (
                    <div className="w-full">
                        {filteredProducts.length > 0 ? (
                            <VirtuosoGrid
                                // 1. Use standard window scroll so the footer naturally follows the content
                                useWindowScroll
                                data={filteredProducts}
                                // 2. This prevents the "empty space" calculation error
                                overshoot={200}
                                components={{
                                    List: React.forwardRef(({ children, ...props }, ref) => (
                                        <div
                                            {...props}
                                            ref={ref}
                                            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-2 gap-y-8 md:gap-x-4 md:gap-y-12 px-4 md:px-8 py-8"
                                        >
                                            {children}
                                        </div>
                                    )),
                                }}
                                itemContent={(index, product) => <ProductCard product={product} />}
                            />
                        ) : (
                            <div className="mx-4 py-20 text-center border border-slate-100 rounded-3xl bg-slate-50/50">
                                <p className="text-slate-400 font-black uppercase text-[9px] tracking-[0.3em]">No matches.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* 3. Place footer outside the main grid, but within the normal document flow */}
            <Footer />
        </div>
    );
}