import React from 'react';
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-[#0a192f] text-white pt-20 pb-10 px-6 border-t border-white/5 relative">
            <div className="max-w-7xl mx-auto">

                {/* GLOBAL NODES / CITIES SECTION */}
                <div className="mb-20 pb-12 border-b border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="space-y-2">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Global Operations</h5>
                            <p className="text-[18px] md:text-[24px] font-black italic uppercase tracking-tighter leading-none">
                                Active Nodes <span className="text-white/20">//</span> Network Coverage
                            </p>
                        </div>
                        <button
                            onClick={scrollToTop}
                            className="group flex items-center gap-4 bg-white/5 hover:bg-emerald-500 transition-all p-4 rounded-full border border-white/10"
                        >
                            <span className="text-[8px] font-black uppercase tracking-widest group-hover:text-[#0a192f]">Back to Top</span>
                            <svg className="w-3 h-3 group-hover:text-[#0a192f] -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mt-12">
                        <RegionGroup title="Americas" cities={['New York', 'Los Angeles', 'Toronto', 'Mexico City']} />
                        <RegionGroup title="Europe" cities={['London', 'Berlin', 'Paris', 'Milan']} />
                        <RegionGroup title="Asia Pacific" cities={['Tokyo', 'Seoul', 'Hong Kong', 'Singapore']} />
                        <RegionGroup title="Middle East" cities={['Dubai', 'Abu Dhabi', 'Riyadh', 'Doha']} />
                        <RegionGroup title="Africa" cities={['Lagos', 'Cape Town', 'Nairobi', 'Cairo']} />
                        <RegionGroup title="Oceania" cities={['Sydney', 'Melbourne', 'Auckland', 'Perth']} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
                    {/* BRAND SECTION */}
                    <div className="md:col-span-4 space-y-6">
                        <Link href="/">
                            <h4 className="text-6xl font-black italic tracking-tighter text-white">
                                STASH<span className="text-emerald-500">.</span>
                            </h4>
                        </Link>
                        <p className="text-slate-400 text-xs leading-relaxed max-w-xs font-medium uppercase tracking-tight">
                            The premium marketplace for high-end manifests, digital assets, and curated hardware. Built for the modern collector.
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/80">
                                System Operational // v3.0.1
                            </span>
                        </div>
                    </div>

                    {/* LINKS: MARKETPLACE */}
                    <div className="md:col-span-2 space-y-4">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Marketplace</h5>
                        <ul className="space-y-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            <li className="hover:text-emerald-500 transition-colors cursor-pointer"><Link href="/discover">Discover</Link></li>
                            <li className="hover:text-emerald-500 transition-colors cursor-pointer"><Link href="/trending">Trending</Link></li>
                            <li className="hover:text-emerald-500 transition-colors cursor-pointer"><Link href="/vault">The Vault</Link></li>
                            <li className="hover:text-emerald-500 transition-colors cursor-pointer"><Link href="/sell">Create Manifest</Link></li>
                        </ul>
                    </div>

                    {/* LINKS: INTELLIGENCE */}
                    <div className="md:col-span-2 space-y-4">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Intelligence</h5>
                        <ul className="space-y-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            <li className="hover:text-emerald-500 transition-colors cursor-pointer">Help Center</li>
                            <li className="hover:text-emerald-500 transition-colors cursor-pointer">Community</li>
                            <li className="hover:text-emerald-500 transition-colors cursor-pointer">Security</li>
                            <li className="hover:text-emerald-500 transition-colors cursor-pointer">API Docs</li>
                        </ul>
                    </div>

                    {/* NEWSLETTER */}
                    <div className="md:col-span-4 space-y-6">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Newsletter Transmission</h5>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="ENTER EMAIL ADDRESS"
                                className="w-full bg-white/5 border border-white/10 py-3 px-4 text-[10px] font-bold text-white outline-none focus:border-emerald-500 transition-all uppercase tracking-widest"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-500 font-black text-[9px] hover:text-white transition-colors">
                                JOIN
                            </button>
                        </div>
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
                            *By subscribing, you agree to receive encrypted transmissions and drop alerts.
                        </p>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                        <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Discord</span>
                    </div>

                    <div className="flex gap-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
                        <span>© {currentYear} STASH INC.</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function RegionGroup({ title, cities }) {
    return (
        <div className="space-y-3">
            <h6 className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500/50">{title}</h6>
            <ul className="space-y-1.5">
                {cities.map((city) => (
                    <li key={city} className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter hover:text-white transition-colors cursor-default">
                        {city}
                    </li>
                ))}
            </ul>
        </div>
    );
}