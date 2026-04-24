import { useProductLinks } from '../hooks/useProducts';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useIngredients } from '@/features/ingredients/hooks/useIngredients';
import type { Product } from '../types';
import { Button } from '@/shared/components/ui/Button';
import { Edit2, Trash2, Loader2, Package, Tag, FlaskConical, DollarSign, Layers } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export const ProductDetails = ({ product, onEdit, onDelete }: ProductDetailsProps) => {
  const { data: links, isLoading: isLoadingLinks } = useProductLinks(product.id);
  const { data: categories } = useCategories();
  const { data: ingredients } = useIngredients();

  const productCategories = categories?.filter(c => links?.categories.some(lc => lc.categoria_id === c.id)) || [];
  const productIngredients = ingredients?.filter(i => links?.ingredients.some(li => li.ingrediente_id === i.id)) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0 overflow-hidden border border-zinc-700">
          {product.imagenes_url && product.imagenes_url.length > 0 ? (
            <img 
              src={product.imagenes_url[0]} 
              alt={product.nombre} 
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="w-8 h-8" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{product.nombre}</h2>
          <p className="text-zinc-400 mt-1">{product.descripcion || 'Sin descripción'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
            <DollarSign className="w-4 h-4" /> Precio Base
          </div>
          <div className="text-xl font-semibold text-white">
            ${Number(product.precio_base).toLocaleString()}
          </div>
        </div>
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
            <Layers className="w-4 h-4" /> Stock Actual
          </div>
          <div className={`text-xl font-semibold ${product.stock_cantidad < 10 ? 'text-orange-400' : 'text-white'}`}>
            {product.stock_cantidad} uds.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-zinc-400 flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4" /> Categorías
          </h3>
          {isLoadingLinks ? (
            <div className="flex items-center gap-2 text-zinc-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Cargando...
            </div>
          ) : productCategories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {productCategories.map(cat => (
                <span key={cat.id} className="px-3 py-1 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-full text-xs font-medium">
                  {cat.nombre}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 italic">No pertenece a ninguna categoría</p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-zinc-400 flex items-center gap-2 mb-3">
            <FlaskConical className="w-4 h-4" /> Ingredientes
          </h3>
          {isLoadingLinks ? (
            <div className="flex items-center gap-2 text-zinc-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Cargando...
            </div>
          ) : productIngredients.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {productIngredients.map(ing => (
                <span key={ing.id} className="px-3 py-1 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-full text-xs font-medium flex items-center gap-1.5">
                  {ing.nombre}
                  {ing.es_alergeno && (
                    <span className="w-2 h-2 rounded-full bg-red-500" title="Alérgeno"></span>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 italic">No utiliza ingredientes registrados</p>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-800 flex justify-end gap-3">
        <Button 
          variant="secondary" 
          className="gap-2"
          onClick={() => onEdit(product)}
        >
          <Edit2 className="w-4 h-4" />
          Modificar
        </Button>
        <Button 
          variant="secondary" 
          className="gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-transparent"
          onClick={() => onDelete(product.id)}
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </Button>
      </div>
    </div>
  );
};
