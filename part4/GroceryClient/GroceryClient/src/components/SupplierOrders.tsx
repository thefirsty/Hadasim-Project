import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { OrderStatus } from '../types/order';
import './SupplierOrders.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderItems } from '../store/orderItemSlice';
import { RootState } from '../store/store';
import { AppDispatch } from '../store/store';

interface Product {
    productId: number;
    supplierId: number;
    productName: string;
    unitPrice: number;
    minOrderQuantity: number;
}

interface OrderItem {
    id?: number;
    orderItemId?: number;
    orderId?: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    product?: Product;
}

interface Order {
    orderId: number;
    createdAt?: string;
    createdDate?: string;
    status: OrderStatus;
    totalAmount?: number;
    orderItems?: OrderItem[];
}

interface TokenPayload {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
}

const SupplierOrders: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { orderItems: allOrderItems } = useSelector((state: RootState) => state.orderItems);
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<{ [key: number]: Product }>({});
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

    const fetchProduct = async (productId: number, token: string) => {
        try {
            console.log(`Fetching product with ID: ${productId}`);
            const response = await axios.get(`https://localhost:7012/api/Product/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    accept: '*/*'
                }
            });
            console.log(`Product ${productId} data:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);
            return null;
        }
    };

    const fetchProductsForOrders = async (orders: Order[], token: string) => {
        const productIds = new Set<number>();
        
        // Collect product IDs from orders and allOrderItems
        orders.forEach(order => {
            // Get items from allOrderItems for this order
            const orderItemsFromStore = allOrderItems.filter(item => item.orderId === order.orderId);
            
            // Add product IDs from store items
            orderItemsFromStore.forEach(item => {
                if (item.productId) {
                    productIds.add(item.productId);
                }
            });

            // Also add product IDs from order.orderItems if they exist
            order.orderItems?.forEach(item => {
                if (item.productId) {
                    productIds.add(item.productId);
                }
            });
        });

        console.log('Found product IDs in orders:', Array.from(productIds));

        // Fetch each product
        const productsMap: { [key: number]: Product } = {};
        await Promise.all(Array.from(productIds).map(async (productId) => {
            const product = await fetchProduct(productId, token);
            if (product) {
                productsMap[productId] = product;
            }
        }));

        console.log('Final products map:', productsMap);
        setProducts(productsMap);
    };

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const decoded = jwtDecode<TokenPayload>(token);
            const userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

            const supplierResponse = await axios.get(`https://localhost:7012/api/Supplier/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const supplierId = supplierResponse.data.supplierId;

            const ordersResponse = await axios.get(`https://localhost:7012/api/Order/by-supplier/${supplierId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'accept': 'text/plain'
                }
            });

            const orders = ordersResponse.data;
            
            // First set orders to trigger allOrderItems update
            setOrders(orders);
            
            // Then fetch products using both orders and allOrderItems
            await fetchProductsForOrders(orders, token);
            
            setLoading(false);
        } catch (error) {
            console.error('Full error object:', error);
            if (axios.isAxiosError(error)) {
                console.error('Error response:', error.response?.data);
                if (error.response?.status === 401) {
                    setError('Authentication required');
                } else if (error.response?.status === 404) {
                    setError('No orders found');
                } else {
                    setError(`Error loading orders: ${error.response?.data || error.message}`);
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

    // Add another useEffect to refetch products when allOrderItems changes
    useEffect(() => {
        if (orders.length > 0) {
            const token = localStorage.getItem('token');
            if (token) {
                fetchProductsForOrders(orders, token);
            }
        }
    }, [allOrderItems, orders]);

    const calculateItemTotal = (item: OrderItem) => {
        try {
            if (!item || !item.quantity) return 0;
            const product = products[item.productId];
            if (product) {
                return product.unitPrice * item.quantity;
            }
            return 0;
        } catch (error) {
            console.error('Error calculating item total:', error);
            return 0;
        }
    };

    const calculateOrderTotal = (items: OrderItem[]) => {
        try {
            if (!items || !Array.isArray(items)) return 0;
            return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
        } catch (error) {
            console.error('Error calculating order total:', error);
            return 0;
        }
    };

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
                        try {
                            const orderItemsFromStore = allOrderItems.filter(item => item.orderId === order.orderId) as OrderItem[];
                            const allItems = [...(order.orderItems || []), ...orderItemsFromStore];
                            
                            return (
                                <div key={order.orderId} className="order-card">
                                    <div className="order-header">
                                        <h3>Order #{order.orderId}</h3>
                                        <span className="order-date">
                                            {(order.createdAt || order.createdDate) ? 
                                                new Date(order.createdAt || order.createdDate || '').toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) 
                                                : 'No date available'}
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
                                                allItems.map((item, index) => {
                                                    try {
                                                        if (!item) return null;
                                                        const product = products[item.productId];
                                                        if (!product) return null;
                                                        
                                                        const itemTotal = calculateItemTotal(item);
                                                        
                                                        return (
                                                            <div key={`item-${index}-${order.orderId}`} className="item-card">
                                                                <div className="order-item-details">
                                                                    <p><strong>Product Name:</strong> {product.productName}</p>
                                                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                                                    <p><strong>Unit Price:</strong> ₪{product.unitPrice.toFixed(2)}</p>
                                                                    <p><strong>Total for Item:</strong> ₪{itemTotal.toFixed(2)}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    } catch (error) {
                                                        console.error('Error rendering order item:', error);
                                                        return null;
                                                    }
                                                }).filter(Boolean)
                                            ) : (
                                                <p className="no-items">No items in order</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="order-total">
                                        Total: ₪{calculateOrderTotal(allItems).toFixed(2)}
                                    </div>
                                </div>
                            );
                        } catch (error) {
                            console.error('Error rendering order:', error);
                            return null;
                        }
                    }).filter(Boolean)}
                </div>
            )}
        </div>
    );
};

export default SupplierOrders; 