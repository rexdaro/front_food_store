import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '../services/categoriesService';
import type { Category, CategoryUpdate } from '../types';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await categoriesService.getAll();
      return [...data].sort((a, b) => a.nombre.localeCompare(b.nombre));
    },
  });
};

export const useCategoriesTree = () => {
  const query = useCategories();
  
  const tree = query.data ? buildTree(query.data) : [];
  
  return { ...query, tree };
};

function buildTree(items: Category[]): Category[] {
  const map = new Map<number, Category & { children: Category[] }>();
  const roots: Category[] = [];

  items.forEach(item => {
    map.set(item.id, { ...item, children: [] });
  });

  items.forEach(item => {
    const mappedItem = map.get(item.id)!;
    if (item.parent_id !== null && map.has(item.parent_id)) {
      map.get(item.parent_id)!.children.push(mappedItem);
      // Mantener los hijos ordenados al insertarlos
      map.get(item.parent_id)!.children.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else {
      roots.push(mappedItem);
    }
  });

  return roots.sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoriesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryUpdate }) => 
      categoriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoriesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
