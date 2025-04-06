import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import './App.css';
import AdminPage from './pages/AdminPage';

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={<AdminPage />} />
                    {/* Add other routes here */}
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;
