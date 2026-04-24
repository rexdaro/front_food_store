// src/features/ingredients/types.ts

export interface Ingredient {
  id: number;
  nombre: string;
  descripcion: string | null;
  es_alergeno: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IngredientCreate {
  nombre: string;
  descripcion?: string | null;
  es_alergeno: boolean;
}

export type IngredientUpdate = Partial<IngredientCreate>;
