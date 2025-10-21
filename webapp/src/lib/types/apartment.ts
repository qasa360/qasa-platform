/**
 * Apartment types based on backend model
 */

export interface Apartment {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  neighborhood: string;
  agent: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApartmentFilters {
  search?: string;
  city?: string;
  neighborhood?: string;
  agent?: string;
}

export interface ApartmentResponse {
  apartments: Apartment[];
  total: number;
  page: number;
  limit: number;
}
