import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ingredientsService } from '../services/ingredientsService';
import type { IngredientUpdate } from '../types';

export const useIngredients = () => {
  return useQuery({
    queryKey: ['ingredients'],
    queryFn: ingredientsService.getAll,
  });
};

export const useCreateIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ingredientsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
};

export const useUpdateIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredientUpdate }) => 
      ingredientsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
};

export const useDeleteIngredient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ingredientsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
};
