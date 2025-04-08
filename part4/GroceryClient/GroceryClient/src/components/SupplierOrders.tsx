import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { OrderStatus } from '../types/order';
import './SupplierOrders.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderItems } from '../store/orderItemSlice';
import { RootState } from '../store/store';
import { AppDispatch } from '../store/store';

interface Order {
    orderId: number;
    createdAt: string;
    status: OrderStatus;
    totalAmount: number;
    orderItems?: OrderItem[];
}

interface OrderItem {
    id?: number;
    orderItemId?: number;
    productName: string;
    quantity: number;
    price: number;
}

interface TokenPayload {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
}

const SupplierOrders: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { orderItems: allOrderItems } = useSelector((state: RootState) => state.orderItems);
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
            setError('Error updating order status');
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
                    setError('Authentication required');
                } else if (error.response?.status === 404) {
                    setError('No orders found');
                } else {
                    setError('Error loading orders');
                }
            } else {
                setError('Error loading orders');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        dispatch(fetchOrderItems());
    }, [dispatch]);

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="supplier-orders">
            <h2>Orders</h2>
            {orders.length === 0 ? (
                <p>No orders to display</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => {
                        const orderItemsFromStore = allOrderItems.filter(item => item.orderId === order.orderId);
                        const allItems = [...(order.orderItems || []), ...orderItemsFromStore];
                        const totalAmount = allItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                        return (
                            <div key={order.orderId} className="order-card">
                                <div className="order-header">
                                    <h3>Order #{order.orderId}</h3>
                                    <span className="order-date">
                                        {new Date(order.createdAt).toLocaleDateString('en-US')}
                                    </span>
                                </div>
                                <div className="order-status">
                                    {order.status === OrderStatus.COMPLETED ? (
                                        <div className="completed-status">
                                            <span>Order received by store owner</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span>Status: {order.status}</span>
                                            {order.status !== OrderStatus.PROCESSING && (
                                                <button 
                                                    className="update-status-button"
                                                    onClick={() => updateOrderStatus(order.orderId)}
                                                >
                                                    Start Processing Order
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="order-items">
                                    <h4>Order Items:</h4>
                                    <div className="items-list">
                                        {allItems.length > 0 ? (
                                            allItems.map((item, index) => (
                                                <div key={`item-${index}-${order.orderId}`} className="item-card">
                                                    <div className="order-item-details">
                                                        <p><strong>Product Name:</strong> {item.productName}</p>
                                                        <p><strong>Quantity:</strong> {item.quantity}</p>
                                                        <p><strong>Unit Price:</strong> ₪{item.price}</p>
                                                        <p><strong>Total for Item:</strong> ₪{(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="no-items">No items in order</p>
                                        )}
                                    </div>
                                </div>
                                <div className="order-total">
                                    Total: ₪{totalAmount.toFixed(2)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SupplierOrders; 