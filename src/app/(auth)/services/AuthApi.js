import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@supabase/ssr';
import axios from 'axios';

export function useUserStash() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    return useQuery({
        queryKey: ['user-stash'],
        queryFn: async () => {
            // 1. Get user from Supabase
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                return null;
            }

            const userData = {
                id: user.id,
                email: user.email,
                firstName: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || "Stash",
                lastName: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ')[1] || "User"
            };

            try {
                // 2. Sync with Spring Boot
                // Note: This is a POST to a 'permitAll' endpoint, so no Bearer token needed yet
                await axios.post('http://localhost:8080/stash/auth/sync', userData, {
                    headers: { 'Content-Type': 'application/json' }
                });
                console.log("Stash Sync: Connection Established");
            } catch (syncError) {
                // If this hits 403, your Spring Boot console STILL shows 'Generated Password'
                console.error("Stash Sync Error:", syncError.response?.status, syncError.response?.data);
            }

            return userData;
        },
        staleTime: 1000 * 60 * 5, // Cache user for 5 minutes
    });
}