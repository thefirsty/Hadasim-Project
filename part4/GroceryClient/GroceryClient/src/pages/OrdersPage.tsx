import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderItemList from '../components/OrderItemList';
import './OrdersPage.css';
import { Order, OrderItem, OrderStatus } from '../types/order';

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showNewOrderForm, setShowNewOrderForm] = useState<boolean>(false);
    const [newOrder, setNewOrder] = useState<Partial<Order>>({
        items: [],
        status: OrderStatus.PENDING,
        totalAmount: 0
    });
    const [newOrderItem, setNewOrderItem] = useState<Partial<OrderItem>>({
        productId: 0,
        quantity: 1,
        price: 0
    });

    useEffect(() => {
        fetchOrders();
    }, []);

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

    const handleAddOrderItem = () => {
        if (newOrderItem.productId && newOrderItem.quantity && newOrderItem.price) {
            const item: OrderItem = {
                id: 0, // Will be set by the server
                productId: newOrderItem.productId,
                productName: '', // Will be set by the server
                quantity: newOrderItem.quantity,
                price: newOrderItem.price,
                orderId: 0 // Will be set by the server
            };

            setNewOrder(prev => ({
                ...prev,
                items: [...(prev.items || []), item],
                totalAmount: (prev.totalAmount || 0) + (item.price * item.quantity)
            }));

            setNewOrderItem({
                productId: 0,
                quantity: 1,
                price: 0
            });
        }
    };

    const handleCreateOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('לא נמצא טוקן התחברות');
            }

            await axios.post('https://localhost:7012/api/Order', newOrder, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setShowNewOrderForm(false);
            setNewOrder({
                items: [],
                status: OrderStatus.PENDING,
                totalAmount: 0
            });
            fetchOrders();
        } catch (err) {
            console.error('Error creating order:', err);
            setError('שגיאה ביצירת ההזמנה');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('he-IL');
    };

    if (loading) {
        return <div className="orders-container">טוען הזמנות...</div>;
    }

    return (
        <div className="orders-container">
            <h1>הזמנות</h1>
            
            <button 
                className="add-order-button"
                onClick={() => setShowNewOrderForm(!showNewOrderForm)}
            >
                {showNewOrderForm ? 'ביטול' : 'הוסף הזמנה חדשה'}
            </button>

            {showNewOrderForm && (
                <div className="new-order-form">
                    <h2>הזמנה חדשה</h2>
                    <div className="order-items-form">
                        <h3>הוסף פריטים להזמנה</h3>
                        <div className="form-group">
                            <input
                                type="number"
                                placeholder="מזהה מוצר"
                                value={newOrderItem.productId || ''}
                                onChange={(e) => setNewOrderItem({ ...newOrderItem, productId: parseInt(e.target.value) })}
                            />
                            <input
                                type="number"
                                placeholder="כמות"
                                value={newOrderItem.quantity || ''}
                                onChange={(e) => setNewOrderItem({ ...newOrderItem, quantity: parseInt(e.target.value) })}
                            />
                            <input
                                type="number"
                                placeholder="מחיר"
                                value={newOrderItem.price || ''}
                                onChange={(e) => setNewOrderItem({ ...newOrderItem, price: parseFloat(e.target.value) })}
                            />
                            <button onClick={handleAddOrderItem}>הוסף פריט</button>
                        </div>
                    </div>

                    <div className="order-items-list">
                        <h3>פריטים בהזמנה</h3>
                        {newOrder.items?.map((item, index) => (
                            <div key={index} className="order-item-card">
                                <p>מוצר #{item.productId}</p>
                                <p>כמות: {item.quantity}</p>
                                <p>מחיר: ₪{item.price}</p>
                            </div>
                        ))}
                    </div>

                    <div className="order-total">
                        <h3>סה"כ: ₪{newOrder.totalAmount}</h3>
                    </div>

                    <button 
                        className="create-order-button"
                        onClick={handleCreateOrder}
                        disabled={!newOrder.items?.length}
                    >
                        צור הזמנה
                    </button>
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <p>לא נמצאו הזמנות</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.orderId} className="order-card">
                            <div className="order-header">
                                <h3>הזמנה #{order.orderId}</h3>
                                <span className="order-date">{formatDate(order.createdAt || '')}</span>
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