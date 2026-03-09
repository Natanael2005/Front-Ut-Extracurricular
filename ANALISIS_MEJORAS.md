# Oportunidades de mejora detectadas

1. **Configurar ESLint para que el script `npm run lint` funcione.**
   - Actualmente el proyecto ejecuta `eslint .` pero no incluye `eslint.config.js|mjs|cjs`, por lo que el chequeo falla.

2. **Mover el manejo de sesión fuera de `localStorage` para reducir riesgos de seguridad.**
   - Hoy el token se guarda en `localStorage`; sería mejor migrar a cookies `httpOnly` + `secure` y rotación/expiración en backend.

3. **Fortalecer el cliente API (`fetch`) con timeout, cancelación, y mejor manejo de errores de red.**
   - Las llamadas no usan `AbortController`, reintentos, ni distinguen de forma explícita fallos de conexión.

4. **Eliminar duplicación de hooks utilitarios.**
   - Existen dos versiones idénticas de `use-toast` y dos de `use-mobile`.

5. **Corregir la dependencia del `useEffect` en `useToast`.**
   - El efecto depende de `state`, lo que re-suscribe listeners de forma innecesaria; idealmente debe suscribirse una vez.

6. **Estandarizar navegación interna con `next/link`.**
   - En el `Navbar` se usan múltiples `<a href="/...">` para rutas internas, generando navegación completa en lugar de client-side routing.

7. **Conectar el chat a backend real y limpiar side effects en desmontaje.**
   - El chat simula respuestas con `setTimeout`; conviene integrar API real, persistencia de historial y limpiar timeout en `useEffect` cleanup.

8. **Limpiar código/comentarios muertos y mejorar mantenibilidad.**
   - En la landing hay import/render del widget comentado, lo cual agrega ruido y confusión en la intención del feature.
