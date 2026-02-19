"use client";
import React from 'react';
import Link from 'next/link';


function FashionCard({ name, brand, price, src, isVideo = false }) {
    const isYouTube = src?.includes('youtube.com') || src?.includes('youtu.be');

    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = isYouTube ? getYouTubeId(src) : null;

    return (
        <div className="group cursor-pointer">
            {/* Aspect ratio and rounded corners matching high-end e-commerce */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-50 border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-md">
                {isVideo ? (
                    isYouTube ? (
                        <iframe
                            className="h-full w-full object-cover scale-[1.5] pointer-events-none"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
                            allow="autoplay; encrypted-media"
                            frameBorder="0"
                        />
                    ) : (
                        <video
                            src={src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    )
                ) : (
                    <img
                        src={src}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                )}

                <div className={`absolute top-3 right-3 backdrop-blur-md px-2.5 py-1 text-[9px] font-black tracking-widest uppercase rounded-full z-10 ${
                    isVideo ? 'bg-brand-accent text-white' : 'bg-white/90 text-slate-900'
                }`}>
                    {isVideo ? "• Live" : "New Drop"}
                </div>
            </div>

            <div className="mt-4 px-1">
                <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">{brand}</span>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight leading-tight">{name}</h3>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-base font-black text-slate-900">${price}</span>
                        <span className="text-[9px] text-emerald-600 uppercase font-bold">In Stock</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LandingPage() {
    return (
        <div className="bg-[#f4f4f4] text-slate-900 min-h-screen">

            {/* HEADER - Centered and clean */}
            <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
                    <Link href="/">
                        <h1 className="text-2xl font-black italic tracking-tighter text-brand-accent cursor-pointer">
                            STASH.
                        </h1>
                    </Link>
                </div>
            </header>

            {/* HERO SECTION - Balanced heights */}
            <section className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-block px-3 py-1 bg-slate-100 rounded-full">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Verified Marketplace</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tighter text-slate-900">
                            The Art of <br />
                            <span className="text-brand-accent italic font-light">the</span> Stash
                        </h1>
                        <p className="text-base text-slate-500 max-w-md leading-relaxed font-medium">
                            A curated digital environment for rare tech-garments and verified global stashes.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link href="/signup">
                                <button className="bg-brand-accent text-white px-8 py-4 text-xs font-black uppercase tracking-widest rounded-lg hover:brightness-110 shadow-lg shadow-blue-100">
                                    Shop Now
                                </button>
                            </Link>
                            <Link href="/signup">
                                <button className="border-2 border-slate-900 text-slate-900 px-8 py-4 text-xs font-black uppercase tracking-widest rounded-lg hover:bg-slate-900 hover:text-white transition-all">
                                    Sell Gear
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="relative aspect-square lg:aspect-auto lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop"
                            alt="Stash Hero"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-8 left-8 text-white">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Edition / 001</h2>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOT DROPS - Using a clean gray background to separate sections like Jumia */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                            Recommended for you
                        </h2>
                        <Link href="/dashboard" className="text-brand-accent font-bold text-xs uppercase tracking-widest hover:underline">
                            See All
                        </Link>
                    </div>

                    {/* Grid with Jumia-style spacing */}
                    <div className="p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        <FashionCard
                            isVideo={true}
                            name="Cyber Cargo"
                            brand="STASH LABS"
                            price="420"
                            src="https://www.youtube.com/shorts/fJgwVW9rKHA"
                        />
                        <FashionCard
                            isVideo={true}
                            name="Stealth Hoodie"
                            brand="CHETA"
                            price="310"
                            src="https://www.youtube.com/shorts/8NqJG2-XAtw"
                        />
                        <FashionCard
                            isVideo={true}
                            name="Phantom Mask"
                            brand="STASH ORIGINALS"
                            price="195"
                            src="https://www.youtube.com/shorts/Lkwh_SzxhHU"
                        />
                        <FashionCard
                            isVideo={true}
                            name="Cinematic"
                            brand="STASH ORIGINALS"
                            price="650"
                            src="https://www.youtube.com/shorts/6KQQyg3I5IE"
                        />
                        <FashionCard
                            name="Neon Runner v4"
                            brand="NIKE X STASH"
                            price="290"
                            src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000"
                        />
                        <FashionCard
                            name="Distressed Denim"
                            brand="ARCHIVE"
                            price="320"
                            src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}