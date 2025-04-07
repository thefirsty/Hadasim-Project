export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    orderId: number;
}

export interface Order {
    orderId?: number;
    userId: number;
    items?: OrderItem[];
    status: OrderStatus;
    totalAmount: number;
    createdAt?: string;
    updatedAt?: string;
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
} 