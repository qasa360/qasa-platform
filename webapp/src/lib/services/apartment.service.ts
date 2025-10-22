import { api } from '@/lib/api';
import {
  Apartment,
  ApartmentFilters,
  ApartmentResponse,
} from '@/lib/types/apartment';

/**
 * Apartment service for API interactions
 */
export class ApartmentService {
  private static readonly ENDPOINT = '/apartments';

  /**
   * Get all apartments with optional filters
   */
  static async getApartments(filters?: ApartmentFilters): Promise<Apartment[]> {
    try {
      console.log(
        '🏠 ApartmentService.getApartments called with filters:',
        filters
      );

      const queryParams = new URLSearchParams();

      if (filters?.search) {
        queryParams.append('search', filters.search);
      }
      if (filters?.city) {
        queryParams.append('city', filters.city);
      }
      if (filters?.neighborhood) {
        queryParams.append('neighborhood', filters.neighborhood);
      }
      if (filters?.agent) {
        queryParams.append('agent', filters.agent);
      }

      const endpoint = queryParams.toString()
        ? `${this.ENDPOINT}?${queryParams.toString()}`
        : this.ENDPOINT;

      console.log('🌐 Making API call to endpoint:', endpoint);
      const response = await api.get<Apartment[]>(endpoint);
      console.log('✅ API response received:', response?.length, 'apartments');
      return response;
    } catch (error) {
      console.error('❌ Error fetching apartments:', error);
      throw error;
    }
  }

  /**
   * Get apartment by ID
   */
  static async getApartmentById(id: number): Promise<Apartment> {
    try {
      const response = await api.get<Apartment>(`${this.ENDPOINT}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching apartment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create new apartment
   */
  static async createApartment(
    apartment: Omit<Apartment, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Apartment> {
    try {
      const response = await api.post<Apartment>(this.ENDPOINT, apartment);
      return response;
    } catch (error) {
      console.error('Error creating apartment:', error);
      throw error;
    }
  }

  /**
   * Update apartment
   */
  static async updateApartment(
    id: number,
    apartment: Partial<Omit<Apartment, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Apartment> {
    try {
      const response = await api.put<Apartment>(
        `${this.ENDPOINT}/${id}`,
        apartment
      );
      return response;
    } catch (error) {
      console.error(`Error updating apartment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete apartment
   */
  static async deleteApartment(id: number): Promise<void> {
    try {
      await api.delete(`${this.ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Error deleting apartment ${id}:`, error);
      throw error;
    }
  }
}
