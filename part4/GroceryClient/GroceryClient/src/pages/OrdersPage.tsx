import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderItemList from '../components/OrderItemList';
import './OrdersPage.css';

interface Order {
    id: number;
    orderDate: string;
    status: string;
    totalAmount: number;
    items: OrderItem[];
}

interface OrderItem {
    id: number;
    productName: string;
    quantity: number;
    price: number;
}

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('לא נמצא טוקן התחברות');
                }

                const response = await axios.get('https://localhost:7012/api/Order', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': '*/*'
                    }
                });

                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    setError('לא נמצאו הזמנות במערכת');
                } else {
                    setError('שגיאה בטעינת ההזמנות');
                }
                setLoading(false);
                console.error('Error fetching orders:', err);
            }
        };

        fetchOrders();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('he-IL');
    };

    if (loading) {
        return <div className="orders-container">טוען הזמנות...</div>;
    }

    if (error) {
        return (
            <div className="orders-container">
                <h1>הזמנות</h1>
                <div className="error-message">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <h1>הזמנות</h1>
            {orders.length === 0 ? (
                <p>לא נמצאו הזמנות</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <h3>הזמנה #{order.id}</h3>
                                <span className="order-date">{formatDate(order.orderDate)}</span>
                            </div>
                            <div className="order-status">
                                סטטוס: {order.status}
                            </div>
                            <div className="order-items">
                                <h4>פריטים בהזמנה:</h4>
                                <ul>
                                    {order.items.map((item) => (
                                        <li key={item.id}>
                                            {item.productName} - {item.quantity} יחידות - ₪{item.price}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="order-total">
                                סה"כ: ₪{order.totalAmount}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <OrderItemList />
        </div>
    );
};

export default OrdersPage; 