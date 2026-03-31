import type { ApiProduct, ApiResponse } from '../types';
import api from './axios'

const productApi = {
  getProduct: async (productId: number): Promise<ApiProduct> => {
    const response = await api.get<ApiResponse<ApiProduct>>(`/items/${productId}`);
    
    const result = response.data;
    if (!result) throw new Error('Empty API response');
    const product = (typeof result === 'object' && 'data' in result) ? result.data : result as unknown as ApiProduct;
    
    return product;
  },
};

export default productApi;
