"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStashStore } from '@/store/CartStore';
import DashboardNavbar from '@/app/(products)/components/navbar';
import Footer from "@/components/footer";
import axios from 'axios';

export default function CheckoutPage() {
    const router = useRouter();
    const { stash } = useStashStore();

    const [address, setAddress] = useState({
        name: '', street: '', city: '', state: '', zip: '', country: 'US'
    });

    const [rates, setRates] = useState([]);
    const [selectedRate, setSelectedRate] = useState(null);
    const [loadingRates, setLoadingRates] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const fillTestAddress = () => {
        setAddress({
            name: 'John Doe',
            street: '1060 West Addison Street',
            city: 'Chicago',
            state: 'IL',
            zip: '60613',
            country: 'US'
        });
    };

    useEffect(() => {
        if (address.zip.length === 5) {
            fetchShippingRates();
        }
    }, [address.zip]);

    const fetchShippingRates = async () => {
        setLoadingRates(true);
        try {
            const response = await axios.post('/shipping/rates', {
                addressTo: address,
                parcel: { length: 10, width: 10, height: 10, weight: 2 }
            });

            if (response.data.success) {
                setRates(response.data.rates);
                setSelectedRate(response.data.rates[0]);
            }
        } catch (error) {
            console.error("Rate Error:", error.response?.data || error.message);
        } finally {
            setLoadingRates(false);
        }
    };

    const subtotal = stash.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    const total = subtotal + (selectedRate ? parseFloat(selectedRate.amount) : 0);

    // --- INTEGRATED STRIPE CHECKOUT LOGIC ---
    const handleCheckout = async () => {
        if (!selectedRate) return;

        setIsProcessing(true);
        try {
            // 1. Call your Stripe API route (ensure this is in src/app/api/checkout/route.js)
            const response = await axios.post('/stripeApi/checkout', {
                items: stash,
                shippingCost: selectedRate.amount,
                addressTo: address // Optional: send address to Stripe for logging
            });

            // 2. Redirect to Stripe's hosted checkout page
            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                throw new Error("No checkout URL received from server");
            }

        } catch (error) {
            console.error("Stripe Integration Error:", error);
            alert("Payment initialization failed. Ensure you have 'stripe' installed and API keys set.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <DashboardNavbar />
            <main className="flex-grow max-w-6xl mx-auto w-full p-6 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side: Shipping Form */}
                    <div className="lg:col-span-7 space-y-10">
                        <div className="flex justify-between items-end">
                            <h1 className="text-3xl font-black uppercase text-slate-900">Shipping.</h1>
                            <button
                                onClick={fillTestAddress}
                                className="text-[10px] font-black text-emerald-500 border-b-2 border-emerald-500 uppercase pb-1 hover:text-slate-900 hover:border-slate-900 transition-all"
                            >
                                Quick Fill Address
                            </button>
                        </div>

                        <div className="space-y-4">
                            <Input label="Full Name" value={address.name} onChange={(v) => setAddress({...address, name: v})} />
                            <Input label="Street Address" value={address.street} onChange={(v) => setAddress({...address, street: v})} />
                            <div className="grid grid-cols-3 gap-4">
                                <Input label="City" value={address.city} onChange={(v) => setAddress({...address, city: v})} />
                                <Input label="State" value={address.state} onChange={(v) => setAddress({...address, state: v})} />
                                <Input label="Zip Code" value={address.zip} onChange={(v) => setAddress({...address, zip: v.slice(0, 5)})} />
                            </div>
                        </div>

                        <div className="pt-6">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Select Shipping</h3>
                            {loadingRates ? (
                                <div className="p-10 bg-slate-50 rounded-2xl animate-pulse text-center font-bold text-[10px]">FETCHING RATES...</div>
                            ) : rates.length > 0 ? (
                                <div className="space-y-2">
                                    {rates.slice(0, 3).map((rate) => (
                                        <div
                                            key={rate.object_id}
                                            onClick={() => setSelectedRate(rate)}
                                            className={`p-4 border-2 rounded-xl cursor-pointer flex justify-between transition-all ${selectedRate?.object_id === rate.object_id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'}`}
                                        >
                                            <span className="text-xs font-bold uppercase">{rate.provider} - {rate.servicelevel.name}</span>
                                            <span className="text-xs font-black">${rate.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 border-2 border-dashed rounded-2xl text-center text-[10px] text-slate-300 uppercase font-black">ENTER ZIP FOR RATES</div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Order Summary Card */}
                    <div className="lg:col-span-5">
                        <div className="bg-[#0a192f] rounded-[2.5rem] p-8 text-white sticky top-24 shadow-2xl">
                            <h2 className="text-[10px] font-black uppercase opacity-30 mb-8 tracking-widest">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter opacity-60">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter opacity-60">
                                    <span>Shipping</span>
                                    <span>{selectedRate ? `$${selectedRate.amount}` : '--'}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-3xl font-black border-t border-white/10 pt-6">
                                <span className="text-[10px] uppercase opacity-50 tracking-widest">Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={!selectedRate || isProcessing}
                                className="w-full bg-emerald-500 text-slate-900 py-5 rounded-2xl mt-8 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                            >
                                {isProcessing ? 'Redirecting to Stripe...' : 'Complete Purchase'}
                            </button>

                            {!selectedRate && !loadingRates && (
                                <p className="text-[8px] text-center mt-4 uppercase font-bold text-white/30 tracking-widest italic">
                                    Please select shipping to continue
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

// Input Component
function Input({ label, value, onChange }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl px-4 py-4 text-sm font-bold focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-sm text-slate-900"
            />
        </div>
    );
}