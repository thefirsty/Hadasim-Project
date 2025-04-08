import React, { useState } from 'react';
import { authService, LoginDto } from '../services/authService';
import './Auth.css';

const Login: React.FC = () => {
    const [formData, setFormData] = useState<LoginDto>({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(formData);
            console.log('Login response:', response);
            console.log('Role type:', typeof response.role);
            console.log('Role value:', response.role);
            console.log('Role uppercase:', response.role?.toUpperCase());
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.role);
            
            console.log('Stored in localStorage:', {
                token: localStorage.getItem('token'),
                role: localStorage.getItem('role')
            });
            
            const userRole = response.role?.toUpperCase();
            console.log('User role for navigation:', userRole);
            
            if (userRole === 'ADMIN') {
                console.log('Redirecting to admin page');
                window.location.href = '/admin';
            } else if (userRole === 'SUPPLIER') {
                console.log('Redirecting to supplier page');
                window.location.href = '/supplier';
            } else {
                console.log('Unknown role:', userRole);
            }
        } catch (err) {
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                setError(axiosError.response?.data?.message || 'An error occurred during login');
            } else {
                setError('An error occurred during login');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="auth-link">
                    Don't have an account? <a href="/register">Register here</a>
                </p>
            </div>
        </div>
    );
};

export default Login; 