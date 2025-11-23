'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AuditItem, QuestionTargetType } from '@/types/audit.types';

interface QuestionCardProps {
  question: AuditItem;
  targetType: QuestionTargetType;
  targetName?: string; // Nombre del apartamento/espacio/elemento
  children: React.ReactNode; // Contenido del formulario
  className?: string;
}

/**
 * Molecule: QuestionCard
 * Wrapper reutilizable para mostrar una pregunta
 * Se adapta según el contexto (general/espacio/elemento)
 */
export function QuestionCard({
  question,
  targetType,
  targetName,
  children,
  className,
}: QuestionCardProps) {
  const getContextLabel = () => {
    switch (targetType) {
      case 'APARTMENT':
        return 'Pregunta General';
      case 'SPACE':
        return targetName ? `Espacio: ${targetName}` : 'Espacio';
      case 'ELEMENT':
        return targetName ? `Elemento: ${targetName}` : 'Elemento';
      default:
        return '';
    }
  };

  const getImpactBadgeVariant = () => {
    switch (question.impact) {
      case 'CRITICAL':
        return 'destructive';
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'default';
      case 'LOW':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="space-y-3 pb-4">
        {/* Contexto y badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {targetType !== 'APARTMENT' && targetName && (
              <Badge variant="outline" className="text-xs">
                {getContextLabel()}
              </Badge>
            )}
            <Badge variant={getImpactBadgeVariant()} className="text-xs">
              {question.impact}
            </Badge>
            {question.isMandatory && (
              <Badge variant="destructive" className="text-xs">
                Obligatoria
              </Badge>
            )}
            {question.category && (
              <Badge variant="secondary" className="text-xs">
                {question.category}
              </Badge>
            )}
          </div>
          {question.isAnswered && (
            <Badge variant="success" className="text-xs">
              Respondida
            </Badge>
          )}
        </div>

        {/* Texto de la pregunta */}
        <h3 className="text-lg font-semibold leading-tight">
          {question.questionText}
        </h3>

        {/* Advertencia si es obligatoria y no respondida */}
        {question.isMandatory && !question.isAnswered && (
          <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Esta pregunta es obligatoria</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

