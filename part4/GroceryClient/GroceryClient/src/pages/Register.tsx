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
            setError('הסיסמאות אינן תואמות');
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
            
            setSuccess('ההרשמה בוצעה בהצלחה! מעביר אותך לדף ההתחברות...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error('Registration error:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('אירעה שגיאה בעת ההרשמה. אנא נסה שוב.');
            }
        }
    };

    return (
        <div className="register-container">
            <h2>הרשמה</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>אימייל:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>סיסמה:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>אימות סיסמה:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>שם איש קשר:</label>
                    <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>שם החברה:</label>
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>טלפון:</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">הרשמה</button>
            </form>
        </div>
    );
};

export default Register; 