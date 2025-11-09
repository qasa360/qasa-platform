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
  spaces: Array<{ id: number; name: string; spaceTypeId: number; order: number | null }>
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
  items.forEach((item) => {
    if (item.spaceId && !item.parentAuditItemId) {
      // Solo contar preguntas principales (no follow-ups)
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
    const spaceItems = items.filter((item) => item.spaceId === progress.spaceId);
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
    if (item.elementId === spaceId && !item.parentAuditItemId) {
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

    const elementItems = items.filter((item) => item.elementId === progress.elementId);
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

