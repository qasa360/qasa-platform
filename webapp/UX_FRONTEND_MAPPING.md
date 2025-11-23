# UX Frontend - Mapeo con Backend API

## 📋 Resumen de UX Descrita

### Flujo Principal
1. **Iniciar Auditoría** → Muestra tabla de espacios con progreso
2. **Tabla de Espacios** → Ordenados por flujo sugerido + progreso + tiempo
3. **Preguntas Generales Primero** → Primer item en la tabla
4. **Navegación Libre** → Usuario puede elegir por dónde empezar
5. **Click en Espacio** → Muestra elementos ordenados
6. **Click en Elemento** → Muestra primera pregunta sin responder automáticamente

---

## 🎯 Mapeo UX → Backend API

### 1. Iniciar Auditoría

**UX**: Usuario entra al piso, presiona "Iniciar Auditoría"

**Backend Endpoint**: ✅ `POST /audits`
```json
{
  "apartmentId": 1,
  "auditTemplateVersionId": 1  // Optional
}
```

**Response**: ✅ Retorna `Audit` con:
- `id`, `uuid`
- `status: "IN_PROGRESS"`
- `startedAt` (timestamp de inicio)
- `completionRate: 0`

**Frontend Action**:
```typescript
const audit = await api.post('/audits', { apartmentId: 1 });
// Guardar audit.id y audit.startedAt para el reloj
```

---

### 2. Tabla de Espacios con Progreso

**UX**: Mostrar tabla con:
- Todos los espacios ordenados por flujo sugerido
- Porcentaje de progreso de cada espacio
- Tiempo que empieza a correr (reloj global)
- Primer item: "Preguntas Generales"

**Backend Endpoints Necesarios**:

#### ✅ Endpoint Existente: `GET /audits/:id/items`
Retorna todos los `AuditItem` ordenados por `sortOrder`.

**Problema**: No agrupa por espacio ni calcula progreso por espacio.

#### 🔧 Endpoint Sugerido: `GET /audits/:id/spaces-summary`

**Response**:
```json
{
  "audit": {
    "id": 1,
    "status": "IN_PROGRESS",
    "startedAt": "2025-11-09T10:00:00Z",
    "completionRate": 45.5,
    "elapsedTime": 3600  // segundos desde startedAt
  },
  "generalQuestions": {
    "total": 5,
    "answered": 2,
    "completionRate": 40,
    "hasRequiredPhotos": false
  },
  "spaces": [
    {
      "spaceId": 1,
      "spaceName": "Living",
      "spaceTypeId": 1,
      "order": 1,  // Orden sugerido (de Space.order)
      "totalQuestions": 10,
      "answeredQuestions": 5,
      "completionRate": 50,
      "hasRequiredPhotos": true,
      "elements": [
        {
          "elementId": 1,
          "elementName": "Sofá",
          "completionRate": 100,
          "hasRequiredPhotos": true
        }
      ]
    }
  ]
}
```

**Implementación Backend**:
- Agrupar `AuditItem` por `spaceId`
- Calcular progreso: `(answered / total) * 100`
- Verificar fotos requeridas por espacio/elemento
- Ordenar espacios por `Space.order` (del apartamento)

---

### 3. Preguntas Generales Primero

**UX**: El primer item en la tabla debe ser "Preguntas Generales"

**Backend**: ✅ Ya soportado
- `AuditItem` con `targetType === "APARTMENT"` y `spaceId === null`
- Ordenar con `sortOrder` (las generales pueden tener `sortOrder: 0` o menor)

**Frontend Logic**:
```typescript
const items = await api.get(`/audits/${auditId}/items`);

// Separar preguntas generales
const generalQuestions = items.filter(
  item => item.targetType === 'APARTMENT' && !item.spaceId
);

// Ordenar por sortOrder
generalQuestions.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
```

---

### 4. Tiempo de Ejecución

**UX**: Mostrar reloj global desde el inicio

**Backend**: ✅ Ya soportado
- `Audit.startedAt` se establece cuando cambia a `IN_PROGRESS`
- Calcular `elapsedTime = Date.now() - audit.startedAt`

**Frontend**:
```typescript
const audit = await api.get(`/audits/${auditId}`);

// Calcular tiempo transcurrido
const elapsedSeconds = Math.floor(
  (Date.now() - new Date(audit.startedAt).getTime()) / 1000
);

// Mostrar en formato HH:MM:SS
const hours = Math.floor(elapsedSeconds / 3600);
const minutes = Math.floor((elapsedSeconds % 3600) / 60);
const seconds = elapsedSeconds % 60;
```

---

### 5. Click en Espacio → Mostrar Elementos

**UX**: Al hacer click en un espacio, mostrar todos sus elementos ordenados

**Backend Endpoint Sugerido**: `GET /audits/:id/spaces/:spaceId/elements-summary`

**Response**:
```json
{
  "space": {
    "id": 1,
    "name": "Living",
    "order": 1,
    "totalQuestions": 10,
    "answeredQuestions": 5,
    "completionRate": 50
  },
  "spaceQuestions": [
    {
      "id": 10,
      "questionText": "¿El espacio está limpio?",
      "isAnswered": true,
      "sortOrder": 1
    }
  ],
  "elements": [
    {
      "elementId": 1,
      "elementName": "Sofá",
      "elementTypeId": 1,
      "totalQuestions": 3,
      "answeredQuestions": 3,
      "completionRate": 100,
      "hasRequiredPhotos": true,
      "nextUnansweredQuestionId": null  // null si está completo
    },
    {
      "elementId": 2,
      "elementName": "Mesa",
      "totalQuestions": 2,
      "answeredQuestions": 0,
      "completionRate": 0,
      "hasRequiredPhotos": false,
      "nextUnansweredQuestionId": 15  // ID de la primera pregunta sin responder
    }
  ]
}
```

**Implementación Backend**:
- Filtrar `AuditItem` por `spaceId`
- Separar preguntas de espacio (`targetType === "SPACE"`) vs elementos (`targetType === "ELEMENT"`)
- Agrupar por `elementId` y calcular progreso
- Ordenar elementos (puede usar `sortOrder` de las preguntas o orden natural)

---

### 6. Click en Elemento → Primera Pregunta Sin Responder

**UX**: Al elegir un elemento, automáticamente mostrar la primera pregunta sin responder

**Backend Endpoint Sugerido**: `GET /audits/:id/elements/:elementId/next-question`

**Response**:
```json
{
  "element": {
    "id": 2,
    "name": "Mesa",
    "completionRate": 0
  },
  "question": {
    "id": 15,
    "questionText": "¿El dispositivo funciona correctamente?",
    "answerType": "MULTIPLE_CHOICE",
    "isMandatory": true,
    "options": [...],
    "sortOrder": 1
  }
}
```

**Alternativa**: Usar `GET /audits/:id/items` y filtrar en frontend:
```typescript
const items = await api.get(`/audits/${auditId}/items`);

// Filtrar preguntas del elemento, ordenadas, sin responder
const elementQuestions = items
  .filter(item => item.elementId === elementId && !item.isAnswered)
  .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

const nextQuestion = elementQuestions[0];
```

---

### 7. Progreso Visual

**UX**: Mostrar % completado por espacio/elemento

**Backend**: ✅ Ya calculado en `AuditItem.completionRate` y `Audit.completionRate`

**Frontend**: Calcular desde items:
```typescript
function calculateSpaceProgress(spaceId: number, items: AuditItem[]) {
  const spaceItems = items.filter(item => item.spaceId === spaceId);
  const answered = spaceItems.filter(item => item.isAnswered).length;
  const total = spaceItems.length;
  return total > 0 ? (answered / total) * 100 : 0;
}
```

---

### 8. Validación de Fotos Obligatorias

**UX**: Modal "📷 Antes de continuar, subí al menos una foto"

**Backend**: ✅ Endpoint existe: `POST /audits/:id/photos`

**Verificación**: Usar `GET /audits/:id/items` y verificar `item.photos.length > 0`:
```typescript
const items = await api.get(`/audits/${auditId}/items`);

// Verificar si elemento tiene fotos
const elementItems = items.filter(item => item.elementId === elementId);
const hasPhotos = elementItems.some(item => item.photos && item.photos.length > 0);

if (!hasPhotos) {
  // Mostrar modal de foto obligatoria
}
```

---

### 9. Follow-ups Dinámicos

**UX**: Mostrar follow-ups inmediatamente después de responder

**Backend**: ✅ Ya implementado
- Al responder con `selectedOptionIds`, se generan automáticamente
- `AuditItem.parentAuditItemId` apunta al item padre

**Frontend**:
```typescript
// Después de responder
const response = await api.post(`/audits/${auditId}/answer`, {
  auditItemId: 10,
  selectedOptionIds: [2]  // "NO"
});

// Refrescar items para obtener follow-ups
const updatedItems = await api.get(`/audits/${auditId}/items`);

// Filtrar follow-ups del item respondido
const followups = updatedItems.filter(
  item => item.parentAuditItemId === 10 && !item.isAnswered
);

// Mostrar follow-ups inmediatamente debajo de la pregunta padre
```

---

## 🎨 Estructura de Datos para Frontend

### Vista Principal (Tabla de Espacios)

```typescript
interface AuditSpacesView {
  audit: {
    id: number;
    status: 'IN_PROGRESS' | 'COMPLETED';
    startedAt: string;
    completionRate: number;
    elapsedTime: number;  // segundos
  };
  generalQuestions: {
    total: number;
    answered: number;
    completionRate: number;
    hasRequiredPhotos: boolean;
  };
  spaces: Array<{
    spaceId: number;
    spaceName: string;
    order: number | null;
    totalQuestions: number;
    answeredQuestions: number;
    completionRate: number;
    hasRequiredPhotos: boolean;
    status: 'pending' | 'in_progress' | 'completed';
  }>;
}
```

### Vista de Espacio

```typescript
interface SpaceDetailView {
  space: {
    id: number;
    name: string;
    completionRate: number;
  };
  spaceQuestions: AuditItem[];  // Preguntas del espacio (targetType === 'SPACE')
  elements: Array<{
    elementId: number;
    elementName: string;
    completionRate: number;
    hasRequiredPhotos: boolean;
    nextUnansweredQuestionId: number | null;
  }>;
}
```

### Vista de Elemento

```typescript
interface ElementDetailView {
  element: {
    id: number;
    name: string;
    completionRate: number;
  };
  questions: AuditItem[];  // Todas las preguntas del elemento
  currentQuestion: AuditItem | null;  // Primera sin responder
  photos: AuditPhoto[];
  incidences: AuditIncidence[];
}
```

---

## 🔧 Endpoints Adicionales Recomendados

### 1. `GET /audits/:id/spaces-summary`
**Propósito**: Obtener resumen de espacios con progreso
**Prioridad**: 🔴 Alta (optimiza carga inicial)

### 2. `GET /audits/:id/spaces/:spaceId/elements-summary`
**Propósito**: Obtener elementos de un espacio con progreso
**Prioridad**: 🟡 Media (puede calcularse en frontend)

### 3. `GET /audits/:id/next-question?spaceId=1&elementId=2`
**Propósito**: Obtener siguiente pregunta sin responder
**Prioridad**: 🟢 Baja (puede calcularse en frontend)

---

## ✅ Endpoints Existentes que Soportan la UX

| UX Requerimiento | Endpoint Existente | Estado |
|-----------------|-------------------|--------|
| Iniciar auditoría | `POST /audits` | ✅ Completo |
| Obtener auditoría | `GET /audits/:id` | ✅ Completo |
| Obtener items | `GET /audits/:id/items` | ✅ Completo |
| Responder pregunta | `POST /audits/:id/answer` | ✅ Completo |
| Subir fotos | `POST /audits/:id/photos` | ✅ Completo |
| Completar auditoría | `PUT /audits/:id/complete` | ✅ Completo |
| Follow-ups automáticos | (incluido en answer) | ✅ Completo |

---

## 🚀 Recomendación de Implementación

### Fase 1: MVP (Sin endpoints adicionales)
1. Usar `GET /audits/:id/items` para obtener todos los items
2. Calcular progreso por espacio/elemento en frontend
3. Filtrar y ordenar en frontend
4. **Ventaja**: Rápido, sin cambios en backend
5. **Desventaja**: Carga todos los items siempre

### Fase 2: Optimización (Con endpoints adicionales)
1. Implementar `GET /audits/:id/spaces-summary`
2. Cargar detalles de espacio solo al hacer click
3. **Ventaja**: Carga inicial más rápida
4. **Desventaja**: Requiere cambios en backend

---

## 📝 Notas para Frontend

1. **Ordenamiento**:
   - Preguntas generales: `targetType === 'APARTMENT' && !spaceId`
   - Espacios: Ordenar por `Space.order` (del apartamento)
   - Elementos: Ordenar por `sortOrder` de las preguntas
   - Preguntas: Ordenar por `sortOrder`

2. **Progreso**:
   - Calcular desde `AuditItem.isAnswered`
   - Verificar fotos desde `AuditItem.photos.length > 0`

3. **Tiempo**:
   - Usar `Audit.startedAt` para reloj global
   - Calcular en frontend (no necesita endpoint adicional)

4. **Follow-ups**:
   - Filtrar por `parentAuditItemId`
   - Mostrar inmediatamente después de responder

5. **Navegación Libre**:
   - Permitir click en cualquier espacio/elemento
   - Mostrar siempre la primera pregunta sin responder del elemento seleccionado

