import { Routes, Route, Navigate } from 'react-router-dom';
import { ProductsPage } from '@/features/products/pages/ProductsPage';
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage';
import { IngredientsPage } from '@/features/ingredients/pages/IngredientsPage';

/**
 * AppRouter centraliza la configuración de navegación de la aplicación.
 * Separar las rutas en su propio componente mejora la legibilidad y 
 * facilita la implementación de guardas de navegación o carga perezosa (lazy loading).
 */
export const AppRouter = () => {
  return (
    <Routes>
      {/* Redirección inicial al catálogo de productos */}
      <Route path="/" element={<Navigate to="/products" replace />} />
      
      {/* Definición de rutas por feature */}
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/ingredients" element={<IngredientsPage />} />
      
      {/* Manejo de rutas no encontradas (404) - Redirige a la página principal */}
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
};
