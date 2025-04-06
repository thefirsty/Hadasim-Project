import { Product } from '../types/product';

const API_BASE_URL = 'http://localhost:5000/api/Product';

export const productService = {
    getAll: async (): Promise<Product[]> => {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        return response.json();
    },

    getById: async (id: number): Promise<Product> => {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product');
        }
        return response.json();
    },

    add: async (product: Product): Promise<void> => {
        const formData = new FormData();
        Object.entries(product).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value);
            }
        });

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to add product');
        }
    }
}; 