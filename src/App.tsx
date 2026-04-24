import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryProvider } from './core/QueryProvider';
import { Layout } from './shared/components/Layout';
// Lazy load features
import { ProductsPage } from './features/products/pages/ProductsPage';
import { CategoriesPage } from './features/categories/pages/CategoriesPage';
import { IngredientsPage } from './features/ingredients/pages/IngredientsPage';

function App() {
  return (
    <QueryProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/products/:id" element={<div>Product Detail (Coming Soon)</div>} />
          </Routes>
        </Layout>
      </Router>
    </QueryProvider>
  );
}

export default App;
