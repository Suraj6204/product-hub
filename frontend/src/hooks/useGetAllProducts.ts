import { useState, useEffect } from 'react';
import API from '../utils/axios';
import { ProductsResponse } from '@/types';

export const useGetAllProducts = () => {
    const [data, setData] = useState<ProductsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const getAllProducts = async () => {
        setLoading(true);
        try {
            // Mock sync: Fetch all products with caching logic handled by backend
            const res = await API.get<ProductsResponse>('/product/all');
            setData(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllProducts();
    }, []);

    return { data, loading, refresh: getAllProducts };
};