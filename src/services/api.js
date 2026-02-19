import axios from 'axios';
import { createBrowserClient } from '@supabase/ssr';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

// Request interceptor to add the JWT to every call
api.interceptors.request.use(async (config) => {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;