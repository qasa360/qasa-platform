# QASA Backend - API Reference

## Base URL

```
http://localhost:3000
```

**Note:** Controllers are registered directly without `/api` prefix. For example:
- `/audits` (not `/api/audits`)
- `/health` (not `/api/health`)

## Authentication

All endpoints require authentication via `ensureAuthenticated` middleware. Include the authentication token in the request headers.

---

## Audit Endpoints

### 1. Start Audit

**POST** `/audits`

Inicia una nueva auditoría para un apartamento.

**Request Body:**
```json
{
  "apartmentId": 1,
  "auditTemplateVersionId": 1  // Optional: uses default if not provided
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "apartmentId": 1,
  "auditTemplateVersionId": 1,
  "status": "IN_PROGRESS",
  "completionRate": 0,
  "createdAt": "2025-11-09T03:00:00.000Z",
  ...
}
```

---

### 2. Get Audit by ID

**GET** `/audits/:id`

Obtiene una auditoría completa por su ID.

**Response:** `200 OK`
```json
{
  "id": 1,
  "uuid": "...",
  "status": "IN_PROGRESS",
  "completionRate": 45.5,
  "items": [...],
  "incidences": [...],
  "photos": [...],
  ...
}
```

---

### 3. Get Audit by UUID

**GET** `/audits/uuid/:uuid`

Obtiene una auditoría completa por su UUID.

**Response:** `200 OK` (same format as Get Audit by ID)

---

### 4. Get Audit Items

**GET** `/audits/:id/items`

Obtiene todos los items (preguntas) de una auditoría.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "uuid": "...",
    "auditId": 1,
    "questionTemplateId": 5,
    "targetType": "ELEMENT",
    "spaceId": 2,
    "elementId": 10,
    "questionText": "¿El dispositivo funciona correctamente?",
    "answerType": "MULTIPLE_CHOICE",
    "category": "MAINTENANCE",
    "isMandatory": true,
    "isAnswered": false,
    "isVisible": true,
    "completionRate": 0,
    "parentAuditItemId": null,  // null for main questions, ID for follow-ups
    "followups": [...],  // Follow-up questions if any
    "answers": [...],
    "photos": [...],
    "incidences": [...],
    ...
  }
]
```

**Important:** Filter follow-up questions using `parentAuditItemId`:
```typescript
const mainQuestions = items.filter(item => !item.parentAuditItemId);
const followups = items.filter(item => item.parentAuditItemId === parentItemId);
```

---

### 5. Answer Question

**POST** `/audits/:id/answer`

Responde una pregunta de la auditoría. **Automatically generates follow-up questions** if the selected options trigger them.

**Request Body:**
```json
{
  "auditItemId": 1,
  "booleanValue": true,           // For BOOLEAN type
  "textValue": "Some text",       // For TEXT type
  "numberValue": 42.5,            // For NUMBER type
  "selectedOptionIds": [1, 3],    // For SINGLE_CHOICE or MULTIPLE_CHOICE
  "notes": "Additional notes",
  "photos": [                     // Optional: URLs (if uploaded separately)
    {
      "url": "https://...",
      "description": "Photo description"
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "auditItemId": 1,
  "booleanValue": true,
  "selectedOptions": [...],
  "photos": [...],
  "startedAt": "2025-11-09T03:00:00.000Z",
  "completedAt": "2025-11-09T03:00:15.000Z",
  ...
}
```

**Side Effects:**
- ✅ Updates `AuditItem.isAnswered = true`
- ✅ Updates `AuditItem.startedAt` and `completedAt`
- ✅ Updates audit `completionRate`
- ✅ **Automatically generates follow-up questions** (if selected options trigger them)
- ✅ **Automatically generates incidences** (if selected options trigger them)

---

### 6. Upload Photos

**POST** `/audits/:id/photos`

Sube fotos a Cloudflare R2 y las asocia con la auditoría.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `photos`: File[] (máximo 10 archivos, 10MB cada uno, solo imágenes)
- `context`: `"RESPONSE" | "ELEMENT" | "SPACE" | "INCIDENCE"` (required)
- `description`: string (optional)
- `spaceId`: number (optional)
- `elementId`: number (optional)
- `auditItemId`: number (optional)
- `auditResponseId`: number (optional)
- `auditIncidenceId`: number (optional)

**Response:** `201 Created`
```json
[
  {
    "id": 1,
    "uuid": "...",
    "url": "https://your-cdn.com/audits/1/1234567890-photo.jpg",
    "context": "RESPONSE",
    "description": "Photo description",
    "metadata": {
      "originalName": "IMG_001.jpg",
      "key": "audits/1/1234567890-photo.jpg"
    },
    ...
  }
]
```

**Example (JavaScript/TypeScript):**
```typescript
const formData = new FormData();
formData.append('photos', file1);
formData.append('photos', file2);
formData.append('context', 'RESPONSE');
formData.append('auditItemId', '1');

const response = await fetch('http://localhost:3000/audits/1/photos', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

---

### 7. Complete Audit

**PUT** `/audits/:id/complete`

Completa una auditoría. Valida que todas las preguntas obligatorias estén respondidas.

**Response:** `200 OK`
```json
{
  "id": 1,
  "status": "COMPLETED",
  "completionRate": 100,
  "completedAt": "2025-11-09T03:30:00.000Z",
  ...
}
```

**Validation:**
- ✅ Checks that all `isMandatory === true` questions are answered
- ✅ Changes status to `COMPLETED`
- ✅ Sets `completionRate` to 100%
- ✅ Records completion timestamp

**Errors:**
- `400 Bad Request`: If mandatory questions are unanswered
- `400 Bad Request`: If audit status is not `IN_PROGRESS`

---

## Follow-up Questions Flow

When a user answers a question with `selectedOptionIds`, the backend **automatically**:

1. Saves the response
2. Generates follow-up questions based on `AnswerOptionTemplateFollowup` rules
3. Creates new `AuditItem` records with `parentAuditItemId` pointing to the parent question
4. Returns the response (frontend should refresh items to see follow-ups)

**Frontend Implementation:**
```typescript
// After answering a question
const response = await api.post(`/audits/${auditId}/answer`, {
  auditItemId: 1,
  selectedOptionIds: [2]  // "NO" option
});

// Refresh audit items to get follow-ups
const items = await api.get(`/audits/${auditId}/items`);

// Filter follow-ups for the answered question
const followups = items.filter(item => 
  item.parentAuditItemId === 1 && !item.isAnswered
);

// Display follow-ups immediately
```

---

## Data Models

### AuditItem Structure

```typescript
{
  id: number;
  uuid: string;
  auditId: number;
  questionTemplateId: number;
  targetType: "APARTMENT" | "SPACE" | "ELEMENT";
  apartmentId?: number;
  spaceId?: number;
  elementId?: number;
  questionText: string;
  answerType: "BOOLEAN" | "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TEXT" | "NUMBER" | "PHOTO";
  category: "SAFETY" | "CLEANLINESS" | "MAINTENANCE" | "LEGAL" | "INVENTORY" | "CUSTOM";
  isMandatory: boolean;
  isAnswered: boolean;
  isVisible: boolean;
  completionRate: number;
  parentAuditItemId?: number;  // null for main questions, ID for follow-ups
  followups?: AuditItem[];     // Child follow-up questions
  answers?: AuditResponse[];
  photos?: AuditPhoto[];
  incidences?: AuditIncidence[];
  startedAt?: string;
  completedAt?: string;
}
```

### AuditResponse Structure

```typescript
{
  id: number;
  auditItemId: number;
  booleanValue?: boolean;
  textValue?: string;
  numberValue?: number;
  selectedOptions?: AuditResponseOption[];
  photos?: AuditPhoto[];
  notes?: string;
  startedAt?: string;
  completedAt?: string;
}
```

### AuditPhoto Structure

```typescript
{
  id: number;
  uuid: string;
  auditId: number;
  url: string;
  context: "AUDIT" | "SPACE" | "ELEMENT" | "QUESTION" | "RESPONSE" | "INCIDENCE";
  description?: string;
  metadata?: {
    originalName: string;
    key: string;
  };
  spaceId?: number;
  elementId?: number;
  auditItemId?: number;
  auditResponseId?: number;
  auditIncidenceId?: number;
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "name": "ErrorName",
  "message": "Human-readable error message",
  "httpCode": 400
}
```

**Common Error Codes:**
- `400 Bad Request`: Invalid input, missing required fields
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Notes for Frontend Development

1. **Follow-up Questions**: Always refresh audit items after answering to get newly generated follow-ups
2. **Photo Upload**: Use `multipart/form-data` for photo uploads, not JSON
3. **Completion Rate**: Updated automatically after each answer
4. **Incidences**: Generated automatically, no need to create them manually
5. **Transaction Safety**: All operations are transactional - if one fails, all rollback
6. **Status Flow**: `DRAFT` → `IN_PROGRESS` → `COMPLETED` (cannot go backwards)

---

## Example Frontend Flow

```typescript
// 1. Start audit
const audit = await api.post('/audits', {
  apartmentId: 1
});

// 2. Get all questions
const items = await api.get(`/audits/${audit.id}/items`);

// 3. Filter main questions (no parent)
const mainQuestions = items.filter(item => !item.parentAuditItemId);

// 4. Answer a question
const response = await api.post(`/audits/${audit.id}/answer`, {
  auditItemId: mainQuestions[0].id,
  selectedOptionIds: [2]  // "NO"
});

// 5. Refresh items to get follow-ups
const updatedItems = await api.get(`/audits/${audit.id}/items`);

// 6. Get follow-ups for the answered question
const followups = updatedItems.filter(item => 
  item.parentAuditItemId === mainQuestions[0].id
);

// 7. Upload photos (if needed)
const formData = new FormData();
formData.append('photos', photoFile);
formData.append('context', 'RESPONSE');
formData.append('auditItemId', mainQuestions[0].id.toString());

const photos = await fetch(`/api/audits/${audit.id}/photos`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
}).then(r => r.json());

// 8. Complete audit (when all questions answered)
const completedAudit = await api.put(`/audits/${audit.id}/complete`);
```

