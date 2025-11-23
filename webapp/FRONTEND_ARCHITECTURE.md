# Frontend Architecture - QASA Platform

## 🎯 Principios de Diseño

1. **Carga Rápida**: Code splitting, lazy loading, optimización de imágenes
2. **Renderizado Optimizado**: React Query cache, memoización, Suspense
3. **Componentes Atómicos**: Atomic Design (Atoms → Molecules → Organisms)
4. **Clean Architecture**: Separación clara de capas
5. **No Sobre-Ingeniería**: Simple pero escalable

---

## 📁 Estructura de Carpetas

```
src/
├── app/                          # Next.js App Router (páginas)
│   ├── audits/
│   │   ├── [id]/
│   │   │   ├── page.tsx         # Vista principal (tabla espacios)
│   │   │   ├── spaces/
│   │   │   │   └── [spaceId]/
│   │   │   │       └── page.tsx # Vista de espacio
│   │   │   └── elements/
│   │   │       └── [elementId]/
│   │   │           └── page.tsx # Vista de elemento
│   │   └── layout.tsx
│
├── components/                   # Componentes UI (Atomic Design)
│   ├── ui/                      # Atoms (Button, Input, Card, etc.)
│   ├── forms/                   # Molecules (FormField, QuestionForm, etc.)
│   ├── audit/                   # Organisms (AuditSpacesTable, QuestionCard, etc.)
│   └── layout/                  # Templates (Header, Sidebar, etc.)
│
├── lib/                         # Capa de infraestructura
│   ├── api/                     # API clients
│   │   ├── audit.api.ts         # Endpoints de auditorías
│   │   └── types.ts             # Tipos compartidos
│   ├── services/                # Lógica de negocio
│   │   └── audit.service.ts     # Servicios de auditoría
│   ├── hooks/                   # Custom hooks
│   │   └── audit/
│   │       ├── useAudit.ts      # Hook para obtener auditoría
│   │       ├── useAuditItems.ts # Hook para items
│   │       └── useAnswerQuestion.ts # Hook para responder
│   └── utils/                   # Utilidades
│       └── audit.utils.ts       # Cálculo de progreso, agrupación, etc.
│
├── store/                       # Estado global (Zustand)
│   └── audit.store.ts           # Estado de auditoría activa
│
└── types/                       # Tipos TypeScript
    └── audit.types.ts           # Tipos de dominio
```

---

## 🏗️ Clean Architecture - Capas

### 1. **Domain Layer** (`types/`)
- Tipos de dominio puros (sin dependencias de framework)
- Interfaces y tipos compartidos

### 2. **Application Layer** (`services/`, `hooks/`)
- Lógica de negocio
- Hooks que encapsulan lógica compleja
- Servicios que orquestan llamadas API

### 3. **Infrastructure Layer** (`lib/api/`)
- Clientes HTTP
- Adaptadores de API
- Manejo de errores

### 4. **Presentation Layer** (`components/`, `app/`)
- Componentes UI
- Páginas (Next.js)
- Hooks de presentación

---

## 🔄 Flujo de Datos

```
Page Component
    ↓
useAudit() hook (React Query)
    ↓
audit.service.ts (lógica de negocio)
    ↓
audit.api.ts (HTTP client)
    ↓
Backend API
```

---

## 📄 Estrategia: Páginas vs Estado

### ✅ **Usar Páginas (Next.js Routes)** para:
- **Vistas principales diferentes** (tabla espacios vs vista elemento)
- **URLs compartibles** (`/audits/123/spaces/5`)
- **Navegación del navegador** (back/forward)
- **Code splitting automático**

### ✅ **Usar Estado Local** para:
- **Modales y overlays**
- **Formularios temporales**
- **UI transitoria** (loading, errors)

### 🎯 **Decisión para Auditorías:**

```
/audits/[id]                    → Tabla de espacios (vista principal)
/audits/[id]/spaces/[spaceId]   → Vista de espacio (elementos)
/audits/[id]/elements/[elementId] → Vista de elemento (preguntas)
```

**Ventajas:**
- ✅ URLs compartibles
- ✅ Navegación natural (back button)
- ✅ Code splitting automático
- ✅ Estado limpio por página

---

## ⚡ Optimizaciones de Rendimiento

### 1. **React Query Cache**
```typescript
// Cache automático, refetch inteligente
const { data } = useQuery(['audit', id], () => getAudit(id), {
  staleTime: 5 * 60 * 1000, // 5 minutos
});
```

### 2. **Code Splitting**
```typescript
// Lazy load de componentes pesados
const QuestionForm = dynamic(() => import('@/components/audit/QuestionForm'));
```

### 3. **Memoización**
```typescript
// Evitar re-renders innecesarios
const spacesProgress = useMemo(() => 
  calculateSpacesProgress(items), 
  [items]
);
```

### 4. **Suspense Boundaries**
```typescript
// Loading states granulares
<Suspense fallback={<SpacesTableSkeleton />}>
  <SpacesTable />
</Suspense>
```

---

## 🧩 Componentes Atómicos

### Atoms (UI básicos)
- `Button`, `Input`, `Card`, `Badge`, `Progress`

### Molecules (Combinaciones simples)
- `FormField`, `QuestionCard`, `SpaceCard`, `ElementCard`

### Organisms (Componentes complejos)
- `AuditSpacesTable`, `QuestionForm`, `PhotoUploader`

### Templates (Layouts)
- `AuditLayout`, `SpaceLayout`

---

## 📊 Estado Global vs Local

### **Zustand (Global)** para:
- Auditoría activa actual
- Estado de navegación
- Preferencias de usuario

### **React Query (Server State)** para:
- Datos del servidor
- Cache automático
- Sincronización

### **useState (Local)** para:
- Estado de formularios
- UI temporal
- Componentes aislados

---

## 🚀 Implementación Paso a Paso

### Fase 1: Fundación
1. ✅ Crear tipos TypeScript (`types/audit.types.ts`)
2. ✅ Crear API client (`lib/api/audit.api.ts`)
3. ✅ Crear servicio (`lib/services/audit.service.ts`)
4. ✅ Crear hooks (`lib/hooks/audit/`)

### Fase 2: Componentes Base
5. ✅ Crear componentes atómicos (`components/ui/`)
6. ✅ Crear componentes de auditoría (`components/audit/`)

### Fase 3: Páginas
7. ✅ Vista principal (`app/audits/[id]/page.tsx`)
8. ✅ Vista de espacio (`app/audits/[id]/spaces/[spaceId]/page.tsx`)
9. ✅ Vista de elemento (`app/audits/[id]/elements/[elementId]/page.tsx`)

---

## 💡 Mejores Prácticas

1. **Siempre usar React Query** para datos del servidor
2. **Memoizar cálculos costosos** (progreso, agrupaciones)
3. **Lazy load** componentes pesados
4. **Error boundaries** para manejo de errores
5. **Loading states** granulares con Suspense
6. **Optimistic updates** para mejor UX
7. **TypeScript estricto** en todos lados

---

## 🎨 Ejemplo de Flujo Completo

```typescript
// 1. Page Component
export default function AuditPage({ params }: { params: { id: string } }) {
  const { data: audit, isLoading } = useAudit(params.id);
  
  if (isLoading) return <AuditSkeleton />;
  if (!audit) return <NotFound />;
  
  return <AuditSpacesTable audit={audit} />;
}

// 2. Hook (React Query)
export function useAudit(id: string) {
  return useQuery({
    queryKey: ['audit', id],
    queryFn: () => auditService.getAuditById(id),
  });
}

// 3. Service (Lógica de negocio)
export const auditService = {
  async getAuditById(id: string) {
    return auditApi.getAudit(id);
  },
};

// 4. API Client (HTTP)
export const auditApi = {
  async getAudit(id: string) {
    return api.get<Audit>(`/audits/${id}`);
  },
};
```

---

## ✅ Checklist de Implementación

- [ ] Tipos TypeScript definidos
- [ ] API client implementado
- [ ] Servicios creados
- [ ] Hooks con React Query
- [ ] Componentes atómicos
- [ ] Páginas optimizadas
- [ ] Error handling
- [ ] Loading states
- [ ] Optimistic updates
- [ ] Tests básicos

