'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AuditPhoto } from '@/types/audit.types';

interface PhotoUploaderProps {
  photos?: AuditPhoto[];
  onPhotosChange: (files: File[]) => void;
  onRemovePhoto?: (photoId: number) => void;
  maxPhotos?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Atom: PhotoUploader
 * Componente para subir y mostrar fotos
 * Reutilizable para cualquier contexto (pregunta, elemento, espacio)
 */
export function PhotoUploader({
  photos = [],
  onPhotosChange,
  onRemovePhoto,
  maxPhotos = 5,
  required = false,
  disabled = false,
  className,
}: PhotoUploaderProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validar cantidad máxima
    const totalPhotos = photos.length + previewUrls.length + files.length;
    if (totalPhotos > maxPhotos) {
      alert(`Máximo ${maxPhotos} fotos permitidas`);
      return;
    }

    // Crear previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
    onPhotosChange(files);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePreview = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const allPhotos = [
    ...photos.map((p) => ({ id: p.id, url: p.url, isUploaded: true })),
    ...previewUrls.map((url, index) => ({
      id: `preview-${index}`,
      url,
      isUploaded: false,
    })),
  ];

  return (
    <div className={cn('space-y-3', className)}>
      {/* Botón de subir */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={disabled || allPhotos.length >= maxPhotos}
          className="hidden"
          id="photo-upload"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || allPhotos.length >= maxPhotos}
          className="w-full sm:w-auto"
        >
          <Upload className="h-4 w-4" />
          {allPhotos.length === 0 ? 'Subir fotos' : 'Agregar más fotos'}
        </Button>
        {required && allPhotos.length === 0 && (
          <p className="mt-1 text-xs text-destructive">
            Al menos una foto es requerida
          </p>
        )}
      </div>

      {/* Galería de fotos */}
      {allPhotos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {allPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
            >
              <img
                src={photo.url}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => {
                    if (photo.isUploaded && onRemovePhoto) {
                      onRemovePhoto(Number(photo.id));
                    } else {
                      const index = previewUrls.findIndex((url) => url === photo.url);
                      if (index !== -1) {
                        handleRemovePreview(index);
                      }
                    }
                  }}
                  className="absolute right-2 top-2 rounded-full bg-destructive/80 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contador */}
      {allPhotos.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {allPhotos.length} de {maxPhotos} fotos
        </p>
      )}
    </div>
  );
}

