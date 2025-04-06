import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../types/product';
import { productService } from '../services/productService';

interface ProductState {
    products: Product[];
    selectedProduct: Product | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
};

export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await productService.getAll();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchProductById = createAsyncThunk(
    'products/fetchById',
    async (id: number, { rejectWithValue }) => {
        try {
            return await productService.getById(id);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const addProduct = createAsyncThunk(
    'products/add',
    async (product: Product, { rejectWithValue }) => {
        try {
            await productService.add(product);
            return product;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.selectedProduct = action.payload;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
            });
    },
});

export default productSlice.reducer; 