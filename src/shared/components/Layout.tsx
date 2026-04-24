import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingBasket, Tags, FlaskConical, LayoutDashboard } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col p-6 gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 bg-orange-500 rounded-lg">
            <ShoppingBasket className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">FoodStore</span>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink 
            to="/products" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-orange-500/10 text-orange-500 font-semibold' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            Productos
          </NavLink>
          
          <NavLink 
            to="/categories" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-orange-500/10 text-orange-500 font-semibold' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
              }`
            }
          >
            <Tags className="w-5 h-5" />
            Categorías
          </NavLink>

          <NavLink 
            to="/ingredients" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-orange-500/10 text-orange-500 font-semibold' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
              }`
            }
          >
            <FlaskConical className="w-5 h-5" />
            Ingredientes
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
