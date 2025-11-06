# Guía de Navegación - QASA Platform

## Resumen

La plataforma QASA ahora implementa un sistema de navegación de dos niveles:

1. **Navegación Principal**: Sidebar fijo en desktop, hamburger menu en mobile
2. **Navegación Secundaria**: Top navbar específico por página

## Estructura de Componentes

### 1. Layout Principal

```tsx
// src/app/layout.tsx
<AppLayout>
  {children}
</AppLayout>
```

### 2. Componentes de Navegación

#### Sidebar (Navegación Principal)
- **Ubicación**: `src/components/layout/sidebar.tsx`
- **Comportamiento**: 
  - Desktop: Fijo a la izquierda (256px de ancho)
  - Mobile: Oculto (usa Header con hamburger menu)

#### TopNavbar (Navegación Secundaria)
- **Ubicación**: `src/components/layout/top-navbar.tsx`
- **Comportamiento**: Fijo en la parte superior, solo visible en desktop
- **Contenido**: Dinámico según la página actual

#### Header (Mobile)
- **Ubicación**: `src/components/layout/header.tsx`
- **Comportamiento**: Solo visible en mobile, contiene hamburger menu

## Cómo Usar la Navegación Secundaria

### 1. Crear Componente de Navegación Secundaria

```tsx
// src/components/dashboard/dashboard-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Resumen', icon: BarChart3 },
    { href: '/dashboard/analytics', label: 'Analíticas', icon: TrendingUp },
  ];

  return (
    <nav className="flex space-x-1">
      {navLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
              pathname === link.href
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground/60 hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

### 2. Usar en una Página

```tsx
// src/app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useSecondaryNav } from '@/hooks/use-secondary-nav';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';

export default function DashboardPage() {
  const { setSecondaryNav } = useSecondaryNav();

  useEffect(() => {
    // Establecer navegación secundaria para esta página
    setSecondaryNav(<DashboardNav />);

    // Limpiar al desmontar
    return () => {
      setSecondaryNav(null);
    };
  }, [setSecondaryNav]);

  return (
    <div className="container py-10">
      {/* Contenido de la página */}
    </div>
  );
}
```

## Comportamiento Responsive

### Desktop (md: y superior)
- **Sidebar**: Fijo a la izquierda (256px)
- **TopNavbar**: Fijo en la parte superior
- **Main Content**: Con margen izquierdo para el sidebar

### Mobile (menor a md:)
- **Header**: Con hamburger menu
- **Sidebar**: Oculto
- **TopNavbar**: Oculto
- **Main Content**: Sin margen

## Estilos y Clases CSS

### Sidebar
- Ancho fijo: `w-64` (256px)
- Posición: `fixed inset-y-0`
- Z-index: `z-50`

### TopNavbar
- Altura: `h-14`
- Posición: `sticky top-0`
- Z-index: `z-40`
- Margen izquierdo en desktop: `md:pl-72`

### Main Content
- Margen izquierdo en desktop: `md:pl-64`
- Padding superior en desktop: `md:pt-14`

## Ejemplos de Uso

### Página con Navegación Secundaria
```tsx
// Ejemplo: Página de Auditorías
export default function AuditsPage() {
  const { setSecondaryNav } = useSecondaryNav();

  useEffect(() => {
    setSecondaryNav(
      <nav className="flex space-x-1">
        <Link href="/audits" className="px-3 py-2 text-sm font-medium rounded-md">
          Todas las Auditorías
        </Link>
        <Link href="/audits/new" className="px-3 py-2 text-sm font-medium rounded-md">
          Nueva Auditoría
        </Link>
      </nav>
    );

    return () => setSecondaryNav(null);
  }, [setSecondaryNav]);

  return <div>Contenido de auditorías</div>;
}
```

### Página sin Navegación Secundaria
```tsx
// Ejemplo: Página de inicio
export default function HomePage() {
  // No necesita navegación secundaria
  return <div>Contenido de inicio</div>;
}
```

## Consideraciones de Rendimiento

1. **Limpieza automática**: El hook `useSecondaryNav` limpia automáticamente la navegación al cambiar de página
2. **Renderizado condicional**: Los componentes de navegación solo se renderizan cuando es necesario
3. **Responsive**: Los estilos se aplican solo en los breakpoints necesarios

## Migración de Páginas Existentes

Para migrar páginas existentes:

1. **Identificar** si necesita navegación secundaria
2. **Crear** componente de navegación secundaria si es necesario
3. **Agregar** el hook `useSecondaryNav` en la página
4. **Configurar** la navegación en `useEffect`

## Troubleshooting

### Problemas Comunes

1. **Navegación no se limpia**: Verificar que se use `useEffect` con cleanup
2. **Estilos no se aplican**: Verificar clases de Tailwind y breakpoints
3. **Z-index conflicts**: Verificar que sidebar tenga `z-50` y top navbar `z-40`

### Debug

```tsx
// Para debuggear la navegación secundaria
const { secondaryNav } = useSecondaryNav();
console.log('Current secondary nav:', secondaryNav);
```
