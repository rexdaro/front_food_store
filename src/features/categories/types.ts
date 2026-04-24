// src/features/categories/types.ts

export interface Category {
  id: number;
  nombre: string;
  descripcion: string | null;
  disponible: boolean;
  parent_id: number | null;
  created_at?: string;
  updated_at?: string;
  children?: Category[];
}

export interface CategoryCreate {
  nombre: string;
  descripcion?: string | null;
  parent_id?: number | null;
}

export interface CategoryUpdate extends Partial<CategoryCreate> {
  disponible?: boolean;
}
