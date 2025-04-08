import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
}

const ProductForm: React.FC = () => {
    const [supplierId, setSupplierId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({
        productId: 0,
        productName: '',
        unitPrice: 0,
        minOrderQuantity: 1,
        supplierId: 0
    });

    useEffect(() => {
        const fetchSupplierId = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                // Decode token to get user ID
                const decoded = jwtDecode<TokenPayload>(token);
                const userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

                // Get supplier ID using user ID
                const response = await axios.get(`https://localhost:7012/api/Supplier/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setSupplierId(response.data.supplierId);
                setFormData(prev => ({
                    ...prev,
                    supplierId: response.data.supplierId
                }));
            } catch (error) {
                console.error('Failed to fetch supplier ID:', error);
            }
        };

        fetchSupplierId();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'unitPrice' || name === 'minOrderQuantity' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supplierId) {
            alert('Cannot add product without supplier identification');
            return;
        }

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined) {
                    formDataToSend.append(key, value.toString());
                }
            });

            const token = localStorage.getItem('token');
            await axios.post('https://localhost:7012/api/Product', formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setFormData({
                productId: 0,
                productName: '',
                unitPrice: 0,
                minOrderQuantity: 1,
                supplierId: supplierId
            });
        } catch (error) {
            console.error('Failed to add product:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <h2>Add New Product</h2>
            <div className="form-group">
                <label htmlFor="productName">Product Name:</label>
                <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="unitPrice">Price:</label>
                <input
                    type="number"
                    id="unitPrice"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                />
            </div>
            <div className="form-group">
                <label htmlFor="minOrderQuantity">Minimum Order Quantity:</label>
                <input
                    type="number"
                    id="minOrderQuantity"
                    name="minOrderQuantity"
                    value={formData.minOrderQuantity}
                    onChange={handleChange}
                    required
                    min="1"
                    step="1"
                />
            </div>
            <button type="submit">Add Product</button>
        </form>
    );
};

export default ProductForm; 