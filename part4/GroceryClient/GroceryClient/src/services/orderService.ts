import axios from 'axios';
import { Order, OrderStatus } from '../types/order';

const API_URL = 'https://localhost:7012/api/Order';

export const orderService = {
    async createOrder(order: Order): Promise<Order> {
        try {
            const response = await axios.post(API_URL, order, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                throw new Error(`Failed to create order: ${errorMessage}`);
            }
            throw new Error('An unexpected error occurred while creating order');
        }
    },

    async updateOrderStatus(orderId: number, status: OrderStatus): Promise<void> {
        try {
            await axios.put(`${API_URL}/${orderId}/status`, { status }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                throw new Error(`Failed to update order status: ${errorMessage}`);
            }
            throw new Error('An unexpected error occurred while updating order status');
        }
    },

    async getOrders(): Promise<Order[]> {
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
                throw new Error(`Failed to fetch orders: ${errorMessage}`);
            }
            throw new Error('An unexpected error occurred while fetching orders');
        }
    },

    async getOrderById(orderId: number): Promise<Order> {
        try {
            const response = await axios.get(`${API_URL}/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                throw new Error(`Failed to fetch order: ${errorMessage}`);
            }
            throw new Error('An unexpected error occurred while fetching order');
        }
    }
}; 