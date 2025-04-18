import axios from 'axios';

const API_URL = 'https://localhost:7012/api/User';

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    UserId: number;
    Role: string;
    Password: string;
    Email: string;
}

export interface AuthResponse {
    token: string;
    role: string;
    userId: number;
}

const extractRoleFromToken = (token: string): string => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    } catch (error) {
        console.error('Error extracting role from token:', error);
        return '';
    }
};

export const authService = {
    async login(loginDto: LoginDto): Promise<AuthResponse> {
        try {
            console.log('Attempting login with:', loginDto);
            const response = await axios.post('https://localhost:7012/api/Login', loginDto, {
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*'
                }
            });
            console.log('Login response:', response.data);
            
            const token = response.data.token;
            const role = extractRoleFromToken(token);
            console.log('Extracted role from token:', role);
            
            return {
                ...response.data,
                role: role
            };
        } catch (error) {
            console.error('Login error:', error);
            if (axios.isAxiosError(error)) {
                console.error('Axios error details:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
                throw error;
            }
            throw new Error('An unexpected error occurred during login');
        }
    },

    async register(registerDto: RegisterDto): Promise<AuthResponse> {
        try {
            const formData = new FormData();
            formData.append('UserId', registerDto.UserId.toString());
            formData.append('Role', registerDto.Role);
            formData.append('Password', registerDto.Password);
            formData.append('Email', registerDto.Email);

            console.log('Sending registration request with:', {
                UserId: registerDto.UserId,
                Role: registerDto.Role,
                Email: registerDto.Email
            });

            const response = await axios.post(`${API_URL}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Server response:', response.data);

            if (response.data && response.data.token) {
                const role = extractRoleFromToken(response.data.token);
                return {
                    ...response.data,
                    role: role
                };
            }

            throw new Error('Registration failed - invalid server response');
        } catch (error) {
            console.error('Registration error details:', error);
            if (axios.isAxiosError(error)) {
                console.error('Axios error response:', error.response?.data);
                const errorMessage = error.response?.data?.message || error.message;
                throw new Error(`Registration failed: ${errorMessage}`);
            }
            throw new Error('An error occurred during registration');
        }
    }
}; 