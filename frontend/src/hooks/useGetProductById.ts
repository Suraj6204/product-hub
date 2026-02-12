import { useState } from 'react';
import API from '../utils/axios';
import { ProductsResponse } from '@/types';

export const useGetProductById = () => {
    const [loading, setLoading] = useState(false);

    const getProductById = async (id: string): Promise<ProductsResponse> => {
        setLoading(true);
        try {
            // Mock sync: fetch by specific ID
            const res = await API.get<ProductsResponse>(`/product/get/${id}`);
            return res.data;
        } catch (error: any) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Product not found" 
            };
        } finally {
            setLoading(false);
        }
    };

    return { getProductById, loading };
};