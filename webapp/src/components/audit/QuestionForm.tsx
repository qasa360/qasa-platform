'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AnswerOption } from '@/components/forms/AnswerOption';
import { PhotoUploader } from '@/components/forms/PhotoUploader';
import { QuestionCard } from './QuestionCard';
import { useAnswerQuestion } from '@/lib/hooks/audit';
import { useToast } from '@/lib/hooks/use-toast';
import { Loader2, Save, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  AuditItem,
  AnswerType,
  QuestionTargetType,
  AnswerQuestionRequest,
} from '@/types/audit.types';
import { auditApi } from '@/lib/api/audit.api';

interface QuestionFormProps {
  auditId: number;
  question: AuditItem;
  targetType: QuestionTargetType;
  targetName?: string;
  onSuccess?: () => void;
  className?: string;
}

/**
 * Organism: QuestionForm
 * Formulario completo y reutilizable para responder cualquier pregunta
 * Soporta todos los tipos de respuesta: BOOLEAN, SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT, NUMBER, PHOTO
 */
export function QuestionForm({
  auditId,
  question,
  targetType,
  targetName,
  onSuccess,
  className,
}: QuestionFormProps) {
  const { toast } = useToast();
  const answerMutation = useAnswerQuestion(auditId);

  // Estado del formulario
  const [booleanValue, setBooleanValue] = useState<boolean | undefined>(
    question.answers?.[0]?.booleanValue
  );
  const [textValue, setTextValue] = useState<string>(
    question.answers?.[0]?.textValue || ''
  );
  const [numberValue, setNumberValue] = useState<number | undefined>(
    question.answers?.[0]?.numberValue
  );
  const [selectedOptionIds, setSelectedOptionIds] = useState<number[]>(
    question.answers?.[0]?.selectedOptions?.map(
      (opt) => opt.auditAnswerOptionId
    ) || []
  );
  const [notes, setNotes] = useState<string>(
    question.answers?.[0]?.notes || ''
  );
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const notesSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sincronizar con respuesta existente
  useEffect(() => {
    if (question.answers && question.answers.length > 0) {
      const answer = question.answers[0];
      setBooleanValue(answer.booleanValue);
      setTextValue(answer.textValue || '');
      setNumberValue(answer.numberValue);
      setSelectedOptionIds(
        answer.selectedOptions?.map((opt) => opt.auditAnswerOptionId) || []
      );
      setNotes(answer.notes || '');
    }
  }, [question.answers]);

  // Función para guardar automáticamente
  const autoSave = useCallback(
    async (skipValidation = false) => {
      // Para auto-guardado (skipValidation=true), verificar que haya un valor válido
      if (skipValidation) {
        // Para BOOLEAN, debe tener un valor definido (true o false, no undefined)
        if (question.answerType === 'BOOLEAN' && booleanValue === undefined) {
          return;
        }
        // Para SINGLE_CHOICE, debe tener al menos una opción seleccionada
        if (
          question.answerType === 'SINGLE_CHOICE' &&
          selectedOptionIds.length === 0
        ) {
          return;
        }
        // Para MULTIPLE_CHOICE, puede estar vacío (se maneja con el debounce)
        // Si está vacío, no guardar
        if (
          question.answerType === 'MULTIPLE_CHOICE' &&
          selectedOptionIds.length === 0
        ) {
          return;
        }
        // Para TEXT y NUMBER, se requiere guardado manual (no auto-guardado)
      } else {
        // Validaciones básicas para guardado manual
        if (question.isMandatory) {
          if (question.answerType === 'BOOLEAN' && booleanValue === undefined) {
            return;
          }
          if (question.answerType === 'TEXT' && !textValue.trim()) {
            return;
          }
          if (question.answerType === 'NUMBER' && numberValue === undefined) {
            return;
          }
          if (
            (question.answerType === 'SINGLE_CHOICE' ||
              question.answerType === 'MULTIPLE_CHOICE') &&
            selectedOptionIds.length === 0
          ) {
            return;
          }
        }
      }

      try {
        setIsAutoSaving(true);

        // Si hay fotos nuevas, subirlas primero
        let uploadedPhotos: Array<{ url: string }> = [];
        if (photoFiles.length > 0) {
          const photos = await auditApi.uploadPhotos(auditId, photoFiles, {
            context: 'RESPONSE',
            auditItemId: question.id,
          });
          uploadedPhotos = photos.map((p) => ({ url: p.url }));
        }

        // Preparar request
        const request: AnswerQuestionRequest = {
          auditItemId: question.id,
          notes: notes.trim() || undefined,
          photos: uploadedPhotos.length > 0 ? uploadedPhotos : undefined,
        };

        // Agregar valores según el tipo
        if (question.answerType === 'BOOLEAN') {
          request.booleanValue = booleanValue;
        } else if (question.answerType === 'TEXT') {
          request.textValue = textValue.trim();
        } else if (question.answerType === 'NUMBER') {
          request.numberValue = numberValue;
        } else if (
          question.answerType === 'SINGLE_CHOICE' ||
          question.answerType === 'MULTIPLE_CHOICE'
        ) {
          request.selectedOptionIds = selectedOptionIds;
        }

        // Enviar respuesta
        await answerMutation.mutateAsync(request);

        setLastSavedAt(new Date());
        setPhotoFiles([]);

        // Toast rápido de guardado
        toast({
          title: 'Guardado',
          description: 'Respuesta guardada automáticamente',
          variant: 'default',
        });

        // Callback de éxito
        onSuccess?.();
      } catch (error: any) {
        toast({
          title: 'Error al guardar',
          description: error.message || 'No se pudo guardar la respuesta',
          variant: 'destructive',
        });
      } finally {
        setIsAutoSaving(false);
      }
    },
    [
      question,
      booleanValue,
      textValue,
      numberValue,
      selectedOptionIds,
      notes,
      photoFiles,
      auditId,
      answerMutation,
      toast,
      onSuccess,
    ]
  );

  // Función para guardar con valores específicos (para evitar problemas de timing con el estado)
  const autoSaveWithValues = useCallback(
    async (newBooleanValue?: boolean, newSelectedOptionIds?: number[]) => {
      // Usar los valores pasados o los del estado actual
      const boolValue =
        newBooleanValue !== undefined ? newBooleanValue : booleanValue;
      const optionIds =
        newSelectedOptionIds !== undefined
          ? newSelectedOptionIds
          : selectedOptionIds;

      // Validar que haya un valor válido
      if (question.answerType === 'BOOLEAN' && boolValue === undefined) {
        return;
      }
      if (question.answerType === 'SINGLE_CHOICE' && optionIds.length === 0) {
        return;
      }
      if (question.answerType === 'MULTIPLE_CHOICE' && optionIds.length === 0) {
        return;
      }

      try {
        setIsAutoSaving(true);

        // Preparar request
        const request: AnswerQuestionRequest = {
          auditItemId: question.id,
          notes: notes.trim() || undefined,
          photos: undefined, // No subir fotos en auto-guardado
        };

        // Agregar valores según el tipo
        if (question.answerType === 'BOOLEAN') {
          request.booleanValue = boolValue;
        } else if (
          question.answerType === 'SINGLE_CHOICE' ||
          question.answerType === 'MULTIPLE_CHOICE'
        ) {
          request.selectedOptionIds = optionIds;
        }

        // Enviar respuesta
        await answerMutation.mutateAsync(request);

        setLastSavedAt(new Date());

        // Toast rápido de guardado
        toast({
          title: 'Guardado',
          description: 'Respuesta guardada automáticamente',
          variant: 'default',
        });

        // Callback de éxito
        onSuccess?.();
      } catch (error: any) {
        toast({
          title: 'Error al guardar',
          description: error.message || 'No se pudo guardar la respuesta',
          variant: 'destructive',
        });
      } finally {
        setIsAutoSaving(false);
      }
    },
    [
      question,
      booleanValue,
      selectedOptionIds,
      notes,
      auditId,
      answerMutation,
      toast,
      onSuccess,
    ]
  );

  // Función para manejar cambios que requieren auto-guardado
  const handleAutoSaveChange = useCallback(
    (newBooleanValue?: boolean, newSelectedOptionIds?: number[]) => {
      // Limpiar timeout anterior
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Tipos que se guardan automáticamente al seleccionar
      const autoSaveTypes: AnswerType[] = ['BOOLEAN', 'SINGLE_CHOICE'];
      if (autoSaveTypes.includes(question.answerType)) {
        // Guardar inmediatamente para estos tipos con los valores nuevos
        autoSaveWithValues(newBooleanValue, newSelectedOptionIds);
      } else if (question.answerType === 'MULTIPLE_CHOICE') {
        // Para múltiple choice, guardar después de un pequeño delay
        autoSaveTimeoutRef.current = setTimeout(() => {
          autoSaveWithValues(undefined, newSelectedOptionIds);
        }, 500);
      }
    },
    [question.answerType, autoSaveWithValues]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (question.isMandatory) {
      if (question.answerType === 'BOOLEAN' && booleanValue === undefined) {
        toast({
          title: 'Campo requerido',
          description: 'Por favor responde esta pregunta obligatoria',
          variant: 'destructive',
        });
        return;
      }
      if (question.answerType === 'TEXT' && !textValue.trim()) {
        toast({
          title: 'Campo requerido',
          description: 'Por favor completa esta pregunta obligatoria',
          variant: 'destructive',
        });
        return;
      }
      if (question.answerType === 'NUMBER' && numberValue === undefined) {
        toast({
          title: 'Campo requerido',
          description: 'Por favor completa esta pregunta obligatoria',
          variant: 'destructive',
        });
        return;
      }
      if (
        (question.answerType === 'SINGLE_CHOICE' ||
          question.answerType === 'MULTIPLE_CHOICE') &&
        selectedOptionIds.length === 0
      ) {
        toast({
          title: 'Campo requerido',
          description: 'Por favor selecciona al menos una opción',
          variant: 'destructive',
        });
        return;
      }
    }

    await autoSave(false);
  };

  // Función para guardar solo las notas
  const saveNotesOnly = useCallback(async () => {
    // Si no hay notas y no hay respuesta existente, no guardar
    if (!notes.trim() && !question.answers?.[0]) {
      return;
    }

    // Verificar si hay respuesta existente o respuesta actual para asociar las notas
    const hasExistingAnswer = question.answers && question.answers.length > 0;
    const hasCurrentAnswer =
      (question.answerType === 'BOOLEAN' && booleanValue !== undefined) ||
      (question.answerType === 'TEXT' && textValue.trim()) ||
      (question.answerType === 'NUMBER' && numberValue !== undefined) ||
      ((question.answerType === 'SINGLE_CHOICE' ||
        question.answerType === 'MULTIPLE_CHOICE') &&
        selectedOptionIds.length > 0);

    // Solo guardar si hay respuesta existente o respuesta actual
    // Esto asegura que las notas siempre estén asociadas a una respuesta
    if (!hasExistingAnswer && !hasCurrentAnswer) {
      return;
    }

    try {
      setIsAutoSaving(true);

      // Preparar request solo con notas
      const request: AnswerQuestionRequest = {
        auditItemId: question.id,
        notes: notes.trim() || undefined,
      };

      // Si hay una respuesta existente, incluir sus valores para no perderlos
      if (question.answers && question.answers.length > 0) {
        const existingAnswer = question.answers[0];
        if (question.answerType === 'BOOLEAN') {
          request.booleanValue = existingAnswer.booleanValue;
        } else if (question.answerType === 'TEXT') {
          request.textValue = existingAnswer.textValue;
        } else if (question.answerType === 'NUMBER') {
          request.numberValue = existingAnswer.numberValue;
        } else if (
          question.answerType === 'SINGLE_CHOICE' ||
          question.answerType === 'MULTIPLE_CHOICE'
        ) {
          request.selectedOptionIds =
            existingAnswer.selectedOptions?.map(
              (opt) => opt.auditAnswerOptionId
            ) || [];
        }
      } else {
        // Si no hay respuesta existente, usar los valores actuales del estado
        if (question.answerType === 'BOOLEAN') {
          request.booleanValue = booleanValue;
        } else if (question.answerType === 'TEXT') {
          request.textValue = textValue.trim();
        } else if (question.answerType === 'NUMBER') {
          request.numberValue = numberValue;
        } else if (
          question.answerType === 'SINGLE_CHOICE' ||
          question.answerType === 'MULTIPLE_CHOICE'
        ) {
          request.selectedOptionIds = selectedOptionIds;
        }
      }

      // Enviar respuesta
      await answerMutation.mutateAsync(request);

      setLastSavedAt(new Date());

      // Toast rápido de guardado
      toast({
        title: 'Guardado',
        description: 'Notas guardadas automáticamente',
        variant: 'default',
      });

      // No llamar onSuccess aquí porque guardar solo notas no debe disparar navegación automática
    } catch (error: any) {
      toast({
        title: 'Error al guardar',
        description: error.message || 'No se pudo guardar las notas',
        variant: 'destructive',
      });
    } finally {
      setIsAutoSaving(false);
    }
  }, [
    question,
    booleanValue,
    textValue,
    numberValue,
    selectedOptionIds,
    notes,
    auditId,
    answerMutation,
    toast,
  ]);

  // Función para manejar cambios en las notas con debounce
  const handleNotesChange = useCallback(
    (value: string) => {
      setNotes(value);

      // Limpiar timeout anterior
      if (notesSaveTimeoutRef.current) {
        clearTimeout(notesSaveTimeoutRef.current);
      }

      // Guardar después de 3 segundos de inactividad
      notesSaveTimeoutRef.current = setTimeout(() => {
        saveNotesOnly();
      }, 3000);
    },
    [saveNotesOnly]
  );

  // Función para manejar blur del campo de notas
  const handleNotesBlur = useCallback(() => {
    // Limpiar timeout si existe
    if (notesSaveTimeoutRef.current) {
      clearTimeout(notesSaveTimeoutRef.current);
    }

    // Guardar inmediatamente al perder el foco
    saveNotesOnly();
  }, [saveNotesOnly]);

  // Cleanup timeouts al desmontar
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      if (notesSaveTimeoutRef.current) {
        clearTimeout(notesSaveTimeoutRef.current);
      }
    };
  }, []);

  const renderAnswerInput = () => {
    switch (question.answerType) {
      case 'BOOLEAN':
        return (
          <RadioGroup
            value={booleanValue === undefined ? '' : String(booleanValue)}
            onValueChange={(value) => {
              const newValue = value === 'true';
              setBooleanValue(newValue);
              handleAutoSaveChange(newValue, undefined);
            }}
            disabled={answerMutation.isPending || isAutoSaving}
            className="flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
            <Label
              htmlFor="boolean-true"
              className={cn(
                'flex min-h-[64px] w-full cursor-pointer items-center justify-center gap-3 rounded-lg border-2 p-4 text-lg font-semibold transition-all hover:border-primary/50 hover:bg-accent sm:min-h-[72px]',
                booleanValue === true &&
                  'border-primary bg-primary text-primary-foreground',
                (answerMutation.isPending || isAutoSaving) &&
                  'cursor-not-allowed opacity-50'
              )}
            >
              <RadioGroupItem
                value="true"
                id="boolean-true"
                className="h-5 w-5"
              />
              <span>Sí</span>
            </Label>
            <Label
              htmlFor="boolean-false"
              className={cn(
                'flex min-h-[64px] w-full cursor-pointer items-center justify-center gap-3 rounded-lg border-2 p-4 text-lg font-semibold transition-all hover:border-primary/50 hover:bg-accent sm:min-h-[72px]',
                booleanValue === false &&
                  'border-primary bg-primary text-primary-foreground',
                (answerMutation.isPending || isAutoSaving) &&
                  'cursor-not-allowed opacity-50'
              )}
            >
              <RadioGroupItem
                value="false"
                id="boolean-false"
                className="h-5 w-5"
              />
              <span>No</span>
            </Label>
          </RadioGroup>
        );

      case 'SINGLE_CHOICE':
        if (!question.options || question.options.length === 0) {
          return (
            <p className="text-sm text-muted-foreground">
              No hay opciones disponibles
            </p>
          );
        }
        return (
          <RadioGroup
            value={
              selectedOptionIds.length > 0 ? String(selectedOptionIds[0]) : ''
            }
            onValueChange={(value) => {
              const newOptionIds = [Number(value)];
              setSelectedOptionIds(newOptionIds);
              handleAutoSaveChange(undefined, newOptionIds);
            }}
            disabled={answerMutation.isPending || isAutoSaving}
            className="flex flex-col gap-3"
          >
            {question.options
              .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
              .map((option) => (
                <AnswerOption
                  key={option.id}
                  option={option}
                  type="single"
                  checked={selectedOptionIds.includes(option.id)}
                  onCheckedChange={() => {
                    // No hacer nada aquí, el RadioGroup maneja el cambio
                  }}
                  value={String(option.id)}
                  disabled={answerMutation.isPending || isAutoSaving}
                />
              ))}
          </RadioGroup>
        );

      case 'MULTIPLE_CHOICE':
        if (!question.options || question.options.length === 0) {
          return (
            <p className="text-sm text-muted-foreground">
              No hay opciones disponibles
            </p>
          );
        }
        return (
          <div className="flex flex-col gap-3">
            {question.options
              .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
              .map((option) => (
                <AnswerOption
                  key={option.id}
                  option={option}
                  type="multiple"
                  checked={selectedOptionIds.includes(option.id)}
                  onCheckedChange={(checked) => {
                    let newOptionIds: number[];
                    if (checked) {
                      newOptionIds = [...selectedOptionIds, option.id];
                      setSelectedOptionIds(newOptionIds);
                    } else {
                      newOptionIds = selectedOptionIds.filter(
                        (id) => id !== option.id
                      );
                      setSelectedOptionIds(newOptionIds);
                    }
                    handleAutoSaveChange(undefined, newOptionIds);
                  }}
                  disabled={answerMutation.isPending || isAutoSaving}
                />
              ))}
          </div>
        );

      case 'TEXT':
        return (
          <Textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            disabled={answerMutation.isPending}
            rows={4}
            required={question.isMandatory}
          />
        );

      case 'NUMBER':
        return (
          <Input
            type="number"
            value={numberValue || ''}
            onChange={(e) =>
              setNumberValue(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            placeholder="Ingresa un número..."
            disabled={answerMutation.isPending}
            required={question.isMandatory}
            className="max-w-xs"
          />
        );

      case 'PHOTO':
        return (
          <PhotoUploader
            photos={question.photos}
            onPhotosChange={setPhotoFiles}
            required={question.isMandatory}
            disabled={answerMutation.isPending}
          />
        );

      default:
        return (
          <p className="text-sm text-muted-foreground">
            Tipo de respuesta no soportado
          </p>
        );
    }
  };

  return (
    <QuestionCard
      question={question}
      targetType={targetType}
      targetName={targetName}
      className={className}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input de respuesta según tipo */}
        <div>{renderAnswerInput()}</div>

        {/* Campo de notas (opcional, siempre disponible) */}
        {question.answerType !== 'PHOTO' && (
          <div className="space-y-2">
            <Label htmlFor="notes">Notas adicionales (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Agrega notas adicionales si es necesario..."
              disabled={answerMutation.isPending || isAutoSaving}
              rows={3}
            />
          </div>
        )}

        {/* Indicador de guardado automático y botón manual */}
        <div className="flex items-center justify-between gap-2">
          {/* Indicador de guardado automático */}
          {(isAutoSaving || lastSavedAt) && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isAutoSaving ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : lastSavedAt ? (
                <>
                  <Check className="h-3 w-3 text-green-600" />
                  <span>Guardado</span>
                </>
              ) : null}
            </div>
          )}

          {/* Botón de guardar manual (solo para tipos que no se guardan automáticamente) */}
          {!['BOOLEAN', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE'].includes(
            question.answerType
          ) && (
            <Button
              type="submit"
              disabled={answerMutation.isPending || isAutoSaving}
              className="ml-auto min-w-[120px]"
            >
              {answerMutation.isPending || isAutoSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Respuesta
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </QuestionCard>
  );
}
