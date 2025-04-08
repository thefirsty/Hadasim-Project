import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrdersPage.css';
import { Order, OrderItem, OrderStatus } from '../types/order';
import { Product } from '../types/product';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderItems } from '../store/orderItemSlice';
import { RootState } from '../store/store';
import { AppDispatch } from '../store/store';

// Define a type for the products map
type ProductsMap = Record<number, Product>;

const OrdersPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { orderItems: allOrderItems } = useSelector((state: RootState) => state.orderItems);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showNewOrderForm, setShowNewOrderForm] = useState<boolean>(false);
    const [productsMap, setProductsMap] = useState<ProductsMap>({});
    const [currentSupplierId, setCurrentSupplierId] = useState<number | null>(null);
    const [newOrder, setNewOrder] = useState<Order>({
        items: [],
        status: OrderStatus.PENDING,
        totalAmount: 0,
        userId: 0
    });
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        fetchOrders();
        fetchProducts();
        dispatch(fetchOrderItems());
    }, [dispatch]);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get<Product[]>('https://localhost:7012/api/Product', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });
            
            // Convert array to map for easier lookup
            const newProductsMap: Record<number, Product> = {};
            response.data.forEach(product => {
                if (product.productName && 
                    typeof product.unitPrice === 'number' && 
                    typeof product.minOrderQuantity === 'number' &&
                    typeof product.productId === 'number') {
                    newProductsMap[product.productId] = product;
                }
            });
            
            setProductsMap(newProductsMap);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('שגיאה בטעינת המוצרים');
        }
    };

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
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
        if (!selectedProduct) return;

        // Check if this is the first item or if supplier matches current supplier
        if (currentSupplierId === null) {
            setCurrentSupplierId(selectedProduct.supplierId);
        } else if (selectedProduct.supplierId !== currentSupplierId) {
            alert('Cannot add products from different suppliers in the same order');
            return;
        }

        if (quantity >= selectedProduct.minOrderQuantity) {
            const item: OrderItem = {
                id: 0,
                productId: selectedProduct.productId!,
                productName: selectedProduct.productName,
                quantity: quantity,
                price: selectedProduct.unitPrice,
                orderId: 0
            };

            setNewOrder(prev => ({
                ...prev,
                items: [...(prev.items || []), item],
                totalAmount: (prev.totalAmount || 0) + (item.price * item.quantity)
            }));

            setSelectedProduct(null);
            setQuantity(1);
        } else {
            alert(`Minimum order quantity: ${selectedProduct.minOrderQuantity}`);
        }
    };

    const handleCreateOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            if (!newOrder.items || newOrder.items.length === 0) {
                setError('Cannot create an empty order');
                return;
            }

            const orderData = {
                orderId: 0,
                supplierId: currentSupplierId,
                status: OrderStatus.PENDING,
                createdDate: new Date().toISOString(),
                products: newOrder.items.map(item => ({
                    orderItemId: 0,
                    orderId: 0,
                    productId: item.productId,
                    quantity: item.quantity
                }))
            };

            console.log('Sending order data:', orderData);

            const orderResponse = await axios.post('https://localhost:7012/api/Order', orderData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Order created:', orderResponse.data);

            // איפוס הטופס
            setShowNewOrderForm(false);
            setNewOrder({
                items: [],
                status: OrderStatus.PENDING,
                totalAmount: 0,
                userId: 0
            });
            setCurrentSupplierId(null);

            // רענון כל הנתונים בדף
            await Promise.all([
                fetchOrders(),
                fetchProducts(),
                dispatch(fetchOrderItems())
            ]);

        } catch (err) {
            console.error('Error creating order:', err);
            setError('Error creating order');
        }
    };

    const handleUpdateStatus = async (orderId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const formData = new FormData();
            formData.append('OrderId', orderId.toString());
            formData.append('Status', OrderStatus.COMPLETED);
            formData.append('CreatedDate', new Date().toISOString());
            formData.append('Products', JSON.stringify([]));

            await axios.put(`https://localhost:7012/api/Order/${orderId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Refresh orders after update
            fetchOrders();
        } catch (err) {
            console.error('Error updating order status:', err);
            setError('Error updating order status');
        }
    };

    const calculateItemTotal = (item: OrderItem) => {
        try {
            if (!item?.quantity) return 0;
            const productId = item.productId;
            if (typeof productId === 'number') {
                const product = productsMap[productId];
                if (product) {
                    return product.unitPrice * item.quantity;
                }
            }
            return (item.price || 0) * item.quantity; // Fallback to item price if product not found
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

    if (loading) {
        return <div className="orders-container">Loading orders...</div>;
    }

    return (
        <div className="orders-container">
            <h1>Orders</h1>
            
            <button 
                className="add-order-button"
                onClick={() => setShowNewOrderForm(!showNewOrderForm)}
            >
                {showNewOrderForm ? 'Cancel' : 'Add New Order'}
            </button>

            {showNewOrderForm && (
                <div className="new-order-form">
                    <h2>New Order</h2>
                    <div className="order-items-form">
                        <h3>Add Items to Order</h3>
                        <div className="form-group">
                            <select
                                value={selectedProduct?.productId || ''}
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value);
                                    const product = productsMap[selectedId];
                                    setSelectedProduct(product || null);
                                    if (product) {
                                        setQuantity(product.minOrderQuantity);
                                    }
                                }}
                                className="product-select"
                            >
                                <option value="">Select Product</option>
                                {Object.values(productsMap).map(product => (
                                    <option key={product.productId} value={product.productId}>
                                        {product.productName} - Price: ₪{product.unitPrice.toFixed(2)} - Min Order: {product.minOrderQuantity}
                                    </option>
                                ))}
                            </select>
                            {selectedProduct && (
                                <div className="selected-product-details">
                                    <p><strong>Product Name:</strong> {selectedProduct.productName}</p>
                                    <p><strong>Unit Price:</strong> ₪{selectedProduct.unitPrice.toFixed(2)}</p>
                                    <p><strong>Minimum Quantity:</strong> {selectedProduct.minOrderQuantity}</p>
                                    {quantity > 0 && (
                                        <p className="total-price">
                                            <strong>Total for Product:</strong> ₪{(selectedProduct.unitPrice * quantity).toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            )}
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                min={selectedProduct?.minOrderQuantity || 1}
                            />
                            <button onClick={handleAddOrderItem}>Add Item</button>
                        </div>

                        <div className="order-items-list">
                            <h3>Items in Order</h3>
                            {newOrder.items?.map((item, index) => (
                                <div key={index} className="order-item-card">
                                    <p>{item.productName}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ₪{item.price}</p>
                                </div>
                            ))}
                        </div>

                        <div className="order-total">
                            <h3>Total: ₪{newOrder.totalAmount}</h3>
                        </div>

                        <button 
                            className="create-order-button"
                            onClick={handleCreateOrder}
                            disabled={!newOrder.items?.length}
                        >
                            Create Order
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => {
                        const orderItemsFromStore = allOrderItems.filter(item => item.orderId === order.orderId);
                        const allItems = [...(order.items || []), ...orderItemsFromStore];
                        
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
                                    Status: {order.status}
                                    {order.status !== OrderStatus.COMPLETED && order.orderId && (
                                        <button 
                                            className="complete-order-button"
                                            onClick={() => handleUpdateStatus(order.orderId as number)}
                                        >
                                            Complete Order
                                        </button>
                                    )}
                                </div>
                                <div className="order-items">
                                    <h4>Order Items:</h4>
                                    <div className="order-items-list">
                                        {allItems.length > 0 ? (
                                            allItems.map((item) => {
                                                const product = productsMap[item.productId];
                                                const itemTotal = calculateItemTotal(item);
                                                
                                                return (
                                                    <div key={`${item.id}-${item.orderId}`} className="order-item-card">
                                                        <div className="order-item-details">
                                                            <p><strong>Product Name:</strong> {product ? product.productName : item.productName}</p>
                                                            <p><strong>Quantity:</strong> {item.quantity}</p>
                                                            <p><strong>Unit Price:</strong> ₪{product ? product.unitPrice.toFixed(2) : (item.price || 0).toFixed(2)}</p>
                                                            <p><strong>Total for Item:</strong> ₪{itemTotal.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })
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
                    })}
                </div>
            )}
        </div>
    );
};

export default OrdersPage; 