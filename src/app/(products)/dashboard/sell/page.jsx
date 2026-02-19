"use client";
import React, { useState } from 'react';
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

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        quantityAvailable: 1,
        // NEW: Shipping Fields for Shippo
        weight: '',
        length: '',
        width: '',
        height: ''
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const mutation = useMutation({
        mutationFn: (newProduct) => productService.createProduct(newProduct),
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            router.push('/dashboard');
        },
        onError: (error) => {
            console.error("Product Creation Error:", error.response?.data || error.message);
            alert("Backend rejected product: " + (error.response?.data?.message || "Check network logs"));
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userProfile?.id) {
            return alert("Authentication required. Please sign in again.");
        }

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
                    cloudinaryData
                );

                finalImageUrl = uploadRes.data.secure_url;
            }

            // 3. Trigger Spring Boot Product Creation with Shipping Data
            mutation.mutate({
                ...formData,
                sellerId: userProfile.id,
                price: parseFloat(formData.price),
                quantityAvailable: parseInt(formData.quantityAvailable),
                // Parsing shipping specs to numbers for the API
                weight: parseFloat(formData.weight),
                length: parseFloat(formData.length),
                width: parseFloat(formData.width),
                height: parseFloat(formData.height),
                imageUrl: finalImageUrl,
                keyword: formData.title
            });

        } catch (error) {
            console.error("Listing failed:", error.response?.data || error.message);
            alert("Upload failed: Check console for payload mismatch.");
        } finally {
            setUploading(false);
        }
    };

    if (userLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center text-slate-900 font-black text-xs tracking-tighter italic">
                SYNCING STASH...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <DashboardNavbar />
            <main className="flex-grow flex flex-col lg:flex-row max-w-6xl mx-auto w-full p-6 lg:p-10 gap-10 items-center justify-center">

                {/* Left Side: Visuals */}
                <section className="w-full lg:w-5/12 flex flex-col gap-6">
                    <header>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500">Sell Mode</span>
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none mt-2">
                            Curate Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-sky-500">Grails.</span>
                        </h1>
                    </header>
                    <div className="grid grid-cols-2 gap-3 h-[320px] md:h-[380px]">
                        <div className="relative rounded-[1.5rem] overflow-hidden shadow-xl">
                            <img src="https://images.unsplash.com/photo-1529139513055-07f9127e6193?q=80&w=800" className="w-full h-full object-cover" alt="Fashion 1" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="h-1/2 rounded-[1.2rem] overflow-hidden shadow-lg">
                                <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800" className="w-full h-full object-cover" alt="Fashion 2" />
                            </div>
                            <div className="h-1/2 rounded-[1.2rem] overflow-hidden shadow-lg">
                                <img src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800" className="w-full h-full object-cover" alt="Fashion 3" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Side: Sell Form */}
                <section className="w-full lg:w-7/12 flex items-center justify-center">
                    <div className="w-full max-w-md bg-[#0a192f] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* MEDIA UPLOAD */}
                            <div className="space-y-2">
                                <label className="text-[8px] font-black uppercase tracking-widest text-emerald-400/60 ml-1">Media</label>
                                <div className="relative h-28 w-full border-2 border-dashed border-white/10 rounded-2xl overflow-hidden flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                    {imagePreview ? (
                                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <svg className="w-5 h-5 text-emerald-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Add Photo</p>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                            </div>

                            {/* CORE DETAILS */}
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-1">Title</label>
                                    <input required type="text" className="w-full border-b border-white/10 py-2 bg-transparent text-white text-sm outline-none focus:border-emerald-500 transition-all font-bold" placeholder="Item Name..." value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-1">Price ($)</label>
                                        <input required type="number" step="0.01" className="w-full border-b border-white/10 py-2 bg-transparent text-white text-sm outline-none focus:border-emerald-500 transition-all font-bold" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black uppercase tracking-widest text-white/20 ml-1">Stock</label>
                                        <input required type="number" className="w-full border-b border-white/10 py-2 bg-transparent text-white text-sm outline-none focus:border-emerald-500 transition-all font-bold" placeholder="1" value={formData.quantityAvailable} onChange={(e) => setFormData({...formData, quantityAvailable: e.target.value})} />
                                    </div>
                                </div>
                            </div>

                            {/* NEW: SHIPPING SPECIFICATIONS (FOR SHIPPO) */}
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                    <h3 className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Logistics Specs</h3>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    <DimensionField label="L (in)" value={formData.length} onChange={(v) => setFormData({...formData, length: v})} />
                                    <DimensionField label="W (in)" value={formData.width} onChange={(v) => setFormData({...formData, width: v})} />
                                    <DimensionField label="H (in)" value={formData.height} onChange={(v) => setFormData({...formData, height: v})} />
                                    <DimensionField label="LB" value={formData.weight} onChange={(v) => setFormData({...formData, weight: v})} />
                                </div>
                            </div>

                            <button type="submit" disabled={uploading || mutation.isPending} className="w-full bg-emerald-500 text-[#0a192f] py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all active:scale-[0.98] disabled:opacity-50">
                                {uploading ? "UPLOADING MEDIA..." : mutation.isPending ? "CONFIRMING..." : "CONFIRM LISTING"}
                            </button>
                        </form>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

/** * Reusable Mini-Input for Dimensions
 */
function DimensionField({ label, value, onChange }) {
    return (
        <div className="space-y-1">
            <label className="text-[7px] font-black uppercase tracking-tighter text-white/30 block text-center">{label}</label>
            <input
                required
                type="number"
                step="0.1"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 text-center text-xs text-white outline-none focus:border-emerald-500 font-bold"
            />
        </div>
    );
}