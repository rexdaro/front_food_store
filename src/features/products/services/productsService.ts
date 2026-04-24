import { apiClient } from '@/api/api-client';
import type { Product, ProductCreate, ProductUpdate } from '../types';

export const productsService = {
  getAll: async (categoria_id?: number): Promise<Product[]> => {
    const params = categoria_id ? { categoria_id } : {};
    const { data } = await apiClient.get<Product[]>('/productos', { params });
    return data;
  },

  getById: async (id: number): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/productos/${id}`);
    return data;
  },

  create: async (product: ProductCreate): Promise<Product> => {
    const { data } = await apiClient.post<Product>('/productos', product);
    return data;
  },

  update: async (id: number, product: ProductUpdate): Promise<Product> => {
    const { data } = await apiClient.patch<Product>(`/productos/${id}`, product);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/productos/${id}`);
  },

  linkCategory: async (producto_id: number, categoria_id: number): Promise<void> => {
    await apiClient.post('/vinculos-categorias/', { producto_id, categoria_id });
  },

  linkIngredient: async (producto_id: number, ingrediente_id: number): Promise<void> => {
    await apiClient.post('/vinculos-ingredientes/', { producto_id, ingrediente_id });
  },
};
