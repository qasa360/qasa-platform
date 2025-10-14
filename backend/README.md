# Qasa Backend

Base del backend de Qasa siguiendo principios de Clean Architecture con Express, TypeScript e Inversify.

## Requisitos

- Node.js 18.18 o superior
- npm 9 o superior

## Instalación

```bash
cd backend
npm install
```

## Scripts

- `npm run start:dev`: arranca el servidor en modo desarrollo con recarga.
- `npm run build`: transpila el proyecto a JavaScript (directorio `dist`).
- `npm start`: ejecuta el servidor usando la salida de `dist`.
- `npm run lint`: ejecuta ESLint sobre los archivos TypeScript.

## Arquitectura

- `src/config`: configuración de entorno y parámetros de la aplicación.
- `src/core`: elementos transversales (errores, logger, middlewares).
- `src/components`: módulos independientes. Cada componente encapsula su dominio, aplicación e infraestructura.
- `src/dependencies`: configuración del contenedor de Inversify y símbolos compartidos.
- `src/app.ts`: composición de middlewares y creación del servidor Express.
- `src/server.ts`: punto de entrada de la aplicación.

### Ejemplo de componente

El componente `health` expone el endpoint `/health` y muestra cómo:

- Definir contratos de dominio (`domain/`).
- Implementar servicios concretos (`infrastructure/`).
- Exponer controladores HTTP (`application/`).
- Registrar el módulo dentro del contenedor (`index.ts`).
