import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '../services/productsService';
import type { ProductCreate, ProductUpdate } from '../types';
import type { Category } from '@/features/categories/types';
import type { Ingredient } from '@/features/ingredients/types';

export const useProducts = (filters?: { categoria_id?: number; search?: string; offset?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const data = await productsService.getAll(filters);
      return {
        ...data,
        items: [...data.items].sort((a, b) => a.nombre.localeCompare(b.nombre))
      };
    },
  });
};

export const useProductLinks = (producto_id?: number) => {
  return useQuery({
    queryKey: ['productLinks', producto_id],
    queryFn: async (): Promise<{ categories: Category[]; ingredients: Ingredient[] }> => {
      if (!producto_id) return { categories: [], ingredients: [] };
      const [categories, ingredients] = await Promise.all([
        productsService.getCategories(producto_id),
        productsService.getIngredients(producto_id),
      ]);
      
      return { 
        categories: [...categories].sort((a, b) => a.nombre.localeCompare(b.nombre)), 
        ingredients: [...ingredients].sort((a, b) => a.nombre.localeCompare(b.nombre)) 
      };
    },
    enabled: !!producto_id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: ProductCreate) => {
      const { categoria_ids, ingrediente_ids, ...productData } = newProduct;
      const createdProduct = await productsService.create(productData);
      
      const linkPromises: Promise<unknown>[] = [];
      
      if (categoria_ids?.length) {
        categoria_ids.forEach(catId => {
          linkPromises.push(productsService.linkCategory(createdProduct.id, catId));
        });
      }
      
      if (ingrediente_ids?.length) {
        ingrediente_ids.forEach(ingId => {
          linkPromises.push(productsService.linkIngredient(createdProduct.id, ingId));
        });
      }
      
      if (linkPromises.length > 0) {
        await Promise.all(linkPromises);
      }
      
      return createdProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * Orquestación de la actualización del producto y sus vínculos.
     * Dado que el backend maneja los vínculos (categorías/ingredientes) en endpoints separados,
     * este hook realiza un "diffing" (comparación) entre los vínculos actuales y los nuevos
     * para ejecutar los POST (link) o DELETE (unlink) necesarios.
     */
    mutationFn: async ({ id, data }: { id: number; data: ProductUpdate }) => {
      const { categoria_ids, ingrediente_ids, ...productData } = data;
      
      // 1. Actualización de los datos base del producto (PATCH)
      const updatedProduct = await productsService.update(id, productData);

      const syncPromises: Promise<unknown>[] = [];

      // 2. Sincronización de Categorías mediante comparación de IDs
      if (categoria_ids !== undefined) {
        const currentCats = await productsService.getCategories(id);
        const currentIds = currentCats.map(c => c.id);
        
        // Identificamos categorías eliminadas -> Unlink
        currentIds.filter(oldId => !categoria_ids.includes(oldId))
          .forEach(oldId => syncPromises.push(productsService.unlinkCategory(id, oldId)));
        
        // Identificamos categorías nuevas -> Link
        categoria_ids.filter(newId => !currentIds.includes(newId))
          .forEach(newId => syncPromises.push(productsService.linkCategory(id, newId)));
      }

      // 3. Sincronización de Ingredientes mediante comparación de IDs
      if (ingrediente_ids !== undefined) {
        const currentIngs = await productsService.getIngredients(id);
        const currentIds = currentIngs.map(i => i.id);

        // Identificamos ingredientes eliminados -> Unlink
        currentIds.filter(oldId => !ingrediente_ids.includes(oldId))
          .forEach(oldId => syncPromises.push(productsService.unlinkIngredient(id, oldId)));

        // Identificamos ingredientes nuevos -> Link
        ingrediente_ids.filter(newId => !currentIds.includes(newId))
          .forEach(newId => syncPromises.push(productsService.linkIngredient(id, newId)));
      }

      // Ejecutamos todas las operaciones de vinculación en paralelo para optimizar performance
      if (syncPromises.length > 0) {
        await Promise.all(syncPromises);
      }

      return updatedProduct;
    },
    onSuccess: (_, variables) => {
      // Invalidamos las queries para forzar un re-fetch de los datos actualizados
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['productLinks', variables.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
