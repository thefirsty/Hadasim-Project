import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import './SupplierProductsPage.css';

const SupplierProductsPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="supplier-products-container">
            <header className="supplier-products-header">
                <h1>Product Management</h1>
                <button onClick={() => navigate('/supplier')} className="back-button">
                    Back to Home
                </button>
            </header>
            
            <main className="supplier-products-content">
                <div className="products-section">
                    <ProductForm />
                    <ProductList />
                </div>
            </main>
        </div>
    );
};

export default SupplierProductsPage; 