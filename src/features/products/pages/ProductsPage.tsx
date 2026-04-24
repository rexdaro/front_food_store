import { useState } from 'react';
import { useProducts, useCreateProduct, useDeleteProduct, useUpdateProduct } from '../hooks/useProducts';
import { Button } from '@/shared/components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '@/shared/components/ui/Table';
import { Modal } from '@/shared/components/ui/Modal';
import { ProductForm } from '../components/ProductForm';
import { ProductDetails } from '../components/ProductDetails';
import { ConfirmModal } from '@/shared/components/ui/ConfirmModal';
import { Plus, Trash2, Edit2, AlertCircle, Loader2, Package, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product, ProductCreate } from '../types';
import { useEffect } from 'react';

type ModalMode = 'create' | 'edit' | 'view';

export const ProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;
  
  const { data: paginatedData, isLoading, isError } = useProducts({
    offset: page * PAGE_SIZE,
    limit: PAGE_SIZE,
    search: searchTerm || undefined
  });

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const products = paginatedData?.items || [];
  const total = paginatedData?.total || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchQuery);
  };

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleOpenDetails = (product: Product) => {
    setSelectedProduct(product);
    setModalMode('view');
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

  const handleDelete = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    if (productToDelete !== null) {
      await deleteMutation.mutateAsync(productToDelete);
      setProductToDelete(null);
      setIsModalOpen(false);
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
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            Productos
          </h1>
          <p className="text-zinc-400 mt-1">Gestioná el catálogo de alimentos y sus precios.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative flex-1 md:w-80 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text"
                placeholder="Buscar producto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-white placeholder:text-zinc-600"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm" className="px-4">
              Buscar
            </Button>
          </form>
          <Button className="gap-2 whitespace-nowrap shrink-0" onClick={handleOpenCreate}>
            <Plus className="w-5 h-5" />
            Nuevo
          </Button>
        </div>
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
          {products.length === 0 ? (
            <TR>
              <TD colSpan={5} className="text-center py-12 text-zinc-500 italic">
                {searchTerm ? 'No se encontraron productos con esa búsqueda.' : 'No hay productos en el catálogo.'}
              </TD>
            </TR>
          ) : (
            products.map((prod) => (
              <TR key={prod.id} className="cursor-pointer hover:bg-zinc-800/50 transition-colors" onClick={() => handleOpenDetails(prod)}>
                <TD>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 overflow-hidden shrink-0 border border-zinc-700">
                      {prod.imagenes_url && prod.imagenes_url.length > 0 ? (
                        <img
                          src={prod.imagenes_url[0]}
                          alt={prod.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-5 h-5" />
                      )}
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
                      onClick={(e) => handleOpenEdit(prod, e)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
                      onClick={(e) => handleDelete(prod.id, e)}
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

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/50">
        <div className="text-sm text-zinc-500">
          Mostrando página <span className="text-white font-medium">{page + 1}</span> de <span className="text-white font-medium">{totalPages || 1}</span>
          <span className="ml-2 text-zinc-600">({total} productos en total)</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-8 h-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-1 px-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  page === i 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                    : 'bg-zinc-800/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= totalPages - 1}
            className="w-8 h-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Agregar Nuevo Producto' : modalMode === 'edit' ? 'Editar Producto' : 'Detalles del Producto'}
      >
        {modalMode === 'view' && selectedProduct ? (
          <ProductDetails
            product={selectedProduct}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        ) : (
          <ProductForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
            initialData={selectedProduct || undefined}
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        title="Eliminar Producto"
        description="¿Estás seguro de que querés eliminar este producto del catálogo? Esta acción lo dará de baja."
        confirmText="Eliminar"
      />
    </div>
  );
};
