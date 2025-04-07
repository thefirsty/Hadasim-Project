import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderItemList from '../components/OrderItemList';
import './OrdersPage.css';
import { Order, OrderItem, OrderStatus } from '../types/order';
import { Product } from '../types/product';

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showNewOrderForm, setShowNewOrderForm] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [newOrder, setNewOrder] = useState<Order>({
        items: [],
        status: OrderStatus.PENDING,
        totalAmount: 0,
        userId: 0 // יתעדכן על ידי השרת
    });
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('לא נמצא טוקן התחברות');
            }

            const response = await axios.get<Product[]>('https://localhost:7012/api/Product', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });

            console.log('Products response:', response.data);
            
            // וידוא שהנתונים תקינים
            const validProducts = response.data.filter(product => 
                product.productName && 
                typeof product.unitPrice === 'number' && 
                typeof product.minOrderQuantity === 'number'
            );
            
            console.log('Valid products:', validProducts);
            setProducts(validProducts);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('שגיאה בטעינת המוצרים');
        }
    };

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
        if (selectedProduct && quantity >= selectedProduct.minOrderQuantity) {
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
        } else if (selectedProduct) {
            alert(`כמות מינימלית להזמנה: ${selectedProduct.minOrderQuantity}`);
        }
    };

    const handleCreateOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('לא נמצא טוקן התחברות');
            }

            // בדיקה שיש פריטים בהזמנה
            if (!newOrder.items || newOrder.items.length === 0) {
                setError('לא ניתן ליצור הזמנה ריקה');
                return;
            }

            // מציאת ה-SupplierId של המוצר הראשון בהזמנה
            const firstProductId = newOrder.items[0].productId;
            const firstProduct = products.find(p => p.productId === firstProductId);
            if (!firstProduct) {
                throw new Error('לא נמצא ספק למוצר');
            }

            // הכנת אובייקט ההזמנה בפורמט הנכון
            const orderData = {
                orderId: 0,
                supplierId: firstProduct.supplierId,
                status: "start",
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

            // איפוס הטופס ורענון הרשימה
            setShowNewOrderForm(false);
            setNewOrder({
                items: [],
                status: OrderStatus.PENDING,
                totalAmount: 0,
                userId: 0
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
                            <select
                                value={selectedProduct?.productId || ''}
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value);
                                    console.log('Selected ID:', selectedId);
                                    const product = products.find(p => p.productId === selectedId);
                                    console.log('Found product:', product);
                                    setSelectedProduct(product || null);
                                    if (product) {
                                        setQuantity(product.minOrderQuantity);
                                    }
                                }}
                                className="product-select"
                            >
                                <option value="">בחר מוצר</option>
                                {products.map(product => (
                                    <option key={product.productId} value={product.productId}>
                                        {product.productName} - מחיר: ₪{product.unitPrice.toFixed(2)} - מינימום להזמנה: {product.minOrderQuantity}
                                    </option>
                                ))}
                            </select>
                            {selectedProduct && (
                                <div className="selected-product-details">
                                    <p><strong>שם המוצר:</strong> {selectedProduct.productName}</p>
                                    <p><strong>מחיר ליחידה:</strong> ₪{selectedProduct.unitPrice.toFixed(2)}</p>
                                    <p><strong>כמות מינימלית:</strong> {selectedProduct.minOrderQuantity}</p>
                                    {quantity > 0 && (
                                        <p className="total-price">
                                            <strong>סה"כ למוצר:</strong> ₪{(selectedProduct.unitPrice * quantity).toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            )}
                            <input
                                type="number"
                                placeholder="כמות"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                min={selectedProduct?.minOrderQuantity || 1}
                            />
                            <button onClick={handleAddOrderItem}>הוסף פריט</button>
                        </div>

                        <div className="order-items-list">
                            <h3>פריטים בהזמנה</h3>
                            {newOrder.items?.map((item, index) => (
                                <div key={index} className="order-item-card">
                                    <p>{item.productName}</p>
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
                                    {order.items?.map((item) => (
                                        <li key={item.id}>
                                            {item.productName} - {item.quantity} יחידות - ₪{item.price}
                                        </li>
                                    )) || <li>אין פריטים בהזמנה</li>}
                                </ul>
                            </div>
                            <div className="order-total">
                                סה"כ: ₪{order.totalAmount || 0}
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