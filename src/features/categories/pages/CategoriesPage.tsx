import React, { useState } from 'react';
import { useCategoriesTree, useCreateCategory, useDeleteCategory, useUpdateCategory } from '../hooks/useCategories';
import { Button } from '@/shared/components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '@/shared/components/ui/Table';
import { Modal } from '@/shared/components/ui/Modal';
import { ConfirmModal } from '@/shared/components/ui/ConfirmModal';
import { CategoryForm } from '../components/CategoryForm';
import { Plus, Trash2, Edit2, AlertCircle, Loader2, ChevronRight, Tags, Search } from 'lucide-react';
import type { CategoryCreate, Category } from '../types';

export const CategoriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const { tree, isLoading, isError } = useCategoriesTree();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCreate = async (data: CategoryCreate) => {
    try {
      if (selectedCategory) {
        await updateMutation.mutateAsync({ id: selectedCategory.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = (id: number) => {
    setCategoryToDelete(id);
  };

  const confirmDelete = async () => {
    if (categoryToDelete !== null) {
      await deleteMutation.mutateAsync(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-zinc-400 animate-pulse">Cargando categorías...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-red-400">
        <AlertCircle className="w-12 h-12" />
        <p>Error al cargar las categorías.</p>
        <Button variant="secondary" onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filterTree = (nodes: Category[], query: string): Category[] => {
    return nodes.reduce((acc: Category[], node) => {
      const isMatch = node.nombre.toLowerCase().includes(query.toLowerCase());
      const filteredChildren = node.children ? filterTree(node.children, query) : [];
      
      if (isMatch || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren
        });
      }
      return acc;
    }, []);
  };

  const filteredTree = searchTerm ? filterTree(tree, searchTerm) : tree;

  const renderCategoryRows = (items: Category[], level = 0) => {
    return items.map((cat) => {
      const isExpanded = expandedIds[cat.id];
      const hasChildren = cat.children && cat.children.length > 0;
      
      return (
        <React.Fragment key={cat.id}>
          <TR>
            <TD>
              <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
                {hasChildren ? (
                  <button 
                    onClick={() => toggleExpand(cat.id)}
                    className="p-1 hover:bg-zinc-800 rounded-md transition-colors"
                    title={isExpanded ? "Contraer" : "Expandir"}
                  >
                    <ChevronRight className={`w-4 h-4 text-zinc-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                ) : (
                  <div className="w-6" /> // spacer to align items without children
                )}
                <div className="p-1.5 bg-zinc-800 rounded-lg shrink-0">
                  <Tags className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <span className="font-medium text-zinc-100">{cat.nombre}</span>
              </div>
            </TD>
            <TD>
              {level === 0 ? (
                <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase border border-orange-500/20">Principal</span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 text-[10px] font-bold uppercase border border-zinc-700">Subcategoría</span>
              )}
            </TD>
            <TD className="text-right">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => handleOpenEdit(cat)}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
                  onClick={() => handleDelete(cat.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </TD>
          </TR>
          {(isExpanded || (searchTerm && hasChildren)) && hasChildren && renderCategoryRows(cat.children!, level + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            Categorías
          </h1>
          <p className="text-zinc-400 mt-1">Organizá tus productos en jerarquías lógicas.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text"
              placeholder="Buscar categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-white placeholder:text-zinc-600"
            />
          </div>
          <Button className="gap-2 whitespace-nowrap shrink-0" onClick={handleOpenCreate}>
            <Plus className="w-5 h-5" />
            Nueva
          </Button>
        </div>
      </header>

      <Table>
        <THead>
          <TR>
            <TH>Estructura de Categorías</TH>
            <TH>Tipo</TH>
            <TH className="text-right">Acciones</TH>
          </TR>
        </THead>
        <TBody>
          {filteredTree.length === 0 ? (
            <TR>
              <TD colSpan={3} className="text-center py-12 text-zinc-500 italic">
                {searchTerm ? 'No se encontraron categorías con esa búsqueda.' : 'No hay categorías registradas.'}
              </TD>
            </TR>
          ) : (
            renderCategoryRows(filteredTree)
          )}
        </TBody>
      </Table>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}
      >
        <CategoryForm 
          onSubmit={handleCreate} 
          isLoading={createMutation.isPending || updateMutation.isPending} 
          initialData={selectedCategory || undefined}
        />
      </Modal>

      <ConfirmModal
        isOpen={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
        title="Eliminar Categoría"
        description="¿Estás seguro de que querés eliminar esta categoría? Si tiene subcategorías, también serán eliminadas. Esta acción no se puede deshacer."
        confirmText="Eliminar"
      />
    </div>
  );
};

