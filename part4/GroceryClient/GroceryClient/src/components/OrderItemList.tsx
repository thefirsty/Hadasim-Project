import React, { useEffect } from 'react';
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
                <div className="order-items-list">
                    {orderItems.map((item) => (
                        <div key={item.id} className="order-item-card">
                            <div className="order-item-header">
                                <h3>פריט #{item.id}</h3>
                            </div>
                            <div className="order-item-details">
                                <p><strong>שם המוצר:</strong> {item.productName}</p>
                                <p><strong>כמות:</strong> {item.quantity}</p>
                                <p><strong>מחיר:</strong> ₪{item.price}</p>
                                <p><strong>מספר הזמנה:</strong> {item.orderId}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderItemList; 