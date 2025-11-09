'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileQuestion, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { AuditItem } from '@/types/audit.types';
import { cn } from '@/lib/utils';

interface GeneralQuestionsSectionProps {
  auditId: number;
  questions: AuditItem[];
}

/**
 * Sección de preguntas generales - Mobile First
 * Se muestra primero en la lista
 */
export function GeneralQuestionsSection({
  auditId,
  questions,
}: GeneralQuestionsSectionProps) {
  const answered = questions.filter((q) => q.isAnswered).length;
  const completionRate =
    questions.length > 0 ? (answered / questions.length) * 100 : 0;
  const isComplete = completionRate === 100;

  if (questions.length === 0) return null;

  return (
    <Link href={`/audits/${auditId}/general`}>
      <Card
        className={cn(
          'mb-4 touch-manipulation transition-all active:scale-[0.98]',
          isComplete &&
            'border-green-500/50 bg-green-50/50 dark:bg-green-950/20'
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <FileQuestion className="h-5 w-5 shrink-0 text-primary" />
              <CardTitle className="text-base leading-tight">
                Preguntas Generales
              </CardTitle>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {answered} de {questions.length} respondidas
            </span>
            <Badge
              variant={isComplete ? 'success' : 'default'}
              className="text-xs"
            >
              {Math.round(completionRate)}%
            </Badge>
          </div>
          <Progress value={completionRate} size="sm" />
        </CardContent>
      </Card>
    </Link>
  );
}
