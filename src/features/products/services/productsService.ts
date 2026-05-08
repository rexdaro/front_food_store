import { apiClient } from '@/api/api-client';
import type {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductPaginated,
  ProductoCategoriaLink,
  ProductoIngredienteLink,
} from '../types';
import type { Category } from '@/features/categories/types';
import type { Ingredient } from '@/features/ingredients/types';

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

  delete: async (id: number): Promise<Product> => {
    const { data } = await apiClient.delete<Product>(`/productos/${id}`);
    return data;
  },

  // --- Vinculación M:N (ahora todo bajo /productos/) ---

  linkCategory: async (
    producto_id: number,
    categoria_id: number,
    es_principal = false,
  ): Promise<ProductoCategoriaLink> => {
    const { data } = await apiClient.post<ProductoCategoriaLink>(
      '/productos/vincular-categoria',
      { producto_id, categoria_id, es_principal },
    );
    return data;
  },

  unlinkCategory: async (producto_id: number, categoria_id: number): Promise<void> => {
    await apiClient.delete(`/productos/desvincular-categoria/${producto_id}/${categoria_id}`);
  },

  linkIngredient: async (
    producto_id: number,
    ingrediente_id: number,
    es_removible = false,
  ): Promise<ProductoIngredienteLink> => {
    const { data } = await apiClient.post<ProductoIngredienteLink>(
      '/productos/vincular-ingrediente',
      { producto_id, ingrediente_id, es_removible },
    );
    return data;
  },

  unlinkIngredient: async (producto_id: number, ingrediente_id: number): Promise<void> => {
    await apiClient.delete(`/productos/desvincular-ingrediente/${producto_id}/${ingrediente_id}`);
  },

  // Obtener categorías/ingredientes de un producto via query param
  getCategories: async (producto_id: number): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>('/categorias', { params: { producto_id } });
    return data;
  },

  getIngredients: async (producto_id: number): Promise<Ingredient[]> => {
    const { data } = await apiClient.get<Ingredient[]>('/ingredientes', { params: { producto_id } });
    return data;
  },
};
