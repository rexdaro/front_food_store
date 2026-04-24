import { apiClient } from '@/api/api-client';
import type { Product, ProductCreate, ProductUpdate, ProductPaginated } from '../types';

export const productsService = {
  getAll: async (filters?: { categoria_id?: number; search?: string; offset?: number; limit?: number }): Promise<ProductPaginated> => {
    const { data } = await apiClient.get<ProductPaginated>('/productos', { params: filters });
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

  getCategories: async (producto_id: number): Promise<{producto_id: number, categoria_id: number}[]> => {
    const { data } = await apiClient.get<{producto_id: number, categoria_id: number}[]>(`/vinculos-categorias/producto/${producto_id}`);
    return data;
  },

  getIngredients: async (producto_id: number): Promise<{producto_id: number, ingrediente_id: number}[]> => {
    const { data } = await apiClient.get<{producto_id: number, ingrediente_id: number}[]>(`/vinculos-ingredientes/producto/${producto_id}`);
    return data;
  },
};
