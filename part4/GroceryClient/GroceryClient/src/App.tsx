import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import OrdersPage from './pages/OrdersPage';
import SupplierPage from './pages/SupplierPage';
import SupplierProductsPage from './pages/SupplierProductsPage';
import './App.css';


const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/supplier" element={<SupplierPage />} />
                    <Route path="/supplier/products" element={<SupplierProductsPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;
