import api from '@/services/api';

export const mediaService = {
    getSignature: async (folder, ownerId) => {
        const response = await api.get('/stash/media/signature', {
            params: { folder, ownerId }
        });
        return response.data;
    },
};