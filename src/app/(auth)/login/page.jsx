"use client";
import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/middleware'; // Import your Zustand + Cookie store

// Google Icon Component
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

export default function LoginPage() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const router = useRouter();
    const searchParams = useSearchParams();
    const setLogin = useAuthStore((state) => state.setLogin); // Auth store setter

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handle Google Login
    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            },
        });
        if (error) alert(error.message);
    };

    // Mutation for Email/Password Login
    const loginMutation = useMutation({
        mutationFn: async ({ email, password }) => {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            // 1. Sync session to Zustand & Cookies so Middleware sees it
            setLogin(data.user, data.session.access_token);

            // 2. Redirect to 'redirect' param if it exists, otherwise dashboard
            const destination = searchParams.get('redirect') || '/dashboard';
            router.push(destination);
            router.refresh(); // Refresh to ensure middleware catches the new cookie
        }
    });

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-6 py-12">
            {/* Header / Logo */}
            <div className="absolute top-8 left-8">
                <Link href="/">
                    <h1 className="text-2xl font-black italic tracking-tighter text-emerald-500 cursor-pointer">
                        STASH<span className="text-slate-900">.</span>
                    </h1>
                </Link>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
                <header className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">
                        Welcome <br /> Back<span className="text-emerald-500">.</span>
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-4">Enter your credentials to access your stash</p>
                </header>

                {/* SOCIAL LOGIN */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95 mb-8"
                >
                    <GoogleIcon />
                    Continue with Google
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-slate-100 flex-grow"></div>
                    <span className="text-[8px] font-black uppercase text-slate-300">or use email</span>
                    <div className="h-px bg-slate-100 flex-grow"></div>
                </div>

                {/* ERROR FEEDBACK */}
                {loginMutation.isError && (
                    <div className="mb-6 p-4 text-[10px] font-bold uppercase tracking-widest rounded-xl border bg-red-50 border-red-100 text-red-500 text-center animate-shake">
                        {loginMutation.error.message}
                    </div>
                )}

                {/* LOGIN FORM */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        loginMutation.mutate({ email, password });
                    }}
                    className="space-y-6"
                >
                    <InputField
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="name@example.com"
                    />
                    <InputField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        placeholder="••••••••"
                    />

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full bg-[#0a192f] text-white py-5 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-emerald-500 hover:text-[#0a192f] transition-all disabled:opacity-50"
                    >
                        {loginMutation.isPending ? "Authenticating..." : "Enter Stash"}
                    </button>
                </form>

                <footer className="mt-10 pt-8 border-t border-slate-50 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Don't have an account?
                        <Link href="/signup" className="text-emerald-500 hover:text-emerald-600 ml-1 transition-colors">
                            Sign up here
                        </Link>
                    </p>
                </footer>
            </div>
        </div>
    );
}

/**
 * Reusable Styled Input Component
 */
function InputField({ label, type = "text", value, onChange, placeholder }) {
    return (
        <div className="space-y-2 group">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                {label}
            </label>
            <input
                required
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border-2 border-slate-50 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 focus:border-emerald-500 focus:bg-white outline-none bg-slate-50/50 transition-all placeholder:text-slate-300"
            />
        </div>
    );
}