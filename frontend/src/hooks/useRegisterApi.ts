import { useState } from 'react';
import API from '../utils/axios';
import { AuthResponse } from '@/types';

export const useRegisterApi = () => {
    const [loading, setLoading] = useState(false);

    const registerApi = async (name: string, email: string, password: string, role: "admin" | "user"): Promise<AuthResponse> => {
        setLoading(true);
        try {
            // Mock sync: fullname maps to name from params
            const res = await API.post<AuthResponse>('/user/register', { fullname: name, email, password, role });
            return res.data;
        } catch (error: any) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Email already registered" 
            };
        } finally {
            setLoading(false);
        }
    };

    return { registerApi, loading };
};