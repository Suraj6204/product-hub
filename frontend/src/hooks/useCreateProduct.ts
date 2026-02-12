import { useState } from 'react';
import API from '../utils/axios';
import { Product, ProductsResponse } from '@/types';

export const useCreateProduct = () => {
    const [loading, setLoading] = useState(false);

    const createProduct = async (
        data: Pick<Product, "name" | "description" | "price" | "category">,
        userId: string // Mock sync: userId is used as createdBy
    ): Promise<ProductsResponse> => {
        setLoading(true);
        try {
            const res = await API.post<ProductsResponse>('/product/create', { ...data, userId });
            return res.data;
        } catch (error: any) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Failed to create product" 
            };
        } finally {
            setLoading(false);
        }
    };

    return { createProduct, loading };
};