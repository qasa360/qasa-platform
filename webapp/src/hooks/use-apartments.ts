import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApartmentService } from '@/lib/services/apartment.service';
import { Apartment, ApartmentFilters } from '@/lib/types/apartment';
import { QUERY_KEYS } from '@/lib/constants';
import { useDebounce } from './use-debounce';

/**
 * Custom hook for apartments data fetching and management
 */
export function useApartments(filters?: ApartmentFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.FLOORS, filters],
    queryFn: () => ApartmentService.getApartments(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes (reduced from 5)
    gcTime: 5 * 60 * 1000, // 5 minutes (reduced from 10)
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 1, // Only retry once on failure
    retryDelay: 1000, // 1 second delay between retries
  });
}

/**
 * Custom hook for fetching a single apartment
 */
export function useApartment(id: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.FLOORS, id],
    queryFn: () => ApartmentService.getApartmentById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Custom hook for apartment mutations
 */
export function useApartmentMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (
      apartment: Omit<Apartment, 'id' | 'createdAt' | 'updatedAt'>
    ) => ApartmentService.createApartment(apartment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FLOORS] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Omit<Apartment, 'id' | 'createdAt' | 'updatedAt'>>;
    }) => ApartmentService.updateApartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FLOORS] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ApartmentService.deleteApartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FLOORS] });
    },
  });

  return {
    createApartment: createMutation,
    updateApartment: updateMutation,
    deleteApartment: deleteMutation,
  };
}

/**
 * Custom hook for apartments with search functionality
 * Includes debouncing to prevent excessive API calls
 */
export function useApartmentsWithSearch(initialSearch = '') {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchQuery, 300); // 300ms debounce

  const filters: ApartmentFilters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
    }),
    [debouncedSearch]
  );

  const query = useApartments(filters);

  return {
    ...query,
    searchQuery,
    setSearchQuery,
    filteredApartments: query.data || [],
    isSearching: searchQuery !== debouncedSearch, // Show loading when debouncing
  };
}
