"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStashStore } from '@/store/CartStore';
import { useAuthStore } from '@/store/middleware';

export default function DashboardNavbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [hasMounted, setHasMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const stash = useStashStore((state) => state.stash);
    const clearStash = useStashStore((state) => state.clearStash);
    const { user, setLogout, isAuthenticated } = useAuthStore();

    useEffect(() => {
        setHasMounted(true);
        const currentSearch = searchParams.get('search');
        if (currentSearch) setSearchQuery(currentSearch);
    }, [searchParams]);

    const totalItems = stash.reduce((acc, item) => acc + (item.quantity || 1), 0);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            if (searchQuery.trim()) {
                router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
            } else {
                router.push(`/dashboard`);
            }
        }
    };

    const handleLogout = () => {
        setLogout();
        clearStash();
        router.push('/');
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#0a192f] border-b border-white/10 px-3 md:px-6 py-3 md:py-4">
            <div className="max-w-7xl mx-auto flex items-center gap-2 md:gap-8">

                {/* 1. LOGO */}
                <div className="flex-shrink-0">
                    <Link href="/dashboard">
                        <h1 className="text-lg md:text-2xl font-black italic tracking-tighter text-white cursor-pointer">
                            STASH<span className="text-emerald-500">.</span>
                        </h1>
                    </Link>
                </div>

                {/* 2. SEARCH BAR */}
                <div className="flex-1 relative group min-w-0">
                    <div className="absolute inset-y-0 left-3 md:left-4 flex items-center pointer-events-none">
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        placeholder="Search..."
                        className="w-full bg-white border-none rounded-full py-1.5 md:py-2.5 pl-8 md:pl-11 pr-4 text-[10px] md:text-sm text-slate-900 outline-none font-medium"
                    />
                </div>

                {/* 3. ACTIONS */}
                <div className="flex items-center gap-1.5 md:gap-4 flex-shrink-0">

                    {/* LIST ITEM BUTTON */}
                    {hasMounted && isAuthenticated && (
                        <Link href="/dashboard/sell">
                            <button className="flex items-center justify-center gap-1 md:gap-2 bg-emerald-500 hover:bg-white text-[#0a192f] p-1.5 md:px-4 md:py-2 rounded-full transition-all duration-300">
                                <svg className="w-4 h-4 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="hidden md:inline text-[10px] md:text-xs font-black uppercase tracking-widest">List</span>
                            </button>
                        </Link>
                    )}

                    {/* CART/STASH ICON */}
                    <Link href="/dashboard/cart" className="relative p-1.5 md:p-2 hover:bg-white/10 rounded-full transition-colors group">
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {hasMounted && totalItems > 0 && (
                            <span className="absolute top-0 right-0 md:top-1 md:right-1 bg-emerald-500 text-[#0a192f] text-[7px] md:text-[8px] font-black w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center rounded-full border border-[#0a192f]">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {/* AUTH ACTIONS */}
                    {!hasMounted ? (
                        <div className="w-10 md:w-24 h-8 bg-white/5 animate-pulse rounded-lg" />
                    ) : isAuthenticated ? (
                        <div className="flex items-center gap-1.5 md:gap-4">
                            {/* Profile Image */}
                            <Link href="/dashboard/profile">
                                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/10 border border-white/20 overflow-hidden hover:border-emerald-500 transition-all">
                                    <img
                                        src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                                        alt="User"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </Link>

                            {/* Logout Button (Visible on all screens) */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center p-1.5 md:px-3 md:py-2 hover:bg-red-500/20 rounded-lg group transition-all"
                            >
                                <svg className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="bg-emerald-500 text-[#0a192f] px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[9px] md:text-xs font-black uppercase tracking-widest hover:bg-white transition-all">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}