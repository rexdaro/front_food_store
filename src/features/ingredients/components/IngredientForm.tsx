import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { IngredientCreate } from '../types';
import { Button } from '@/shared/components/ui/Button';
import { Loader2, FlaskConical, AlertTriangle } from 'lucide-react';

const ingredientSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
  es_alergeno: z.boolean(),
});

interface IngredientFormProps {
  onSubmit: (data: IngredientCreate) => void;
  isLoading?: boolean;
  initialData?: Partial<IngredientCreate>;
}

export const IngredientForm = ({ onSubmit, isLoading, initialData }: IngredientFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IngredientCreate>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      es_alergeno: false,
      ...initialData,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
          <FlaskConical className="w-4 h-4" /> Nombre del Ingrediente
        </label>
        <input
          {...register('nombre')}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
          placeholder="Ej: Harina de Trigo"
        />
        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">Descripción / Origen</label>
        <textarea
          {...register('descripcion')}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all h-24"
        />
      </div>

      <div className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
        <input
          type="checkbox"
          id="es_alergeno"
          {...register('es_alergeno')}
          className="w-5 h-5 rounded border-zinc-800 bg-zinc-900 text-orange-500 focus:ring-orange-500/20"
        />
        <label htmlFor="es_alergeno" className="flex items-center gap-2 cursor-pointer select-none">
          <AlertTriangle className={`w-4 h-4 ${errors.es_alergeno ? 'text-red-500' : 'text-orange-500'}`} />
          <div>
            <p className="font-medium text-zinc-100 text-sm">Marcar como Alérgeno</p>
            <p className="text-xs text-zinc-500">Esto mostrará una advertencia visual en los productos que lo contengan.</p>
          </div>
        </label>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isLoading} className="min-w-[150px]">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar Ingrediente'}
        </Button>
      </div>
    </form>
  );
};
