import axios from 'axios';
import { OrderItem } from '../types/order';

const API_URL = 'https://localhost:7012/api/OrderItem';

export const orderItemService = {
    async getAllOrderItems(): Promise<OrderItem[]> {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                throw new Error(`Failed to fetch order items: ${errorMessage}`);
            }
            throw new Error('An unexpected error occurred while fetching order items');
        }
    },

    async getOrderItemById(id: number): Promise<OrderItem> {
        try {
            const response = await axios.get(`${API_URL}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                throw new Error(`Failed to fetch order item: ${errorMessage}`);
            }
            throw new Error('An unexpected error occurred while fetching order item');
        }
    },

    async addOrderItem(orderItem: OrderItem): Promise<void> {
        try {
            const formData = new FormData();
            Object.entries(orderItem).forEach(([key, value]) => {
                if (value !== undefined) {
                    formData.append(key, value.toString());
                }
            });

            await axios.post(API_URL, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                throw new Error(`Failed to add order item: ${errorMessage}`);
            }
            throw new Error('An unexpected error occurred while adding order item');
        }
    }
}; 