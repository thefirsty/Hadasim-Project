import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { OrderItem } from '../types/order';
import { orderItemService } from '../services/orderItemService';

interface OrderItemState {
    orderItems: OrderItem[];
    selectedOrderItem: OrderItem | null;
    loading: boolean;
    error: string | null;
}

const initialState: OrderItemState = {
    orderItems: [],
    selectedOrderItem: null,
    loading: false,
    error: null,
};

export const fetchOrderItems = createAsyncThunk(
    'orderItems/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await orderItemService.getAllOrderItems();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchOrderItemById = createAsyncThunk(
    'orderItems/fetchById',
    async (id: number, { rejectWithValue }) => {
        try {
            return await orderItemService.getOrderItemById(id);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const addOrderItem = createAsyncThunk(
    'orderItems/add',
    async (orderItem: OrderItem, { rejectWithValue }) => {
        try {
            await orderItemService.addOrderItem(orderItem);
            return orderItem;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const orderItemSlice = createSlice({
    name: 'orderItems',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderItems.fulfilled, (state, action) => {
                state.loading = false;
                state.orderItems = action.payload;
            })
            .addCase(fetchOrderItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchOrderItemById.fulfilled, (state, action) => {
                state.selectedOrderItem = action.payload;
            })
            .addCase(addOrderItem.fulfilled, (state, action) => {
                state.orderItems.push(action.payload);
            });
    },
});

export default orderItemSlice.reducer; 