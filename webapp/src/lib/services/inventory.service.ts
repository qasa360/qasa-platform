import { api } from '@/lib/api';
import { Element, InventoryFilters } from '@/lib/types/inventory';

/**
 * Inventory service for API interactions
 */
export class InventoryService {
  private static readonly ENDPOINT = '/inventory';

  /**
   * Get inventory elements by space ID
   */
  static async getInventoryBySpaceId(spaceId: number): Promise<Element[]> {
    try {
      const response = await api.get<Element[]>(`${this.ENDPOINT}/${spaceId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching inventory for space ${spaceId}:`, error);
      throw error;
    }
  }

  /**
   * Get inventory elements with optional filters
   */
  static async getInventory(filters?: InventoryFilters): Promise<Element[]> {
    try {
      const queryParams = new URLSearchParams();

      if (filters?.spaceId) {
        queryParams.append('spaceId', filters.spaceId.toString());
      }
      if (filters?.categoryId) {
        queryParams.append('categoryId', filters.categoryId.toString());
      }
      if (filters?.condition) {
        queryParams.append('condition', filters.condition);
      }
      if (filters?.search) {
        queryParams.append('search', filters.search);
      }

      const endpoint = queryParams.toString()
        ? `${this.ENDPOINT}?${queryParams.toString()}`
        : this.ENDPOINT;

      const response = await api.get<Element[]>(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
  }
}
