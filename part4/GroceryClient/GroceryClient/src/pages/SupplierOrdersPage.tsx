import React from 'react';
import { useNavigate } from 'react-router-dom';
import SupplierOrders from '../components/SupplierOrders';
import './SupplierOrdersPage.css';

const SupplierOrdersPage: React.FC = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/supplier');
    };

    return (
        <div className="supplier-orders-page">
            <header className="supplier-orders-header">
                <h1>Orders</h1>
                <button onClick={handleBack} className="back-button">
                    Back to Home
                </button>
            </header>
            
            <main className="supplier-orders-content">
                <SupplierOrders />
            </main>
        </div>
    );
};

export default SupplierOrdersPage; 