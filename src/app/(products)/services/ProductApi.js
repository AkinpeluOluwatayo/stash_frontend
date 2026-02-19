import api from '@/services/api';

export const productService = {
    // --- Product Management ---

    // POST /stash/products/create
    createProduct: async (productData) => {
        const response = await api.post('/stash/products/create', productData);
        return response.data;
    },

    // PUT /stash/products/update
    updateProduct: async (productData) => {
        const response = await api.put('/stash/products/update', productData);
        return response.data;
    },

    // DELETE /stash/products/delete
    deleteProduct: async (productData) => {
        const response = await api.delete('/stash/products/delete', { data: productData });
        return response.data;
    },

    // --- Retrieval & Search ---

    // GET /stash/products (Paginated)
    getAllProducts: async (page = 0, pageSize = 10) => {
        const response = await api.get('/stash/products', {
            params: { page, pageSize }
        });
        return response.data;
    },

    // GET /stash/products/{productId}
    getProductById: async (productId) => {
        const response = await api.get(`/stash/products/${productId}`);
        return response.data;
    },

    // GET /stash/products/seller/{sellerId}
    getProductsBySeller: async (sellerId, page = 0, pageSize = 10) => {
        const response = await api.get(`/stash/products/seller/${sellerId}`, {
            params: { page, pageSize }
        });
        return response.data;
    },

    // POST /stash/products/search
    searchProducts: async (searchCriteria) => {
        const response = await api.post('/stash/products/search', searchCriteria);
        return response.data;
    },

    // --- Inventory & Stock Control ---

    // PUT /stash/products/reduce-stock/{productId}
    reduceStock: async (productId, quantity) => {
        const response = await api.put(`/stash/products/reduce-stock/${productId}`, null, {
            params: { quantity }
        });
        return response.data;
    },

    // PUT /stash/products/restore-stock/{productId}
    restoreStock: async (productId, quantity) => {
        const response = await api.put(`/stash/products/restore-stock/${productId}`, null, {
            params: { quantity }
        });
        return response.data;
    },

    // GET /stash/products/in-stock/{productId}
    checkInStock: async (productId, requestedQuantity) => {
        const response = await api.get(`/stash/products/in-stock/${productId}`, {
            params: { requestedQuantity }
        });
        return response.data;
    },


    getSignature: async (folder, ownerId) => {
        const response = await api.get('/stash/media/signature', {
            params: { folder, ownerId }
        });
        return response.data;
    }
};