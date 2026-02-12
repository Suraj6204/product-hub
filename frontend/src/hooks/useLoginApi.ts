import { useState } from 'react';
import { AuthResponse } from '@/types';
import API from '@/utils/axios';

export const useLoginApi = () => {
    const [loading, setLoading] = useState(false);

    // role parameter add kiya
    const loginApi = async (email: string, password: string, role: string): Promise<AuthResponse> => {
        setLoading(true);
        try {
            // body mein role bhi bhej rahe hain
            const res = await API.post<AuthResponse>('/user/login', { email, password, role });
            return res.data;
        } catch (error: any) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Invalid email or password" 
            };
        } finally {
            setLoading(false);
        }
    };

    return { loginApi, loading };
};