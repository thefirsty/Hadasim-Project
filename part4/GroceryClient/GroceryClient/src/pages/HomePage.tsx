import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './HomePage.css';

interface TokenPayload {
    role?: string;
    nameid?: string;
    email?: string;
    exp?: number;
    iss?: string;
    aud?: string;
}

const extractRoleFromToken = (token: string): string => {
    try {
        console.log('Starting token extraction...');
        const decoded = jwtDecode<TokenPayload>(token);
        console.log('Decoded token:', decoded);
        
        const role = decoded.role;
        console.log('Extracted role:', role);
        return role || '';
    } catch (error) {
        console.error('Error extracting role from token:', error);
        return '';
    }
};

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        let role = localStorage.getItem('role');
        
        console.log('Token from localStorage:', token);
        console.log('Role from localStorage:', role);
        
        if (token) {
            if (!role) {
                role = extractRoleFromToken(token);
                console.log('Extracted role from token:', role);
                if (role) {
                    localStorage.setItem('role', role);
                    console.log('Saved role to localStorage:', role);
                }
            }
            
            if (role) {
                setIsAuthenticated(true);
                setUserRole(role);
            }
        }
    }, []);

    useEffect(() => {
        console.log('Current state:', { isAuthenticated, userRole });
        // Only redirect if we have both authentication and role
        if (isAuthenticated && userRole) {
            console.log('Attempting to redirect...');
            if (userRole.toUpperCase() === 'ADMIN') {
                console.log('Redirecting to admin page');
                navigate('/admin');
            } else if (userRole.toUpperCase() === 'SUPPLIER') {
                console.log('Redirecting to supplier page');
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
                
                {isAuthenticated && (
                    <div className="user-actions">
                        <button 
                            className="action-button orders"
                            onClick={() => navigate('/orders')}
                        >
                            ההזמנות שלי
                        </button>
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