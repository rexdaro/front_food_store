import { useState } from 'react';
import { useProducts, useCreateProduct, useDeleteProduct, useUpdateProduct } from '../hooks/useProducts';
import { Button } from '@/shared/components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '@/shared/components/ui/Table';
import { Modal } from '@/shared/components/ui/Modal';
import { ProductForm } from '../components/ProductForm';
import { Plus, Trash2, Edit2, AlertCircle, Loader2, Package } from 'lucide-react';
import type { Product, ProductCreate } from '../types';

export const ProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const { data: products, isLoading, isError } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: ProductCreate) => {
    try {
      if (selectedProduct) {
        await updateMutation.mutateAsync({ id: selectedProduct.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-zinc-400 animate-pulse">Cargando catálogo...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-red-400">
        <AlertCircle className="w-12 h-12" />
        <p>Error al cargar los productos. Verificá que el backend esté corriendo.</p>
        <Button variant="secondary" onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            Productos
          </h1>
          <p className="text-zinc-400 mt-1">Gestioná el catálogo de alimentos y sus precios.</p>
        </div>
        <Button className="gap-2" onClick={handleOpenCreate}>
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </Button>
      </header>

      <Table>
        <THead>
          <TR>
            <TH>Producto</TH>
            <TH>Precio</TH>
            <TH>Stock</TH>
            <TH>Estado</TH>
            <TH className="text-right">Acciones</TH>
          </TR>
        </THead>
        <TBody>
          {products?.length === 0 ? (
            <TR>
              <TD colSpan={5} className="text-center py-12 text-zinc-500 italic">
                No hay productos en el catálogo.
              </TD>
            </TR>
          ) : (
            products?.map((prod) => (
              <TR key={prod.id}>
                <TD>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{prod.nombre}</div>
                      <div className="text-xs text-zinc-500 truncate max-w-[200px]">{prod.descripcion}</div>
                    </div>
                  </div>
                </TD>
                <TD className="font-semibold text-zinc-100">
                  ${Number(prod.precio_base).toLocaleString()}
                </TD>
                <TD>
                  <span className={`text-xs font-medium ${prod.stock_cantidad < 10 ? 'text-orange-400' : 'text-zinc-400'}`}>
                    {prod.stock_cantidad} uds.
                  </span>
                </TD>
                <TD>
                  {prod.disponible ? (
                    <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20 uppercase">
                      Activo
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-md bg-zinc-800 text-zinc-500 text-[10px] font-bold border border-zinc-700 uppercase">
                      Baja
                    </span>
                  )}
                </TD>
                <TD className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 w-9 p-0"
                      onClick={() => handleOpenEdit(prod)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 w-9 p-0 text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
                      onClick={() => handleDelete(prod.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TD>
              </TR>
            ))
          )}
        </TBody>
      </Table>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
      >
        <ProductForm 
          onSubmit={handleSubmit} 
          isLoading={createMutation.isPending || updateMutation.isPending} 
          initialData={selectedProduct || undefined}
        />
      </Modal>
    </div>
  );
};
