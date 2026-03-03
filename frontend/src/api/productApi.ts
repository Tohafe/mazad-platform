import axios from 'axios';
import type { ApiProduct, ApiResponse } from '../types';

// Base API configuration - UPDATE THIS URL
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product API endpoints
export const productApi = {
  // Get a single product by ID
  getProduct: async (productId: number): Promise<ApiProduct> => {
    const response = await api.get<ApiResponse<ApiProduct>>(`/api/v1/items/${productId}`, {
        headers: {
          'X-Api-Key': 'c0221589-ca50-4518-9182-615460a3b241'
        }});
    
    console.log('API Response:', response.data);
    
    // Handle both { data: {...} } and direct response formats
    const result = response.data;
    if (!result) throw new Error('Empty API response');
    const product = (typeof result === 'object' && 'data' in result) ? result.data : result as unknown as ApiProduct;
    
    console.log('Extracted product:', product);
    
    return product;
  },

  // Get all products (optional, for listing)
  getProducts: async (): Promise<ApiProduct[]> => {
    const response = await api.get<ApiResponse<ApiProduct[]>>('/products');
    return response.data.data;
  },
};

export default api;
