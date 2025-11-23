'use client';

import { SpaceCard } from './SpaceCard';
import { GeneralQuestionsSection } from './GeneralQuestionsSection';
import type { Audit, AuditItem, SpaceProgress } from '@/types/audit.types';

interface AuditSpacesTableProps {
  audit: Audit;
  spacesProgress: SpaceProgress[];
  generalQuestions: AuditItem[];
}

/**
 * Tabla de espacios - Mobile First
 * Lista vertical optimizada para mobile
 */
export function AuditSpacesTable({
  audit,
  spacesProgress,
  generalQuestions,
}: AuditSpacesTableProps) {
  return (
    <div className="space-y-4">
      {/* Preguntas generales primero */}
      {generalQuestions.length > 0 && (
        <GeneralQuestionsSection
          auditId={audit.id}
          questions={generalQuestions}
        />
      )}

      {/* Lista de espacios */}
      <div className="space-y-3">
        {spacesProgress.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No hay espacios disponibles</p>
          </div>
        ) : (
          spacesProgress.map((space) => (
            <SpaceCard key={space.spaceId} auditId={audit.id} space={space} />
          ))
        )}
      </div>
    </div>
  );
}
