import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderItems } from '../store/orderItemSlice';
import { RootState } from '../store/store';
import { AppDispatch } from '../store/store';
import './OrderItemList.css';

const OrderItemList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { orderItems, loading, error } = useSelector((state: RootState) => state.orderItems);

    useEffect(() => {
        dispatch(fetchOrderItems());
    }, [dispatch]);

    // Group items by order ID
    const groupedItems = useMemo(() => {
        const groups: { [key: number]: typeof orderItems } = {};
        orderItems.forEach(item => {
            if (!groups[item.orderId]) {
                groups[item.orderId] = [];
            }
            groups[item.orderId].push(item);
        });
        return groups;
    }, [orderItems]);

    if (loading) {
        return <div className="order-items-container">טוען פריטי הזמנה...</div>;
    }

    if (error) {
        return (
            <div className="order-items-container">
                <div className="error-message">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="order-items-container">
            <h2>פריטי הזמנה</h2>
            {orderItems.length === 0 ? (
                <p>לא נמצאו פריטי הזמנה</p>
            ) : (
                <div className="orders-container">
                    {Object.entries(groupedItems).map(([orderId, items]) => (
                        <div key={`order-${orderId}`} className="order-group">
                            <h3 className="order-group-title">הזמנה #{orderId}</h3>
                            <div className="order-items-list">
                                {items.map((item) => (
                                    <div key={`order-item-${item.id}-${item.orderId}`} className="order-item-card">
                                        <div className="order-item-details">
                                            <p><strong>שם המוצר:</strong> {item.productName}</p>
                                            <p><strong>כמות:</strong> {item.quantity}</p>
                                            <p><strong>מחיר:</strong> ₪{item.price}</p>
                                            <p><strong>סה"כ:</strong> ₪{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="order-group-total">
                                <strong>סה"כ להזמנה:</strong> ₪{items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderItemList; 