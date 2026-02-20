"use client";
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { productService } from '@/app/(products)/services/ProductApi';
import { useUserStash } from '@/app/(auth)/services/AuthApi';
import DashboardNavbar from '@/app/(products)/components/navbar';
import Footer from "@/components/footer";

export default function SellProductPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: userProfile, isLoading: userLoading } = useUserStash();

    const [hasMounted, setHasMounted] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Toast State
    const [showToast, setShowToast] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        quantityAvailable: 1,
        weight: '',
        length: '',
        width: '',
        height: ''
    });

    useEffect(() => {
        setHasMounted(true);
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const mutation = useMutation({
        mutationFn: (newProduct) => productService.createProduct(newProduct),
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            setShowToast(true);

            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        },
        onError: (error) => {
            console.error("Product Creation Error:", error.response?.data || error.message);
            alert("Error: " + (error.response?.data?.message || "Check network"));
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userProfile?.id) return alert("Authentication required.");

        setUploading(true);
        try {
            let finalImageUrl = "";
            if (imageFile) {
                const sigData = await productService.getSignature("products", userProfile.id);
                const cloudinaryData = new FormData();
                cloudinaryData.append("file", imageFile);
                cloudinaryData.append("api_key", sigData.apiKey);
                cloudinaryData.append("timestamp", sigData.timestamp);
                cloudinaryData.append("signature", sigData.signature);
                cloudinaryData.append("folder", sigData.folder);

                const uploadRes = await axios.post(
                    `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
                    cloudinaryData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                finalImageUrl = uploadRes.data.secure_url;
            }

            mutation.mutate({
                ...formData,
                sellerId: userProfile.id,
                price: parseFloat(formData.price) || 0,
                quantityAvailable: parseInt(formData.quantityAvailable) || 0,
                weight: parseFloat(formData.weight) || 0,
                length: parseFloat(formData.length) || 0,
                width: parseFloat(formData.width) || 0,
                height: parseFloat(formData.height) || 0,
                imageUrl: finalImageUrl,
                keyword: formData.title
            });
        } catch (error) {
            const errorDetail = error.response?.data?.error?.message || error.message;
            console.error("Listing failed:", errorDetail);
            alert(`Upload Error: ${errorDetail}`);
        } finally {
            setUploading(false);
        }
    };

    if (!hasMounted || userLoading) {
        return (
            <div className="min-h-screen bg-[#0a192f] flex flex-col items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <h1 className="text-2xl font-black italic text-white animate-pulse">
                        STASH<span className="text-emerald-500">.</span>
                    </h1>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
                        Preparing To Sell
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white overflow-x-hidden relative">
            <DashboardNavbar />

            {/* RESPONSIVE TOP-RIGHT SUCCESS TOAST */}
            {showToast && (
                <div className="fixed top-20 md:top-24 right-4 md:right-8 z-[100] animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="bg-[#0a192f] border border-emerald-500/50 text-white px-3 md:px-5 py-2 md:py-3 rounded-lg md:rounded-xl shadow-2xl flex items-center gap-2 md:gap-3 backdrop-blur-md max-w-[200px] md:max-w-none">
                        <div className="w-4 h-4 md:w-6 md:h-6 bg-emerald-500 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <svg className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-[#0a192f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-none">Success</span>
                            <span className="text-[7px] md:text-[8px] font-bold text-white/60 uppercase tracking-tighter mt-0.5 truncate">Manifest Posted</span>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-6 md:py-10">
                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-2.5 mb-8 px-2 py-1.5 w-fit rounded-lg hover:bg-slate-50 transition-all duration-300"
                >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white group-hover:bg-emerald-500 group-hover:scale-110 transition-all duration-300 shadow-sm">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-900">Go Back</span>
                        <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-emerald-600 transition-colors uppercase">Exit Manifest</span>
                    </div>
                </button>

                <header className="mb-6 md:mb-8 px-1 text-left">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-1 block">Seller Hub</span>
                    <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-tight">
                        New <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-600">Manifest.</span>
                    </h1>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-8 items-start">
                    {/* LEFT SIDE: VISUALS */}
                    <section className="col-span-1 md:col-span-4 space-y-3">
                        <div className="relative aspect-[3/4] md:aspect-auto md:h-[380px] rounded-xl overflow-hidden shadow-md grayscale hover:grayscale-0 transition-all duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
                                className="w-full h-full object-cover"
                                alt="Fashion 1"
                            />
                        </div>
                        <div className="hidden md:grid grid-cols-2 gap-2">
                            <div className="aspect-square rounded-lg overflow-hidden border border-slate-100 opacity-80">
                                <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Fashion 2" />
                            </div>
                            <div className="aspect-square rounded-lg overflow-hidden border border-slate-100 opacity-80">
                                <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Fashion 3" />
                            </div>
                        </div>
                    </section>

                    {/* RIGHT SIDE: FORM */}
                    <section className="col-span-1 md:col-span-8">
                        <div className="w-full bg-[#0a192f] border border-slate-800 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-xl">
                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                                <div className="relative h-20 md:h-28 w-full border border-dashed border-white/20 rounded-lg overflow-hidden flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer group/upload">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover/upload:scale-105"
                                            alt="Preview"
                                        />
                                    ) : (
                                        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 relative z-10 pointer-events-none">
                                            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <p className="text-[7px] md:text-[8px] font-black text-white/40 uppercase tracking-widest text-center">Attach Reference</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                    />
                                    {imagePreview && (
                                        <div className="absolute bottom-2 right-2 z-10 bg-emerald-500/90 p-1 rounded backdrop-blur-sm">
                                            <p className="text-[6px] font-black text-[#0a192f] uppercase">Selected</p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid gap-3 md:gap-4">
                                    <div className="space-y-0.5">
                                        <label className="text-[6px] md:text-[7px] font-black uppercase tracking-widest text-white/20">Item Name</label>
                                        <input required type="text" className="w-full border-b border-white/10 py-1 bg-transparent text-white text-[10px] md:text-xs outline-none focus:border-emerald-500 font-bold" placeholder="Title..." value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                                        <div className="space-y-0.5">
                                            <label className="text-[6px] md:text-[7px] font-black uppercase tracking-widest text-white/20">Price ($)</label>
                                            <input required type="number" step="0.01" className="w-full border-b border-white/10 py-1 bg-transparent text-white text-[10px] md:text-xs outline-none focus:border-emerald-500 font-bold" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                                        </div>
                                        <div className="space-y-0.5">
                                            <label className="text-[6px] md:text-[7px] font-black uppercase tracking-widest text-white/20">Stock</label>
                                            <input required type="number" className="w-full border-b border-white/10 py-1 bg-transparent text-white text-[10px] md:text-xs outline-none focus:border-emerald-500 font-bold" placeholder="1" value={formData.quantityAvailable} onChange={(e) => setFormData({...formData, quantityAvailable: e.target.value})} />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-2 md:p-3 bg-white/5 rounded-lg border border-white/5">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                                        <DimensionField label="L" value={formData.length} onChange={(v) => setFormData({...formData, length: v})} />
                                        <DimensionField label="W" value={formData.width} onChange={(v) => setFormData({...formData, width: v})} />
                                        <DimensionField label="H" value={formData.height} onChange={(v) => setFormData({...formData, height: v})} />
                                        <DimensionField label="LB" value={formData.weight} onChange={(v) => setFormData({...formData, weight: v})} />
                                    </div>
                                </div>

                                <button type="submit" disabled={uploading || mutation.isPending} className="w-full bg-emerald-500 text-[#0a192f] py-3 rounded-lg font-black text-[8px] md:text-[9px] uppercase tracking-[0.2em] hover:bg-white transition-all active:scale-[0.98]">
                                    {uploading || mutation.isPending ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-3 h-3 border-2 border-[#0a192f] border-t-transparent rounded-full animate-spin"></div>
                                            Syncing...
                                        </span>
                                    ) : "PUBLISH STASH"}
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function DimensionField({ label, value, onChange }) {
    return (
        <div className="space-y-1">
            <label className="text-[5px] md:text-[6px] font-black uppercase text-white/30 block text-center">{label}</label>
            <input
                required type="number" step="0.1" value={value} onChange={(e) => onChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded py-1 md:py-2 text-center text-[9px] md:text-[10px] text-white outline-none focus:border-emerald-500"
            />
        </div>
    );
}