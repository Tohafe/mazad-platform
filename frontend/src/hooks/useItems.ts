import { useState } from 'react';
import useApiPrivate from './useApiPrivate'; 
import type { ItemDetailsResponse } from '../pages/CreateAuction'; 

export const useItems = () => {
    const apiPrivate = useApiPrivate();
    const [isCreating, setIsCreating] = useState(false);

    const createItem = async (payload: any): Promise<ItemDetailsResponse> => {
        setIsCreating(true);
        try {
            const response = await apiPrivate.post<ItemDetailsResponse>('/items', payload);
            return response.data;
        } catch (error) {
            console.error("Failed to POST item to backend:", error);
            throw error; 
        } finally {
            setIsCreating(false);
        }
    };

    return { createItem, isCreating };
};