import { BrowserRouter as Router } from 'react-router-dom';
import { QueryProvider } from './core/QueryProvider';
import { Layout } from './shared/components/Layout';
import { AppRouter } from './core/router/AppRouter';

function App() {
  return (
    <QueryProvider>
      <Router>
        <Layout>
          <AppRouter />
        </Layout>
      </Router>
    </QueryProvider>
  );
}

export default App;
