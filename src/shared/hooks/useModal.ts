import { useState, useCallback } from 'react';

/**
 * Hook personalizado para la gestión centralizada de estados de modales.
 * Permite manejar la apertura, el cierre, el modo de operación (crear/editar/ver)
 * y la carga de datos asociados al modal de forma tipada.
 * 
 * Este patrón ayuda a desacoplar la lógica de estado de la UI del componente principal.
 */
type ModalMode = 'create' | 'edit' | 'view';

export const useModal = <T = any>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('create');
  const [data, setData] = useState<T | null>(null);

  /**
   * Abre el modal configurando el modo y los datos opcionales.
   * Usamos useCallback para evitar re-renderizados innecesarios de los hijos.
   */
  const open = useCallback((mode: ModalMode = 'create', data: T | null = null) => {
    setMode(mode);
    setData(data);
    setIsOpen(true);
  }, []);

  /**
   * Cierra el modal y resetea el estado de apertura.
   */
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    mode,
    data,
    open,
    close,
    setIsOpen,
  };
};
