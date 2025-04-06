import axios from 'axios';

const API_URL = 'https://localhost:7012/api/User';

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    role: 'SUPPLIER';
}

export interface AuthResponse {
    token: string;
    role: 'SUPPLIER';
}

export const authService = {
    async login(loginDto: LoginDto): Promise<AuthResponse> {
        try {
            const response = await axios.post(`${API_URL}/login`, loginDto);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error;
            }
            throw new Error('An unexpected error occurred');
        }
    },

    async register(registerDto: RegisterDto): Promise<AuthResponse> {
        try {
            const response = await axios.post(`${API_URL}/register`, registerDto);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error;
            }
            throw new Error('An unexpected error occurred');
        }
    }
}; 