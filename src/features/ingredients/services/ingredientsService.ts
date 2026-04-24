import { apiClient } from '@/api/api-client';
import type { Ingredient, IngredientCreate, IngredientUpdate } from '../types';

export const ingredientsService = {
  getAll: async (): Promise<Ingredient[]> => {
    const { data } = await apiClient.get<Ingredient[]>('/ingredientes');
    return data;
  },

  getById: async (id: number): Promise<Ingredient> => {
    const { data } = await apiClient.get<Ingredient>(`/ingredientes/${id}`);
    return data;
  },

  create: async (ingredient: IngredientCreate): Promise<Ingredient> => {
    const { data } = await apiClient.post<Ingredient>('/ingredientes', ingredient);
    return data;
  },

  update: async (id: number, ingredient: IngredientUpdate): Promise<Ingredient> => {
    const { data } = await apiClient.patch<Ingredient>(`/ingredientes/${id}`, ingredient);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/ingredientes/${id}`);
  },
};
