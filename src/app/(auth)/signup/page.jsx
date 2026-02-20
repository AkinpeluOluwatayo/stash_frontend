"use client";
import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';

// Google Icon Component for reuse
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

export default function SignUpPage() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '',
        password: '', phoneNumber: '', address: '', role: 'USER'
    });

    const handleGoogleSignUp = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
    };

    const signupMutation = useMutation({
        mutationFn: async (data) => {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        firstName: data.firstName,
                        lastName: data.lastName
                    },
                    emailRedirectTo: `${window.location.origin}/login`
                }
            });
            if (authError) throw authError;
            return authData;
        },
        onSuccess: () => {
            toast.success('SIGNUP SUCCESSFUL', {
                description: 'Verification email has been dispatched.',
                className: 'font-black uppercase tracking-tighter italic border-2 border-emerald-500/20',
            });
            setStep(3);
        },
        onError: (error) => {
            // ADDED: SIGNUP FAILED TOAST
            toast.error('SIGNUP FAILED', {
                description: error.message || 'Transmission interrupted. Try again.',
                className: 'font-black uppercase tracking-tighter italic border-2 border-red-500/20',
            });
        }
    });

    return (
        <div className="min-h-screen bg-brand-surface text-brand-text flex flex-col items-center justify-center px-6 py-12">
            <Toaster position="top-right" richColors toastOptions={{
                style: { borderRadius: '0px', textTransform: 'uppercase' }
            }} />

            <div className="absolute top-8 left-8">
                <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter text-brand-accent cursor-pointer">STASH.</h1></Link>
            </div>

            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100">
                {step < 3 && (
                    <div className="mb-8">
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none mb-4">
                            {step === 1 ? "Identity" : "Profile"}
                        </h2>
                        <div className="h-1 w-full bg-slate-50 rounded-full">
                            <div className="h-full bg-brand-accent transition-all duration-500" style={{ width: step === 1 ? '50%' : '100%' }} />
                        </div>
                    </div>
                )}

                {/* Optional: You can keep this inline error or rely entirely on the Toast */}
                {signupMutation.isError && (
                    <div className="mb-6 p-4 text-[10px] font-bold uppercase tracking-widest rounded-lg border bg-red-50 border-red-100 text-red-500 text-center">
                        {signupMutation.error.message}
                    </div>
                )}

                {step === 1 && (
                    <>
                        <button
                            onClick={handleGoogleSignUp}
                            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 text-slate-900 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 mb-6 transition-all active:scale-95 shadow-sm"
                        >
                            <GoogleIcon />
                            Sign Up with Google
                        </button>
                        <div className="flex items-center gap-4 mb-6 opacity-20"><div className="h-px bg-slate-900 flex-grow"></div><span className="text-[8px] font-black uppercase">OR USE EMAIL</span><div className="h-px bg-slate-900 flex-grow"></div></div>

                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="First Name" value={formData.firstName} onChange={(v) => setFormData({...formData, firstName: v})} />
                                <InputField label="Last Name" value={formData.lastName} onChange={(v) => setFormData({...formData, lastName: v})} />
                            </div>
                            <InputField label="Email Address" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                            <InputField label="Password" type="password" value={formData.password} onChange={(v) => setFormData({...formData, password: v})} />
                            <button type="button" onClick={() => setStep(2)} className="w-full bg-brand-text text-white py-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg hover:opacity-90 transition-opacity">Continue</button>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <form onSubmit={(e) => {e.preventDefault(); signupMutation.mutate(formData);}} className="space-y-4">
                        <InputField label="Phone Number" type="tel" value={formData.phoneNumber} onChange={(v) => setFormData({...formData, phoneNumber: v})} />
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Shipping Address</label>
                            <textarea required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full border-2 border-slate-50 rounded-xl py-3 px-4 text-sm focus:border-brand-accent outline-none bg-slate-50/50 min-h-[100px] resize-none" placeholder="Full Address Details..." />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setStep(1)} className="flex-1 border-2 border-slate-100 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg text-slate-400">Back</button>
                            <button type="submit" disabled={signupMutation.isPending} className="flex-[2] bg-brand-accent text-white py-4 text-[11px] font-black uppercase tracking-[0.2em] shadow-xl rounded-lg active:scale-95 transition-all">
                                {signupMutation.isPending ? "Syncing..." : "Join Stash"}
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <div className="text-center py-4">
                        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-green-50 text-green-500 rounded-full">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Check Your Email</h2>
                        <p className="text-sm text-slate-500 mb-8">Confirm your link to start stashing.</p>
                        <Link href="/login" className="block w-full bg-brand-text text-white py-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-lg text-center">Return to Login</Link>
                    </div>
                )}

                {step < 3 && (
                    <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Already have an account? <Link href="/login" className="text-brand-accent hover:underline ml-1">Sign In</Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function InputField({ label, type = "text", value, onChange }) {
    return (
        <div className="space-y-1.5 group">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</label>
            <input required type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border-2 border-slate-50 rounded-xl py-3 px-4 text-sm focus:border-brand-accent outline-none bg-slate-50/50" />
        </div>
    );
}