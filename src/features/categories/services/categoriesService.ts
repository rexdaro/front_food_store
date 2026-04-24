import { apiClient } from '@/api/api-client';
import type { Category, CategoryCreate, CategoryUpdate } from '../types';

export const categoriesService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>('/categorias');
    return data;
  },

  getById: async (id: number): Promise<Category> => {
    const { data } = await apiClient.get<Category>(`/categorias/${id}`);
    return data;
  },

  create: async (category: CategoryCreate): Promise<Category> => {
    const { data } = await apiClient.post<Category>('/categorias', category);
    return data;
  },

  update: async (id: number, category: CategoryUpdate): Promise<Category> => {
    const { data } = await apiClient.patch<Category>(`/categorias/${id}`, category);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/categorias/${id}`);
  },
};
