import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { CategoryCreate } from '../types';
import { useCategories } from '../hooks/useCategories';
import { Button } from '@/shared/components/ui/Button';
import { Loader2, Tags, Layers } from 'lucide-react';

const categorySchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().optional().nullable(),
  parent_id: z.any().optional(),
});

interface CategoryFormProps {
  onSubmit: (data: CategoryCreate) => void;
  isLoading?: boolean;
  initialData?: Partial<CategoryCreate>;
}

export const CategoryForm = ({ onSubmit, isLoading, initialData }: CategoryFormProps) => {
  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryCreate>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: any) => {
    const formattedData: CategoryCreate = {
      ...data,
      parent_id: (data.parent_id === "" || isNaN(Number(data.parent_id))) ? null : Number(data.parent_id),
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
          <Tags className="w-4 h-4" /> Nombre de la Categoría
        </label>
        <input
          {...register('nombre')}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          placeholder="Ej: Bebidas"
        />
        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">Descripción</label>
        <textarea
          {...register('descripcion')}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all h-24"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4" /> Categoría Padre (Opcional)
        </label>
        <select
          {...register('parent_id', { valueAsNumber: true })}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none"
        >
          <option value="">Ninguna (Categoría Raíz)</option>
          {categories?.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isLoading} className="min-w-[150px]">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar Categoría'}
        </Button>
      </div>
    </form>
  );
};
