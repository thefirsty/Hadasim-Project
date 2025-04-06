import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Order, OrderStatus } from '../types/order';
import { orderService } from '../services/orderService';

interface OrderState {
    orders: Order[];
    selectedOrder: Order | null;
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null,
};

export const fetchOrders = createAsyncThunk(
    'orders/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await orderService.getOrders();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    'orders/fetchById',
    async (orderId: number, { rejectWithValue }) => {
        try {
            return await orderService.getOrderById(orderId);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const createOrder = createAsyncThunk(
    'orders/create',
    async (order: Order, { rejectWithValue }) => {
        try {
            return await orderService.createOrder(order);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    'orders/updateStatus',
    async ({ orderId, status }: { orderId: number; status: OrderStatus }, { rejectWithValue }) => {
        try {
            await orderService.updateOrderStatus(orderId, status);
            return { orderId, status };
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.selectedOrder = action.payload;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.orders.push(action.payload);
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const { orderId, status } = action.payload;
                const order = state.orders.find(o => o.orderId === orderId);
                if (order) {
                    order.status = status;
                }
                if (state.selectedOrder?.orderId === orderId) {
                    state.selectedOrder.status = status;
                }
            });
    },
});

export default orderSlice.reducer; 