/**
 * Domain Types - Audit System
 * Tipos puros sin dependencias de framework
 */

export type AuditStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';

export type QuestionTargetType = 'APARTMENT' | 'SPACE' | 'ELEMENT';

export type AnswerType =
  | 'BOOLEAN'
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'TEXT'
  | 'NUMBER'
  | 'PHOTO';

export type QuestionCategory =
  | 'SAFETY'
  | 'CLEANLINESS'
  | 'MAINTENANCE'
  | 'LEGAL'
  | 'INVENTORY'
  | 'CUSTOM';

export type ImpactLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AuditPhotoContext =
  | 'AUDIT'
  | 'SPACE'
  | 'ELEMENT'
  | 'QUESTION'
  | 'RESPONSE'
  | 'INCIDENCE';

export interface Audit {
  id: number;
  uuid: string;
  apartmentId: number;
  auditTemplateVersionId: number;
  status: AuditStatus;
  completionRate: number;
  score?: number;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelledReason?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  items?: AuditItem[];
  incidences?: AuditIncidence[];
  photos?: AuditPhoto[];
}

export interface AuditItem {
  id: number;
  uuid: string;
  auditId: number;
  questionTemplateId: number;
  targetType: QuestionTargetType;
  apartmentId?: number;
  spaceId?: number;
  elementId?: number;
  questionText: string;
  answerType: AnswerType;
  category: QuestionCategory;
  weight?: number;
  impact: ImpactLevel;
  isMandatory: boolean;
  sortOrder?: number;
  isAnswered: boolean;
  isVisible: boolean;
  completionRate: number;
  startedAt?: string;
  completedAt?: string;
  parentAuditItemId?: number;
  answers?: AuditResponse[];
  options?: AuditAnswerOption[];
  photos?: AuditPhoto[];
  incidences?: AuditIncidence[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditResponse {
  id: number;
  auditItemId: number;
  booleanValue?: boolean;
  textValue?: string;
  numberValue?: number;
  notes?: string;
  selectedOptions?: AuditResponseOption[];
  photos?: AuditPhoto[];
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditResponseOption {
  id: number;
  auditResponseId: number;
  auditAnswerOptionId: number;
}

export interface AuditAnswerOption {
  id: number;
  auditItemId: number;
  answerOptionTemplateId: number;
  code: string;
  label: string;
  sortOrder?: number;
  penaltyWeight?: number;
  createdAt: string;
}

export interface AuditPhoto {
  id: number;
  auditId: number;
  context: AuditPhotoContext;
  url: string;
  description?: string;
  metadata?: Record<string, unknown>;
  spaceId?: number;
  elementId?: number;
  auditItemId?: number;
  auditResponseId?: number;
  auditIncidenceId?: number;
  createdBy?: string;
  createdAt: string;
}

export interface AuditIncidence {
  id: number;
  uuid: string;
  auditId: number;
  auditItemId?: number;
  incidenceTemplateId?: number;
  targetType: QuestionTargetType;
  apartmentId?: number;
  spaceId?: number;
  elementId?: number;
  name: string;
  code?: string;
  category: QuestionCategory;
  severity: string;
  nonConformity?: string;
  responsible: string;
  description?: string;
  actionsJson?: Record<string, unknown>;
  status: string;
  resolvedAt?: string;
  closedAt?: string;
  resolvedBy?: string;
  closedBy?: string;
  photos?: AuditPhoto[];
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// DTOs para requests
export interface StartAuditRequest {
  apartmentId: number;
  auditTemplateVersionId?: number;
}

export interface AnswerQuestionRequest {
  auditItemId: number;
  booleanValue?: boolean;
  textValue?: string;
  numberValue?: number;
  selectedOptionIds?: number[];
  notes?: string;
  photos?: Array<{
    url: string;
    description?: string;
    metadata?: Record<string, unknown>;
  }>;
}

export interface UploadPhotosRequest {
  context: AuditPhotoContext;
  description?: string;
  spaceId?: number;
  elementId?: number;
  auditItemId?: number;
  auditResponseId?: number;
  auditIncidenceId?: number;
}

// Tipos calculados para UI
export interface SpaceProgress {
  spaceId: number;
  spaceName: string;
  spaceTypeId: number;
  order: number | null;
  totalQuestions: number;
  answeredQuestions: number;
  completionRate: number;
  hasRequiredPhotos: boolean;
}

export interface ElementProgress {
  elementId: number;
  elementName: string;
  elementTypeId: number;
  totalQuestions: number;
  answeredQuestions: number;
  completionRate: number;
  hasRequiredPhotos: boolean;
  nextUnansweredQuestionId: number | null;
}

