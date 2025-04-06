import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import orderReducer from './orderSlice';
import orderItemReducer from './orderItemSlice';

export const store = configureStore({
    reducer: {
        products: productReducer,
        orders: orderReducer,
        orderItems: orderItemReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 