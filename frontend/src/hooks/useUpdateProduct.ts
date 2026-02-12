import { useState } from 'react';
import API from '../utils/axios';
import { Product, ProductsResponse } from '@/types';

export const useUpdateProduct = () => {
    const [loading, setLoading] = useState(false);

    const updateProduct = async (
        id: string, 
        data: Partial<Pick<Product, "name" | "description" | "price" | "category">>
    ): Promise<ProductsResponse> => {
        setLoading(true);
        try {
            const res = await API.put<ProductsResponse>(`/product/update/${id}`, data);
            return res.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to update product"
            };
        } finally {
            setLoading(false);
        }
    };

    return { updateProduct, loading };
};