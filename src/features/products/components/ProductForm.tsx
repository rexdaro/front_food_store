import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { ProductCreate, Product } from '../types';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useIngredients } from '@/features/ingredients/hooks/useIngredients';
import { useProductLinks } from '../hooks/useProducts';
import { Button } from '@/shared/components/ui/Button';
import { Loader2, Package, DollarSign, List, FlaskConical } from 'lucide-react';
import { useEffect } from 'react';

const productSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().optional(),
  precio_base: z.number().min(0, 'El precio debe ser positivo'),
  stock_cantidad: z.number().int().min(0, 'El stock debe ser positivo'),
  categoria_ids: z.array(z.number()).default([]),
  ingrediente_ids: z.array(z.number()).default([]),
  imagenes_url: z.array(z.string()).nullable().optional().default([]),
});

interface ProductFormProps {
  onSubmit: (data: ProductCreate) => void;
  isLoading?: boolean;
  initialData?: Product | Partial<ProductCreate>;
}

export const ProductForm = ({ onSubmit, isLoading, initialData }: ProductFormProps) => {
  const { data: categories } = useCategories();
  const { data: ingredients } = useIngredients();
  
  // Try to cast initialData to a Product with id to fetch links
  const productId = (initialData as Product)?.id;
  const { data: links, isLoading: isLoadingLinks } = useProductLinks(productId);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductCreate>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      categoria_ids: [],
      ingrediente_ids: [],
      imagenes_url: [],
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData && links && !isLoadingLinks) {
      reset({
        ...initialData,
        categoria_ids: links.categories.map(c => c.categoria_id),
        ingrediente_ids: links.ingredients.map(i => i.ingrediente_id),
      } as ProductCreate);
    }
  }, [initialData, links, isLoadingLinks, reset]);

  const selectedCategories = useWatch({ control, name: 'categoria_ids' }) || [];
  const selectedIngredients = useWatch({ control, name: 'ingrediente_ids' }) || [];
  const imagenesUrls = useWatch({ control, name: 'imagenes_url' }) || [];

  const toggleCategory = (id: number) => {
    const newValues = selectedCategories.includes(id)
      ? selectedCategories.filter(catId => catId !== id)
      : [...selectedCategories, id];
    setValue('categoria_ids', newValues);
  };

  const toggleIngredient = (id: number) => {
    const newValues = selectedIngredients.includes(id)
      ? selectedIngredients.filter(ingId => ingId !== id)
      : [...selectedIngredients, id];
    setValue('ingrediente_ids', newValues);
  };

  const handleImageUrlsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value.trim()) {
      setValue('imagenes_url', []);
      return;
    }
    const urls = value.split(',').map(s => s.trim()).filter(Boolean);
    setValue('imagenes_url', urls);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Basic Info */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
              <Package className="w-4 h-4" /> Nombre del Producto
            </label>
            <input
              {...register('nombre')}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
              placeholder="Ej: Hamburguesa Gourmet"
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
              <Package className="w-4 h-4" /> URLs de Imágenes (separadas por coma)
            </label>
            <input
              value={imagenesUrls?.join(', ') || ''}
              onChange={handleImageUrlsChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
              placeholder="https://imagen1.jpg, https://imagen2.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Descripción</label>
            <textarea
              {...register('descripcion')}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all h-24"
              placeholder="Describí los detalles del producto..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Precio Base
              </label>
              <input
                type="number"
                step="0.01"
                {...register('precio_base', { valueAsNumber: true })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Stock Inicial</label>
              <input
                type="number"
                {...register('stock_cantidad', { valueAsNumber: true })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Multi-selects */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
              <List className="w-4 h-4" /> Categorías
            </label>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-44 overflow-y-auto grid grid-cols-1 gap-2">
              {categories?.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedCategories.includes(cat.id)
                      ? 'bg-orange-500 text-white font-semibold'
                      : 'hover:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
              <FlaskConical className="w-4 h-4" /> Ingredientes
            </label>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-44 overflow-y-auto grid grid-cols-1 gap-2">
              {ingredients?.map(ing => (
                <button
                  type="button"
                  key={ing.id}
                  onClick={() => toggleIngredient(ing.id)}
                  className={`text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-all ${
                    selectedIngredients.includes(ing.id)
                      ? 'bg-orange-500 text-white font-semibold'
                      : 'hover:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {ing.nombre}
                  {ing.es_alergeno && (
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      selectedIngredients.includes(ing.id) ? 'bg-white/20 text-white' : 'bg-red-500/10 text-red-500'
                    }`}>
                      Alergeno
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-800 flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full md:w-auto min-w-[200px]"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Guardar Producto'
          )}
        </Button>
      </div>
    </form>
  );
};
