/**
 * Audit Utilities - Pure Functions
 * Funciones puras para cálculos y transformaciones
 */

import type {
  AuditItem,
  SpaceProgress,
  ElementProgress,
} from '@/types/audit.types';

/**
 * Calcular progreso de espacios desde items
 */
export function calculateSpacesProgress(
  items: AuditItem[],
  spaces: Array<{
    id: number;
    name: string;
    spaceTypeId: number;
    order: number | null;
  }>
): SpaceProgress[] {
  const spaceMap = new Map<number, SpaceProgress>();

  // Inicializar espacios
  spaces.forEach((space) => {
    spaceMap.set(space.id, {
      spaceId: space.id,
      spaceName: space.name,
      spaceTypeId: space.spaceTypeId,
      order: space.order,
      totalQuestions: 0,
      answeredQuestions: 0,
      completionRate: 0,
      hasRequiredPhotos: false,
    });
  });

  // Contar preguntas por espacio
  // Incluir tanto preguntas de tipo SPACE como preguntas de tipo ELEMENT
  items.forEach((item) => {
    if (item.spaceId && !item.parentAuditItemId) {
      // Solo contar preguntas principales (no follow-ups)
      // Incluir preguntas de tipo SPACE y ELEMENT que pertenecen a este espacio
      const progress = spaceMap.get(item.spaceId);
      if (progress) {
        progress.totalQuestions++;
        if (item.isAnswered) {
          progress.answeredQuestions++;
        }
      }
    }
  });

  // Calcular porcentajes y verificar fotos
  spaceMap.forEach((progress) => {
    progress.completionRate =
      progress.totalQuestions > 0
        ? (progress.answeredQuestions / progress.totalQuestions) * 100
        : 0;

    // Verificar si tiene fotos requeridas
    const spaceItems = items.filter(
      (item) => item.spaceId === progress.spaceId
    );
    progress.hasRequiredPhotos = spaceItems.some(
      (item) => item.photos && item.photos.length > 0
    );
  });

  return Array.from(spaceMap.values()).sort((a, b) => {
    // Ordenar por order, luego por nombre
    if (a.order !== null && b.order !== null) {
      return a.order - b.order;
    }
    if (a.order !== null) return -1;
    if (b.order !== null) return 1;
    return a.spaceName.localeCompare(b.spaceName);
  });
}

/**
 * Obtener preguntas generales (nivel apartamento)
 */
export function getGeneralQuestions(items: AuditItem[]): AuditItem[] {
  return items
    .filter(
      (item) =>
        item.targetType === 'APARTMENT' &&
        !item.spaceId &&
        !item.parentAuditItemId
    )
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

/**
 * Obtener preguntas de un espacio
 */
export function getSpaceQuestions(
  items: AuditItem[],
  spaceId: number
): AuditItem[] {
  return items
    .filter(
      (item) =>
        item.spaceId === spaceId &&
        item.targetType === 'SPACE' &&
        !item.parentAuditItemId
    )
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

/**
 * Agrupar items por elemento y calcular progreso
 */
export function calculateElementsProgress(
  items: AuditItem[],
  spaceId: number,
  elements: Array<{ id: number; name: string; elementTypeId: number }>
): ElementProgress[] {
  const elementMap = new Map<number, ElementProgress>();

  // Inicializar elementos
  elements.forEach((element) => {
    elementMap.set(element.id, {
      elementId: element.id,
      elementName: element.name,
      elementTypeId: element.elementTypeId,
      totalQuestions: 0,
      answeredQuestions: 0,
      completionRate: 0,
      hasRequiredPhotos: false,
      nextUnansweredQuestionId: null,
    });
  });

  // Contar preguntas por elemento
  items.forEach((item) => {
    if (item.spaceId === spaceId && item.elementId && !item.parentAuditItemId) {
      const progress = elementMap.get(item.elementId);
      if (progress) {
        progress.totalQuestions++;
        if (item.isAnswered) {
          progress.answeredQuestions++;
        } else if (!progress.nextUnansweredQuestionId) {
          progress.nextUnansweredQuestionId = item.id;
        }
      }
    }
  });

  // Calcular porcentajes y verificar fotos
  elementMap.forEach((progress) => {
    progress.completionRate =
      progress.totalQuestions > 0
        ? (progress.answeredQuestions / progress.totalQuestions) * 100
        : 0;

    const elementItems = items.filter(
      (item) => item.elementId === progress.elementId
    );
    progress.hasRequiredPhotos = elementItems.some(
      (item) => item.photos && item.photos.length > 0
    );
  });

  return Array.from(elementMap.values());
}

/**
 * Obtener preguntas de un elemento
 */
export function getElementQuestions(
  items: AuditItem[],
  elementId: number
): AuditItem[] {
  return items
    .filter((item) => item.elementId === elementId && !item.parentAuditItemId)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

/**
 * Obtener primera pregunta sin responder de un elemento
 */
export function getNextUnansweredQuestion(
  items: AuditItem[],
  elementId: number
): AuditItem | null {
  const unanswered = items
    .filter(
      (item) =>
        item.elementId === elementId &&
        !item.isAnswered &&
        !item.parentAuditItemId
    )
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return unanswered[0] || null;
}

/**
 * Obtener follow-ups de una pregunta
 */
export function getFollowupQuestions(
  items: AuditItem[],
  parentItemId: number
): AuditItem[] {
  return items
    .filter((item) => item.parentAuditItemId === parentItemId)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

/**
 * Calcular tiempo transcurrido desde startedAt
 */
export function calculateElapsedTime(startedAt?: string): number {
  if (!startedAt) return 0;
  return Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
}

/**
 * Formatear tiempo en formato HH:MM:SS
 */
export function formatElapsedTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Encontrar el próximo espacio y elemento a auditar
 * Retorna { spaceId, elementId } o null si no hay más elementos
 */
export function getNextSpaceAndElement(
  items: AuditItem[],
  spaces: Array<{
    id: number;
    name: string;
    spaceTypeId: number;
    order: number | null;
  }>
): { spaceId: number; elementId: number } | null {
  // Ordenar espacios por order
  const sortedSpaces = [...spaces].sort((a, b) => {
    if (a.order !== null && b.order !== null) {
      return a.order - b.order;
    }
    if (a.order !== null) return -1;
    if (b.order !== null) return 1;
    return a.name.localeCompare(b.name);
  });

  // Buscar el primer espacio con elementos sin auditar
  for (const space of sortedSpaces) {
    // Obtener todos los elementos únicos que tienen preguntas en este espacio
    const elementIds = new Set<number>();
    items.forEach((item) => {
      if (
        item.spaceId === space.id &&
        item.elementId &&
        !item.parentAuditItemId
      ) {
        elementIds.add(item.elementId);
      }
    });

    // Buscar el primer elemento con preguntas sin responder
    for (const elementId of elementIds) {
      const elementQuestions = items.filter(
        (item) =>
          item.spaceId === space.id &&
          item.elementId === elementId &&
          !item.parentAuditItemId
      );

      // Si hay al menos una pregunta sin responder, este es el próximo elemento
      const hasUnanswered = elementQuestions.some((q) => !q.isAnswered);
      if (hasUnanswered) {
        return { spaceId: space.id, elementId };
      }
    }
  }

  return null;
}

/**
 * Verificar si todas las preguntas de un elemento están completadas
 * Incluye preguntas principales y sus follow-ups
 */
export function areAllElementQuestionsAnswered(
  items: AuditItem[],
  elementId: number
): boolean {
  // Obtener todas las preguntas principales del elemento
  const mainQuestions = items.filter(
    (item) => item.elementId === elementId && !item.parentAuditItemId
  );

  // Verificar que todas las preguntas principales estén respondidas
  const allMainAnswered = mainQuestions.every((q) => q.isAnswered);
  if (!allMainAnswered) {
    return false;
  }

  // Verificar que todas las follow-ups de las preguntas principales también estén respondidas
  for (const mainQuestion of mainQuestions) {
    const followups = items.filter(
      (item) => item.parentAuditItemId === mainQuestion.id
    );
    const allFollowupsAnswered = followups.every((f) => f.isAnswered);
    if (!allFollowupsAnswered) {
      return false;
    }
  }

  return true;
}

/**
 * Verificar si todas las preguntas de la auditoría están completadas
 * Incluye preguntas generales, de espacios y de elementos (con sus follow-ups)
 */
export function areAllAuditQuestionsAnswered(items: AuditItem[]): boolean {
  if (items.length === 0) {
    return false;
  }

  // Obtener todas las preguntas principales (no follow-ups)
  const mainQuestions = items.filter((item) => !item.parentAuditItemId);

  // Verificar que todas las preguntas principales estén respondidas
  const allMainAnswered = mainQuestions.every((q) => q.isAnswered);
  if (!allMainAnswered) {
    return false;
  }

  // Verificar que todas las follow-ups también estén respondidas
  for (const mainQuestion of mainQuestions) {
    const followups = items.filter(
      (item) => item.parentAuditItemId === mainQuestion.id
    );
    const allFollowupsAnswered = followups.every((f) => f.isAnswered);
    if (!allFollowupsAnswered) {
      return false;
    }
  }

  return true;
}

/**
 * Encontrar el próximo elemento a auditar en el mismo espacio
 * Retorna { spaceId, elementId } o null si no hay más elementos en el espacio
 */
export function getNextElementInSpace(
  items: AuditItem[],
  currentSpaceId: number,
  currentElementId: number
): { spaceId: number; elementId: number } | null {
  // Obtener todos los elementos únicos del espacio actual que tienen preguntas
  const currentSpaceElementIds = new Set<number>();
  items.forEach((item) => {
    if (
      item.spaceId === currentSpaceId &&
      item.elementId &&
      !item.parentAuditItemId
    ) {
      currentSpaceElementIds.add(item.elementId);
    }
  });

  // Convertir a array y ordenar (asumiendo que los IDs están en orden de creación/orden)
  const sortedCurrentSpaceElements = Array.from(currentSpaceElementIds).sort(
    (a, b) => a - b
  );

  // Buscar el índice del elemento actual
  const currentIndex = sortedCurrentSpaceElements.indexOf(currentElementId);

  // Buscar el próximo elemento en el mismo espacio (después del actual)
  if (
    currentIndex >= 0 &&
    currentIndex < sortedCurrentSpaceElements.length - 1
  ) {
    for (let i = currentIndex + 1; i < sortedCurrentSpaceElements.length; i++) {
      const elementId = sortedCurrentSpaceElements[i];
      const elementQuestions = items.filter(
        (item) =>
          item.spaceId === currentSpaceId &&
          item.elementId === elementId &&
          !item.parentAuditItemId
      );

      // Si hay al menos una pregunta sin responder, este es el próximo elemento
      const hasUnanswered = elementQuestions.some((q) => !q.isAnswered);
      if (hasUnanswered) {
        return { spaceId: currentSpaceId, elementId };
      }
    }
  }

  // No hay más elementos en el espacio actual
  return null;
}

/**
 * Encontrar el próximo espacio a auditar después del espacio actual
 * Retorna el ID del próximo espacio o null si no hay más espacios
 */
export function getNextSpace(
  spaces: Array<{
    id: number;
    name: string;
    spaceTypeId: number;
    order: number | null;
  }>,
  currentSpaceId: number
): number | null {
  // Ordenar espacios por order
  const sortedSpaces = [...spaces].sort((a, b) => {
    if (a.order !== null && b.order !== null) {
      return a.order - b.order;
    }
    if (a.order !== null) return -1;
    if (b.order !== null) return 1;
    return a.name.localeCompare(b.name);
  });

  // Buscar el índice del espacio actual
  const currentSpaceIndex = sortedSpaces.findIndex(
    (s) => s.id === currentSpaceId
  );

  // Si hay un próximo espacio, retornarlo
  if (currentSpaceIndex >= 0 && currentSpaceIndex < sortedSpaces.length - 1) {
    return sortedSpaces[currentSpaceIndex + 1].id;
  }

  // No hay más espacios
  return null;
}
