import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (token && role) {
            setIsAuthenticated(true);
            setUserRole(role);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated && userRole) {
            if (userRole === 'ADMIN') {
                navigate('/admin');
            } else if (userRole === 'SUPPLIER') {
                navigate('/supplier');
            }
        }
    }, [isAuthenticated, userRole, navigate]);

    return (
        <div className="home-container">
            <header className="header">
                <h1>מערכת הזמנת מוצרים למכולת</h1>
                <p>הזמן בקלות את כל המוצרים שאתה צריך</p>
            </header>
            
            <main className="main-content">
                {!isAuthenticated && (
                    <div className="auth-buttons">
                        <Link to="/register" className="auth-button register">
                            הרשמה
                        </Link>
                        <Link to="/login" className="auth-button login">
                            התחברות
                        </Link>
                    </div>
                )}
                
                <div className="features">
                    <div className="feature-card">
                        <h3>הזמנה מהירה</h3>
                        <p>הזמן את המוצרים שאתה צריך בקלות ובמהירות</p>
                    </div>
                    <div className="feature-card">
                        <h3>מעקב הזמנות</h3>
                        <p>עקוב אחרי כל ההזמנות שלך במקום אחד</p>
                    </div>
                    <div className="feature-card">
                        <h3>מחירים תחרותיים</h3>
                        <p>הנחות מיוחדות למשתמשים רשומים</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage; 