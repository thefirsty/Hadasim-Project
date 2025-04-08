import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

const AdminPage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Store Owner Home Page</h1>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </header>
            
            <main className="admin-content">
                
                
                <div className="admin-actions">
                    <div className="action-row">
                       
                        <button className="action-button" onClick={() => navigate('/orders')}>
                            View Orders
                        </button>
                        
                    </div>
                    
                    
                </div>
            </main>
        </div>
    );
};

export default AdminPage; 