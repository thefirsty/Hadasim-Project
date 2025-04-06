import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SupplierOrders.css';

interface Order {
    id: number;
    orderDate: string;
    status: string;
    totalAmount: number;
    // Add other order properties as needed
}

const SupplierOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/orders/by-supplier/5', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        setError('נדרשת התחברות מחדש');
                    } else if (error.response?.status === 404) {
                        setError('לא נמצאו הזמנות');
                    } else {
                        setError('שגיאה בטעינת ההזמנות');
                    }
                } else {
                    setError('שגיאה בטעינת ההזמנות');
                }
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div>טוען הזמנות...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="supplier-orders">
            <h2>הזמנות</h2>
            {orders.length === 0 ? (
                <p>אין הזמנות להצגה</p>
            ) : (
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>מספר הזמנה</th>
                            <th>תאריך</th>
                            <th>סטטוס</th>
                            <th>סכום</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString('he-IL')}</td>
                                <td>{order.status}</td>
                                <td>{order.totalAmount} ₪</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SupplierOrders; 