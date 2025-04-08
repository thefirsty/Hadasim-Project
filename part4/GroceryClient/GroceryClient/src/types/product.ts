export interface Product {
    productId?: number;
    productName: string;
    unitPrice: number;
    minOrderQuantity: number;
    supplierId: number;
    description?: string;
    image?: string;
} 