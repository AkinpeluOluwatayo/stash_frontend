import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-brand-text text-white py-24 px-6 border-t border-slate-800">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                <Link href="/">
                    <h4 className="text-5xl font-black italic tracking-tighter text-brand-accent cursor-pointer">
                        STASH.
                    </h4>
                </Link>
                <div className="flex gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    <span className="hover:text-brand-accent cursor-pointer transition-colors">Instagram</span>
                    <span className="hover:text-brand-accent cursor-pointer transition-colors">Terms</span>
                    <span className="hover:text-brand-accent cursor-pointer transition-colors">Privacy</span>
                </div>
            </div>
        </footer>
    );
}