import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchProducts } from '../store/productSlice';
import { Product } from '../types/product';

const ProductList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { products, loading, error } = useSelector((state: RootState) => state.products) as { products: Product[], loading: boolean, error: string | null };

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) return (
        <div className="product-list">
            <h2>Products</h2>
            <div className="loading-message">Loading products...</div>
        </div>
    );

    if (error) return (
        <div className="product-list">
            <h2>Products</h2>
            <div className="error-message">Error: {error}</div>
        </div>
    );

    return (
        <div className="product-list">
            <h2>Products</h2>
            <div className="products-grid">
                {products.map((product) => (
                    <div key={product.productId} className="product-card">
                        {product.image && (
                            <img src={product.image} alt={product.productName} className="product-image" />
                        )}
                        <h3>{product.productName}</h3>
                        <p className="description">{product.description}</p>
                        <div className="product-details">
                            <p className="price">₪{product.unitPrice.toFixed(2)}</p>
                            <p className="min-quantity">Min. Quantity: {product.minOrderQuantity}</p>
                        </div>
                    </div>
                ))}
            </div>
            {products.length === 0 && (
                <div className="no-products">
                    No products available
                </div>
            )}
        </div>
    );
};

export default ProductList; 