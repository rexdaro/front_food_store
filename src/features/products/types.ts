// src/features/products/types.ts

export interface Product {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  stock_cantidad: number;
  imagenes_url: string[] | null;
  disponible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCreate {
  nombre: string;
  descripcion?: string | null;
  precio_base: number;
  stock_cantidad: number;
  imagenes_url?: string[] | null;
  // Extra fields for orchestration
  categoria_ids?: number[];
  ingrediente_ids?: number[];
}

export interface ProductUpdate extends Partial<ProductCreate> {
  disponible?: boolean;
}

export interface ProductPaginated {
  items: Product[];
  total: number;
}

// --- Tipos de vinculación M:N ---

export interface VincularCategoriaPayload {
  producto_id: number;
  categoria_id: number;
  es_principal?: boolean;
}

export interface VincularIngredientePayload {
  producto_id: number;
  ingrediente_id: number;
  es_removible?: boolean;
}

export interface ProductoCategoriaLink {
  producto_id: number;
  categoria_id: number;
  es_principal: boolean;
  created_at?: string;
}

export interface ProductoIngredienteLink {
  producto_id: number;
  ingrediente_id: number;
  es_removible: boolean;
}
