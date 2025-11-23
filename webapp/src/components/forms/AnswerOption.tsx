'use client';

import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { AuditAnswerOption } from '@/types/audit.types';

interface AnswerOptionProps {
  option: AuditAnswerOption;
  type: 'single' | 'multiple';
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  value?: string;
  disabled?: boolean;
}

/**
 * Atom: AnswerOption
 * Componente reutilizable para mostrar una opción de respuesta
 * Soporta SINGLE_CHOICE (radio) y MULTIPLE_CHOICE (checkbox)
 * Optimizado para mobile con áreas de clic grandes
 */
export function AnswerOption({
  option,
  type,
  checked,
  onCheckedChange,
  value,
  disabled = false,
}: AnswerOptionProps) {
  const id = `option-${option.id}`;

  if (type === 'single') {
    return (
      <Label
        htmlFor={id}
        className={cn(
          'flex min-h-[56px] w-full cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all hover:bg-accent hover:border-primary/50',
          checked && 'border-primary bg-primary/5',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <RadioGroupItem
          value={value || String(option.id)}
          id={id}
          disabled={disabled}
          className="h-5 w-5 shrink-0"
        />
        <span className="flex-1 text-base font-medium leading-tight">
          {option.label}
        </span>
      </Label>
    );
  }

  return (
    <Label
      htmlFor={id}
      className={cn(
        'flex min-h-[56px] w-full cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all hover:bg-accent hover:border-primary/50',
        checked && 'border-primary bg-primary/5',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="h-5 w-5 shrink-0"
      />
      <span className="flex-1 text-base font-medium leading-tight">
        {option.label}
      </span>
    </Label>
  );
}

