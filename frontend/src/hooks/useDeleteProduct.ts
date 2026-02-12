import { useState } from 'react';
import API from '../utils/axios';
import { ProductsResponse } from '@/types';

export const useDeleteProduct = () => {
    const [loading, setLoading] = useState(false);

    const deleteProduct = async (id: string): Promise<ProductsResponse> => {
        setLoading(true);
        try {
            const res = await API.delete<ProductsResponse>(`/product/delete/${id}`);
            return res.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to delete product"
            };
        } finally {
            setLoading(false);
        }
    };

    return { deleteProduct, loading };
};