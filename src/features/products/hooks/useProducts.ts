import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '../services/productsService';
import type { ProductCreate, ProductUpdate } from '../types';

export const useProducts = (categoria_id?: number) => {
  return useQuery({
    queryKey: ['products', { categoria_id }],
    queryFn: () => productsService.getAll(categoria_id),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: ProductCreate) => {
      // 1. Create the product
      const { categoria_ids, ingrediente_ids, ...productData } = newProduct;
      const createdProduct = await productsService.create(productData);
      
      // 2. Orchestrate links
      const linkPromises: Promise<void>[] = [];
      
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
    mutationFn: ({ id, data }: { id: number; data: ProductUpdate }) => 
      productsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
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
