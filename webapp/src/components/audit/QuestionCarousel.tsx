'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AuditItem, QuestionTargetType } from '@/types/audit.types';
import { QuestionForm } from './QuestionForm';

interface QuestionCarouselProps {
  auditId: number;
  questions: AuditItem[];
  targetType: QuestionTargetType;
  targetName?: string;
  onQuestionSuccess?: () => void;
  className?: string;
}

/**
 * Organism: QuestionCarousel
 * Carousel para mostrar preguntas una a la vez, optimizado para mobile
 * Enfoca el 100% de la atención en una sola pregunta
 */
export function QuestionCarousel({
  auditId,
  questions,
  targetType,
  targetName,
  onQuestionSuccess,
  className,
}: QuestionCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const currentIndexRef = useRef(0);

  // Mantener referencia sincronizada
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Resetear índice cuando cambian las preguntas (solo si la lista se reduce)
  useEffect(() => {
    // Si el índice actual está fuera de rango, ajustarlo
    if (currentIndex >= questions.length && questions.length > 0) {
      setCurrentIndex(questions.length - 1);
    }
  }, [questions.length, currentIndex]);

  const currentQuestion = questions[currentIndex];
  const hasNext = currentIndex < questions.length - 1;
  const hasPrevious = currentIndex > 0;

  const goToNext = () => {
    if (hasNext) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (hasPrevious) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    }
  };

  // Variantes de animación para el carousel
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      position: 'relative' as const,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      position: 'absolute' as const,
    }),
  };

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className={cn('relative w-full', className)}>
      {/* Indicador de progreso */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Pregunta {currentIndex + 1} de {questions.length}
            </span>
            <span className="text-xs">
              {Math.round(((currentIndex + 1) / questions.length) * 100)}%
            </span>
          </div>
          {/* Barra de progreso */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Contenedor del carousel */}
      <div className="relative w-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentQuestion.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full"
          >
            <QuestionForm
              auditId={auditId}
              question={currentQuestion}
              targetType={targetType}
              targetName={targetName}
              onSuccess={() => {
                onQuestionSuccess?.();
                // Auto-avanzar a la siguiente pregunta después de un breve delay
                // Usar ref para obtener el índice actual en el momento de ejecución
                setTimeout(() => {
                  const currentIdx = currentIndexRef.current;
                  if (currentIdx < questions.length - 1) {
                    goToNext();
                  }
                }, 800);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles de navegación */}
      <div className="mt-6 flex items-center justify-between gap-4">
        {/* Botón anterior */}
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevious}
          disabled={!hasPrevious}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </Button>

        {/* Indicadores de puntos (mobile) */}
        <div className="flex items-center gap-1 sm:hidden">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={cn(
                'h-2 rounded-full transition-all',
                index === currentIndex
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-muted-foreground/30'
              )}
              aria-label={`Ir a pregunta ${index + 1}`}
            />
          ))}
        </div>

        {/* Indicadores numéricos (desktop) */}
        <div className="hidden items-center gap-1 sm:flex">
          {questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => goToQuestion(index)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors',
                index === currentIndex
                  ? 'bg-primary text-primary-foreground'
                  : question.isAnswered
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
              aria-label={`Ir a pregunta ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Botón siguiente */}
        <Button
          variant="outline"
          size="sm"
          onClick={goToNext}
          disabled={!hasNext}
          className="flex items-center gap-2"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
