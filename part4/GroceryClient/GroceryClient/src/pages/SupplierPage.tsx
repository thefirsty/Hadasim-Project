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
                <h1>דף הבית של הספק</h1>
                <button onClick={handleLogout} className="logout-button">
                    התנתק
                </button>
            </header>
            
            <main className="supplier-content">
                <div className="supplier-section">
                    <h2>ברוך הבא למערכת הספקים</h2>
                    <p>כאן תוכל לנהל את המוצרים וההזמנות שלך</p>
                </div>
                
                <div className="supplier-actions">
                    <div className="action-row">
                        <button className="action-button" onClick={() => navigate('/supplier/products')}>
                            ניהול מוצרים
                        </button>
                        <button className="action-button" onClick={() => navigate('/supplier/orders')}>
                            ניהול הזמנות
                        </button>
                    </div>
                </div>

                <div className="orders-section">
                    <h2>הזמנות אחרונות</h2>
                    <SupplierOrders />
                </div>
            </main>
        </div>
    );
};

export default SupplierPage; 