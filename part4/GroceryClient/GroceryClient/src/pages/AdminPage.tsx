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
                <h1>דף הבית של בעל החנות</h1>
                <button onClick={handleLogout} className="logout-button">
                    התנתק
                </button>
            </header>
            
            <main className="admin-content">
                <div className="admin-section">
                    <h2>ברוך הבא למערכת הניהול</h2>
                    <p>כאן תוכל לנהל את החנות שלך</p>
                </div>
                
                <div className="admin-actions">
                    <div className="action-row">
                       
                        <button className="action-button" onClick={() => navigate('/orders')}>
                            צפייה בהזמנות
                        </button>
                        
                    </div>
                    
                    
                </div>
            </main>
        </div>
    );
};

export default AdminPage; 