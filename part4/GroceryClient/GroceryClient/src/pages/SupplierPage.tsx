import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SupplierPage.css';
import SupplierOrders from '../components/SupplierOrders';

const SupplierPage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <div className="supplier-container">
            <header className="supplier-header">
                <h1>Supplier Home Page</h1>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </header>
            
            <main className="supplier-content">
                <div className="supplier-section">
                </div>
                
                <div className="supplier-actions">
                    <div className="action-row">
                        <button className="action-button" onClick={() => navigate('/supplier/products')}>
                            Manage Products
                        </button>
                        <button className="action-button" onClick={() => navigate('/supplier/orders')}>
                            Manage Orders
                        </button>
                    </div>
                </div>

                <div className="orders-section">
                    <h2>Recent Orders</h2>
                    <SupplierOrders />
                </div>
            </main>
        </div>
    );
};

export default SupplierPage; 