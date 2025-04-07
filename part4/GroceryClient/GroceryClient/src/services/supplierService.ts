import axios from 'axios';

const API_URL = 'https://localhost:7012/api/Supplier';

export interface SupplierDto {
    SupplierId: number;
    ContactName: string;
    CompanyName: string;
    Phone: string;
    UserId: number;
    Role: string;
    Password: string;
    Email: string;
}

export const supplierService = {
    async createSupplier(supplierData: SupplierDto): Promise<void> {
        try {
            const formData = new FormData();
            formData.append('SupplierId', supplierData.SupplierId.toString());
            formData.append('ContactName', supplierData.ContactName);
            formData.append('CompanyName', supplierData.CompanyName);
            formData.append('Phone', supplierData.Phone);
            formData.append('UserId', supplierData.UserId.toString());
            formData.append('Role', supplierData.Role);
            formData.append('Password', supplierData.Password);
            formData.append('Email', supplierData.Email);

            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (!response.data) {
                throw new Error('Invalid response from server when creating supplier');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                throw new Error(`Failed to create supplier: ${errorMessage}`);
            }
            throw new Error('An unexpected error occurred while creating supplier');
        }
    }
}; 