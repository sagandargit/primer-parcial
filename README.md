# Gestor de Tareas – Refactorizaciones

Este proyecto implementa un pequeño gestor de tareas con calendario. En esta rama se realizaron varias mejoras aplicando principios SOLID:

## Cambios principales
- **Parser JSON nativo:** se reemplazó `body-parser` por `express.json` para manejar el cuerpo de las peticiones HTTP.
- **Configuración aislada:** el puerto del servidor se mueve a `src/config/index.js`, permitiendo modificarlo desde un solo lugar.
- **Manejo centralizado de errores:** se añadió el middleware `src/middleware/errorHandler.js` que unifica las respuestas ante fallos.
- **Arquitectura en capas para tareas:**
  - `src/services/taskRepository.js` gestiona el almacenamiento en memoria.
  - `src/controllers/taskController.js` contiene la lógica de negocio.
  - `src/routes/taskRoutes.js` expone las rutas REST bajo `/api/tasks`.
- **Estilos desacoplados:** se creó la clase CSS `.back-button` en `public/styles.css` y el botón correspondiente en `public/app.js` para evitar manipular estilos en línea.
- **Limpieza de dependencias:** se eliminó la dependencia innecesaria de `body-parser` en `package.json`.

## Ejecución
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar el servidor:
   ```bash
   npm start
   ```

El servidor quedará disponible en `http://localhost:3000` (o el puerto definido en la variable de entorno `PORT`).

## Autor
Refactorizaciones realizadas como parte de un ejercicio de aplicación de principios SOLID.
