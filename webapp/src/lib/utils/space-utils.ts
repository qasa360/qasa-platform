import { SpaceType } from '@/lib/types/apartment';

/**
 * Maps space types to Spanish labels
 */
export const getSpaceTypeLabel = (spaceType: SpaceType): string => {
  const labels: Record<SpaceType, string> = {
    [SpaceType.LIVING_ROOM]: 'Salón',
    [SpaceType.BEDROOM]: 'Dormitorio',
    [SpaceType.KITCHEN]: 'Cocina',
    [SpaceType.BATHROOM]: 'Baño',
    [SpaceType.BALCONY]: 'Balcón',
    [SpaceType.OTHER]: 'Otro',
  };

  return labels[spaceType];
};

/**
 * Gets the appropriate icon for a space type
 */
export const getSpaceTypeIcon = (spaceType: SpaceType): string => {
  const icons: Record<SpaceType, string> = {
    [SpaceType.LIVING_ROOM]: '🛋️',
    [SpaceType.BEDROOM]: '🛏️',
    [SpaceType.KITCHEN]: '🍳',
    [SpaceType.BATHROOM]: '🚿',
    [SpaceType.BALCONY]: '🌿',
    [SpaceType.OTHER]: '📦',
  };

  return icons[spaceType];
};
