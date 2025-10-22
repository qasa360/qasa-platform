/**
 * Inventory types based on backend API response
 */

export interface ElementCategory {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ElementType {
  id: number;
  name: string;
  categoryName: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: ElementCategory;
}

export interface Element {
  id: number;
  uuid: string;
  spaceId: number;
  name: string;
  brand: string | null;
  model: string | null;
  material: string | null;
  color: string | null;
  condition: string;
  notes: Record<string, unknown> | null;
  dimensions: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  elementType: ElementType;
}

export interface InventoryFilters {
  spaceId?: number;
  categoryId?: number;
  condition?: string;
  search?: string;
}
