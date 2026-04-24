import { useState } from 'react';
import { useIngredients, useDeleteIngredient, useCreateIngredient, useUpdateIngredient } from '../hooks/useIngredients';
import { Button } from '@/shared/components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '@/shared/components/ui/Table';
import { Modal } from '@/shared/components/ui/Modal';
import { ConfirmModal } from '@/shared/components/ui/ConfirmModal';
import { IngredientForm } from '../components/IngredientForm';
import { Plus, Trash2, Edit2, AlertTriangle, Loader2, AlertCircle, Search } from 'lucide-react';
import type { Ingredient, IngredientCreate } from '../types';

export const IngredientsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [ingredientToDelete, setIngredientToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: ingredients, isLoading, isError } = useIngredients();
  const createMutation = useCreateIngredient();
  const updateMutation = useUpdateIngredient();
  const deleteMutation = useDeleteIngredient();

  const handleOpenCreate = () => {
    setSelectedIngredient(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: IngredientCreate) => {
    try {
      if (selectedIngredient) {
        await updateMutation.mutateAsync({ id: selectedIngredient.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving ingredient:', error);
    }
  };

  const handleDelete = (id: number) => {
    setIngredientToDelete(id);
  };

  const confirmDelete = async () => {
    if (ingredientToDelete !== null) {
      await deleteMutation.mutateAsync(ingredientToDelete);
      setIngredientToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-zinc-400 animate-pulse">Cargando ingredientes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-red-400">
        <AlertCircle className="w-12 h-12" />
        <p>Error al cargar los ingredientes. Verificá la conexión con el backend.</p>
        <Button variant="secondary" onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  const filteredIngredients = ingredients?.filter(ing => 
    ing.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ing.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            Ingredientes
          </h1>
          <p className="text-zinc-400 mt-1">Administrá los ingredientes y alertas de alérgenos.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text"
              placeholder="Buscar ingrediente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-white placeholder:text-zinc-600"
            />
          </div>
          <Button className="gap-2 whitespace-nowrap shrink-0" onClick={handleOpenCreate}>
            <Plus className="w-5 h-5" />
            Nuevo
          </Button>
        </div>
      </header>

      <Table>
        <THead>
          <TR>
            <TH>Nombre</TH>
            <TH>Descripción</TH>
            <TH>Alérgeno</TH>
            <TH className="text-right">Acciones</TH>
          </TR>
        </THead>
        <TBody>
          {filteredIngredients?.length === 0 ? (
            <TR>
              <TD colSpan={4} className="text-center py-12 text-zinc-500 italic">
                {searchTerm ? 'No se encontraron ingredientes con esa búsqueda.' : 'No hay ingredientes registrados.'}
              </TD>
            </TR>
          ) : (
            filteredIngredients?.map((ing) => (
              <TR key={ing.id}>
                <TD className="font-medium text-white">{ing.nombre}</TD>
                <TD className="max-w-xs truncate">{ing.descripcion || '-'}</TD>
                <TD>
                  {ing.es_alergeno ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20 uppercase tracking-wider">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Alergeno
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20 uppercase tracking-wider">
                      Seguro
                    </span>
                  )}
                </TD>
                <TD className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 w-9 p-0"
                      onClick={() => handleOpenEdit(ing)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 w-9 p-0 text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
                      onClick={() => handleDelete(ing.id)}
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
        title={selectedIngredient ? 'Editar Ingrediente' : 'Agregar Nuevo Ingrediente'}
      >
        <IngredientForm 
          onSubmit={handleSubmit} 
          isLoading={createMutation.isPending || updateMutation.isPending} 
          initialData={selectedIngredient || undefined}
        />
      </Modal>

      <ConfirmModal
        isOpen={ingredientToDelete !== null}
        onClose={() => setIngredientToDelete(null)}
        onConfirm={confirmDelete}
        title="Eliminar Ingrediente"
        description="¿Estás seguro de que querés eliminar este ingrediente? Se quitará de todos los productos que lo utilicen. Esta acción no se puede deshacer."
        confirmText="Eliminar"
      />
    </div>
  );
};
