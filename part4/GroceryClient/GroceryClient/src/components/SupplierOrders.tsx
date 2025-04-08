import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { OrderStatus } from '../types/order';
import './SupplierOrders.css';

interface Order {
    orderId: number;
    createdAt: string;
    status: OrderStatus;
    totalAmount: number;
    orderItems?: OrderItem[];
}

interface OrderItem {
    orderItemId: number;
    productName: string;
    quantity: number;
    price: number;
}

interface TokenPayload {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
}

const SupplierOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const updateOrderStatus = async (orderId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const formData = new FormData();
            formData.append('OrderId', orderId.toString());
            formData.append('Status', OrderStatus.PROCESSING);
            formData.append('CreatedDate', new Date().toISOString());
            formData.append('Products', JSON.stringify([]));

            await axios.put(`https://localhost:7012/api/Order/${orderId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Refresh orders after update
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            setError('שגיאה בעדכון סטטוס ההזמנה');
        }
    };

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            // Decode token to get user ID
            const decoded = jwtDecode<TokenPayload>(token);
            const userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

            // Get supplier ID using user ID
            const supplierResponse = await axios.get(`https://localhost:7012/api/Supplier/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const supplierId = supplierResponse.data.supplierId;

            // Get orders for the supplier
            const ordersResponse = await axios.get(`https://localhost:7012/api/Order/by-supplier/${supplierId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'accept': 'text/plain'
                }
            });
            
            console.log('Orders response:', ordersResponse.data);
            setOrders(ordersResponse.data);
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

    useEffect(() => {
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
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.orderId} className="order-card">
                            <div className="order-header">
                                <h3>הזמנה #{order.orderId}</h3>
                                <span className="order-date">
                                    {new Date(order.createdAt).toLocaleDateString('he-IL')}
                                </span>
                            </div>
                            <div className="order-status">
                                {order.status === OrderStatus.COMPLETED ? (
                                    <div className="completed-status">
                                        <span>ההזמנה התקבלה אצל בעל החנות</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>סטטוס: {order.status}</span>
                                        {order.status !== OrderStatus.PROCESSING && (
                                            <button 
                                                className="update-status-button"
                                                onClick={() => updateOrderStatus(order.orderId)}
                                            >
                                                התחל לעבד הזמנה
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                            {order.orderItems && order.orderItems.length > 0 && (
                                <div className="order-items">
                                    <h4>פריטים בהזמנה:</h4>
                                    <div className="items-list">
                                        {order.orderItems.map((item) => (
                                            <div key={item.orderItemId} className="item-card">
                                                <p><strong>שם המוצר:</strong> {item.productName}</p>
                                                <p><strong>כמות:</strong> {item.quantity}</p>
                                                <p><strong>מחיר ליחידה:</strong> ₪{item.price}</p>
                                                <p><strong>סה"כ לפריט:</strong> ₪{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="order-total">
                                סה"כ: ₪{order.totalAmount}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SupplierOrders; 