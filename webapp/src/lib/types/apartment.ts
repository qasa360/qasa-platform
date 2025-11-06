/**
 * Apartment types based on backend model
 */

export enum SpaceType {
  LIVING_ROOM = 'LIVING_ROOM',
  BEDROOM = 'BEDROOM',
  KITCHEN = 'KITCHEN',
  BATHROOM = 'BATHROOM',
  BALCONY = 'BALCONY',
  OTHER = 'OTHER',
}

export interface Space {
  id: number;
  uuid: string;
  apartmentId: number;
  name: string;
  spaceType: SpaceType;
  m2?: number;
  order?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Apartment {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  neighborhood: string;
  agent: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  spaces: Space[];
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
