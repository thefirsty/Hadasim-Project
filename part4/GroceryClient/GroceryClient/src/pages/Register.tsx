import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supplierService, SupplierDto } from '../services/supplierService';
import './Register.css';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contactName, setContactName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const supplierData: SupplierDto = {
                SupplierId: 0,
                ContactName: contactName,
                CompanyName: companyName,
                Phone: phone,
                UserId: 0,
                Role: 'SUPPLIER',
                Password: password,
                Email: email
            };

            await supplierService.createSupplier(supplierData);
            
            setSuccess('Registration successful! Redirecting to login page...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error('Registration error:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An error occurred during registration. Please try again.');
            }
        }
    };

    return (
        <div className="register-container">
            <h2>Register as Supplier</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm your password"
                    />
                </div>
                <div className="form-group">
                    <label>Contact Name</label>
                    <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                        placeholder="Enter contact name"
                    />
                </div>
                <div className="form-group">
                    <label>Company Name</label>
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        placeholder="Enter company name"
                    />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="Enter phone number"
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            <p className="auth-link">
                Already have an account? <a href="/login">Login here</a>
            </p>
        </div>
    );
};

export default Register; 