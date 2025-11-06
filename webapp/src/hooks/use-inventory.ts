import { useQuery } from '@tanstack/react-query';
import { InventoryService } from '@/lib/services/inventory.service';
import { InventoryFilters } from '@/lib/types/inventory';
import { QUERY_KEYS } from '@/lib/constants';

/**
 * Custom hook for fetching inventory by space ID
 */
export function useInventoryBySpaceId(spaceId: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.INVENTORY, 'space', spaceId],
    queryFn: () => InventoryService.getInventoryBySpaceId(spaceId),
    enabled: !!spaceId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000,
  });
}

/**
 * Custom hook for fetching inventory with filters
 */
export function useInventory(filters?: InventoryFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.INVENTORY, filters],
    queryFn: () => InventoryService.getInventory(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000,
  });
}
