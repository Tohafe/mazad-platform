import axios from 'axios';
import type { ApiProduct, ApiResponse } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = '/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY
  },
});

// Product API endpoints
export const productApi = {
  // Get a single product by ID
  getProduct: async (productId: number): Promise<ApiProduct> => {
    const response = await api.get<ApiResponse<ApiProduct>>(`/items/${productId}`, {
    });
    
    console.log('API Response:', response.data);
    
    // Handle both { data: {...} } and direct response formats
    const result = response.data;
    if (!result) throw new Error('Empty API response');
    const product = (typeof result === 'object' && 'data' in result) ? result.data : result as unknown as ApiProduct;
    
    console.log('Extracted product:', product);
    
    return product;
  },

  // Get all products (optional, for listing)
  // getProducts: async (): Promise<ApiProduct[]> => {
  //   const response = await api.get<ApiResponse<ApiProduct[]>>('/products');
  //   return response.data.data;
  // },
};

export default api;
