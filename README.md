# Melina Cannata — Salud & Estética Integral · Frontend

Aplicación web del sistema de turnos del centro: catálogo público, reserva con seña (invitados y clientes
registrados), recomendador de servicios (Laya), portal del cliente y panel interno para profesionales y
administración (agenda, control de señas, disponibilidad, seguimiento, catálogo, dashboard e informes).

El backend (NestJS) vive en otro repositorio. **La única fuente de verdad entre ambos es
[`docs/api-contract.md`](docs/api-contract.md)**: el front no inventa endpoints ni campos fuera de ese contrato.
Los diseños de referencia del panel están en [`docs/prototipos/`](docs/prototipos).

---

## Stack

| Tema               | Elección                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------- |
| UI                 | React 19 + TypeScript (modo estricto)                                                        |
| Build / dev server | Vite 7                                                                                       |
| Ruteo              | React Router 7 (modo librería, `createBrowserRouter`, rutas lazy por feature)                |
| Estilos            | Tailwind CSS v4 (`@tailwindcss/vite`), tokens de diseño en `@theme` (`src/styles/index.css`) |
| Estado de servidor | TanStack Query v5                                                                            |
| Formularios        | React Hook Form + Zod (`@hookform/resolvers`)                                                |
| Íconos             | lucide-react                                                                                 |
| Calendario semanal | FullCalendar 6 (`timeGridWeek`, plugins gratuitos)                                           |
| Tests              | Vitest + Testing Library + user-event + jsdom                                                |
| Calidad            | ESLint (flat config, typescript-eslint, react-hooks, react-refresh) + Prettier               |

## Requisitos

- Node.js **20 o superior** (recomendado 22, ver `.nvmrc`).
- npm 10+.
- El backend corriendo (por defecto en `http://localhost:3000/api/v1`) con CORS habilitado para
  `http://localhost:5173` y `credentials: true` (la sesión es una cookie HttpOnly).

## Puesta en marcha

```bash
cp .env.example .env      # configurá VITE_API_URL si tu backend no está en localhost:3000
npm install
npm run dev               # http://localhost:5173
```

`VITE_API_URL` se valida con Zod al iniciar (`src/config/env.ts`): si falta o no es una URL, la app falla
rápido con un mensaje claro.

## Scripts

| Script                            | Qué hace                                                             |
| --------------------------------- | -------------------------------------------------------------------- |
| `npm run dev`                     | Servidor de desarrollo con HMR.                                      |
| `npm run build`                   | Typecheck (`tsc -b`) + build de producción en `dist/`.               |
| `npm run preview`                 | Sirve el build localmente.                                           |
| `npm run typecheck`               | Chequeo de tipos sin emitir.                                         |
| `npm run lint`                    | ESLint sin tolerar warnings (`--max-warnings=0`).                    |
| `npm run format` / `format:check` | Prettier (escribe / verifica).                                       |
| `npm test`                        | Tests una vez (`vitest run`).                                        |
| `npm run test:watch`              | Tests en modo watch.                                                 |
| `npm run test:coverage`           | Tests + cobertura de `domain/` y `shared/api/` (umbral 90 % líneas). |

### Docker

```bash
docker build --build-arg VITE_API_URL=https://api.ejemplo.com/api/v1 -t estetica-frontend .
docker run -p 8080:80 estetica-frontend
```

Build multi-stage: Node compila y nginx sirve los estáticos con fallback de SPA (`nginx.conf`).

---

## Rutas

### Públicas (layout con header: Servicios · Recomendame · Ingresar/Mi cuenta/Panel)

| Ruta                               | Pantalla                                                                                                                                                                                |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                | Catálogo de servicios con filtro por categoría y búsqueda (sin login).                                                                                                                  |
| `/servicios/:serviceId`            | Detalle del servicio y profesionales.                                                                                                                                                   |
| `/tratamientos/:treatmentId`       | Detalle de un tratamiento + "Quiero seguir este tratamiento".                                                                                                                           |
| `/reservar`                        | Wizard de reserva: servicio → profesional (o "Sin preferencia") → fecha y horario → datos y confirmación. Acepta `?serviceId`, `providerId`, `treatmentId`, `step`, `recommendationId`. |
| `/recomendame`                     | Recomendador Laya (también para invitados).                                                                                                                                             |
| `/turno/:token`                    | Enlace privado del invitado: estado, transferencia, comprobante, cancelación.                                                                                                           |
| `/ingresar`, `/registro`           | Login y registro (aviso de reservas vinculadas por DNI).                                                                                                                                |
| `/mi-cuenta`                       | (CLIENT) Mis turnos: activos + historial, "Repetir turno".                                                                                                                              |
| `/mi-cuenta/turnos/:appointmentId` | (CLIENT) Seguimiento del turno, comprobante y cancelación.                                                                                                                              |
| `/mi-cuenta/recomendaciones`       | (CLIENT) Mis recomendaciones (sólo lectura).                                                                                                                                            |

### Panel interno (`/panel`, PROVIDER o ADMIN — layout del prototipo)

| Ruta                                             | Rol   | Pantalla                                                                                                       |
| ------------------------------------------------ | ----- | -------------------------------------------------------------------------------------------------------------- |
| `/panel/agenda`                                  | Staff | Agenda Diaria por columnas de profesional (grilla CSS propia), resumen y "Validar Señas". `?fecha=YYYY-MM-DD`. |
| `/panel/mi-agenda`                               | Staff | Agenda semanal con FullCalendar `timeGridWeek`.                                                                |
| `/panel/nueva-reserva`                           | Staff | Nueva Reserva en 3 pasos + mensaje para WhatsApp.                                                              |
| `/panel/senas`                                   | Staff | Control/Verificación de Señas (bandeja, detalle, visor PDF, aprobar/rechazar).                                 |
| `/panel/disponibilidad`                          | Staff | Matriz semanal de 30 min, servicios asignados, datos de seña y excepciones. ADMIN: `?providerId=`.             |
| `/panel/turnos`                                  | Staff | Buscador de turnos (destino del buscador de la topbar).                                                        |
| `/panel/turnos/:appointmentId`                   | Staff | Seguimiento: detalle, transferencia, comprobante, Estado en Vivo; cancelar, reprogramar, finalizar.            |
| `/panel/dashboard`                               | ADMIN | Indicadores (`GET /admin/dashboard`) con "Actualizar datos".                                                   |
| `/panel/servicios`, `/nuevo`, `/:serviceId`      | ADMIN | ABM de servicios (categorías M:N, profesionales, prep/limpieza, tags, fechas específicas).                     |
| `/panel/categorias`                              | ADMIN | Categorías: alta, renombrar, activar/desactivar, eliminar (con aviso de que los servicios no se borran).       |
| `/panel/tratamientos`, `/nuevo`, `/:treatmentId` | ADMIN | Tratamientos con servicios ordenados.                                                                          |
| `/panel/prestadores`, `/nuevo`, `/:providerId`   | ADMIN | Alta (rol PROVIDER) y edición de profesionales.                                                                |
| `/panel/clientes`, `/:clientId`                  | ADMIN | Búsqueda de pacientes y ficha con historial.                                                                   |
| `/panel/informes`                                | ADMIN | Informes por tipo y rango + "Exportar PDF".                                                                    |

El menú lateral se arma según el rol (`src/app/navigation.ts`): ADMIN ve todo; PROVIDER sólo la sección
"Gestión clínica". No existe UI para crear administradores.

---

## Arquitectura

```
src/
  app/            Composición: App, router (rutas lazy), providers, guards (RequireAuth/RequireRole),
                  navegación por rol y "shells" que conectan los layouts con la sesión.
  config/         env.ts (VITE_API_URL validado con Zod) y constants.ts (reglas y parámetros: HOLD_MINUTES,
                  CANCELLATION_REFUND_HOURS, MAX_RECEIPT_MB, BUSINESS_TIMEZONE, SLOT_GRID_MINUTES…).
  domain/         TypeScript PURO: tipos del contrato y reglas de negocio (sin React, sin fetch).
  shared/
    api/          http-client (fetch + cookies + ApiError), query-keys.
    ui/           Componentes presentacionales reutilizables y accesibles.
    layouts/      StaffLayout (sidebar + topbar del prototipo) y PublicLayout.
    hooks/        useCopyToClipboard, useNow, useDebouncedValue, useObjectUrl, useDateParam.
    lib/          Utilidades de UI (cn, mapeo de tonos a clases, esquemas Zod compartidos, descargas).
  features/<feature>/
    api/          Una función por endpoint (única capa que habla con el http-client).
    hooks/        Casos de uso con TanStack Query (queries, mutations, invalidaciones).
    components/   Componentes de la feature (presentacionales, reciben props).
    pages/        Contenedores delgados: componen hooks + componentes.
    index.ts      Barrel: lo único que otras partes de la app pueden importar.
```

Features: `auth`, `catalog`, `booking`, `guest-access`, `client-portal`, `recommendations`, `agenda`,
`deposits`, `availability`, `appointment-tracking`, `admin-dashboard`, `admin-catalog`,
`admin-providers`, `admin-clients`, `reports`.

### ¿Por qué `domain/` está separado?

Las reglas del negocio (política de cancelación de 24 h, seña del 50 %, bloqueo de 5 minutos, paso del
tracker según el estado, conversión matriz de 30 min ⇄ rangos, armado del mensaje de WhatsApp, formateo de
pesos y fechas en la zona horaria de Buenos Aires…) son lo más valioso y lo que más cambia por pedido del
negocio. Al mantenerlas en TypeScript puro:

- se testean con tests unitarios rápidos y exhaustivos, sin montar componentes ni mockear la red;
- las pantallas no duplican lógica ni toman decisiones (sólo muestran lo que el dominio calcula);
- un cambio de regla se hace en un único lugar;
- son independientes del framework (ESLint prohíbe importar React o infraestructura desde `domain/`).

El backend sigue siendo la fuente de verdad final (por ejemplo, la cancelación devuelve el `depositOutcome`
real); el dominio del front sirve para anticipar y explicar la regla al usuario.

### Flujo de datos

```
Página ──usa──▶ hooks de la feature (TanStack Query) ──llaman──▶ api de la feature ──▶ shared/api/http-client ──▶ backend
   │                                                                                        (cookie HttpOnly)
   └──pasa props──▶ componentes presentacionales ──usan──▶ domain/ (reglas puras) + shared/ui
```

- **Sesión**: cookie HttpOnly; el `AuthProvider` consulta `GET /auth/me`. Nunca se guarda un token en el
  navegador ni se usa `localStorage`.
- **Errores**: el http-client desenvuelve `{ data, meta }` y convierte `{ error: { code, message } }` en
  `ApiError`; las pantallas muestran `message` (pensado para el usuario). Los 4xx no se reintentan.
- **Comprobantes PDF**: se descargan con credenciales como `Blob` y se muestran con una blob URL en un modal
  (`PdfViewerModal`), revocada al cerrar.

## Convenciones (Clean Code y SOLID aplicados al front)

- **SRP**: cada componente hace una cosa (p. ej. `ReceiptUpload` sólo valida y envía un archivo;
  `ReceiptSection` decide _qué_ mostrar según el estado). Componentes de menos de ~200 líneas.
- **OCP**: los estados del turno se agregan en un único mapa (`APPOINTMENT_STATUS_META`) y toda la UI
  (badges, tarjetas, tracker) se adapta sin tocar componentes.
- **LSP / composición**: `AppointmentTrackingView` es la misma vista para staff, cliente e invitado; cada
  página le inyecta las acciones permitidas para su rol.
- **ISP**: los componentes reciben sólo las props que usan (p. ej. `Pick<Appointment, …>` en el dominio).
- **DIP**: las páginas dependen de hooks, no de URLs ni de `fetch`. `createHttpClient({ baseUrl, fetchFn })`
  permite inyectar otro `fetch` en tests; `ProviderScope` abstrae `/staff/me` vs `/admin/providers/:id`.
- Sin números mágicos (todo en `src/config/constants.ts`), sin `window.confirm` (usamos `Modal`/`ConfirmModal`),
  sin `key={index}`, colores sólo desde tokens del tema (`bg-primary`, `text-ink-soft`, …; nada de `bg-[#…]`).
- Accesibilidad: labels asociados (`htmlFor`), `aria-invalid`/`aria-describedby` en errores, botones con
  ícono con `aria-label` obligatorio (`IconButton`), modales con foco atrapado y cierre con Esc.
- Identificadores en inglés; textos de UI, comentarios y documentación en español (Argentina).
- Alias `@/` → `src/`.

## Cómo agregar una feature nueva (paso a paso)

Ejemplo: "Lista de espera".

1. **Contrato**: acordá el endpoint con backend y agregalo a `docs/api-contract.md` (en ambos repos).
2. **Tipos**: sumá los tipos nuevos a `src/domain/types.ts`.
3. **Reglas**: si hay lógica (prioridades, vencimientos…), creá `src/domain/waitlist.ts` con funciones puras
   y su `waitlist.test.ts`. Exportalo en `src/domain/index.ts`.
4. **API**: `src/features/waitlist/api/waitlist-api.ts` con una función por endpoint usando `httpClient`.
5. **Query keys**: agregá las claves en `src/shared/api/query-keys.ts`.
6. **Hooks**: `src/features/waitlist/hooks/useWaitlist.ts` con `useQuery`/`useMutation` y sus invalidaciones.
7. **Componentes**: presentacionales en `components/`, reutilizando `shared/ui` (con tests si tienen lógica de UI).
8. **Página**: `pages/WaitlistPage.tsx` delgada (hooks + componentes, sin reglas de negocio).
9. **Barrel**: exportá lo público en `src/features/waitlist/index.ts`.
10. **Ruta y menú**: agregá la ruta lazy en `src/app/router.tsx` y, si corresponde, el ítem en
    `src/app/navigation.ts` con los roles que la ven.
11. Corré `npm run lint && npm run typecheck && npm test && npm run build`.

## Testing

- **Unitarios de dominio** (`src/domain/*.test.ts`): cobertura alta, incluidos bordes (cancelación con 24 h
  exactas, matriz con rangos partidos 08:00–13:00 y 14:00–21:00, tracker por estado, countdown, WhatsApp,
  validación de comprobante, dinero y fechas en zona del negocio).
- **http-client** (`src/shared/api/http-client.test.ts`): desenvuelve `data/meta`, FormData, blobs, 204 y
  mapeo de errores a `ApiError`.
- **Componentes** con Testing Library: `StatusBadge`, `Modal`, `CancelAppointmentModal` (aviso de política
  antes de confirmar y motivo obligatorio para staff), `ReceiptUpload` (rechaza no-PDF y > 5 MB),
  `SlotPicker` ("Turno continuo sin demoras" / "Recomendado"), `LoginForm` (validación Zod).
- **Smoke de integración** (`src/app/router.test.tsx`): rutas lazy, guards por rol y agenda diaria con
  `fetch` simulado.

## Flujo Git sugerido

- `main` protegida: sólo se integra por Pull Request con al menos una revisión y la CI en verde.
- Ramas cortas: `feature/<tema>`, `fix/<tema>`, `chore/<tema>`.
- Commits con [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/):
  `feat(senas): visor de comprobante`, `fix(agenda): línea de hora actual`, `test(domain): …`.
- La CI (`.github/workflows/ci.yml`) corre formato, lint, typecheck, tests con cobertura y build en cada push
  a `main` y en cada PR. Ver también `CONTRIBUTING.md` y la plantilla de PR.

---

## Supuestos y decisiones respecto del contrato

Puntos donde el prototipo o las reglas piden algo que el contrato no define. No se modificó el contrato;
conviene acordarlos con backend:

1. **"TURNOS HOY x / y cupos"**: el resumen de `/agenda/day` no trae "cupos"; se muestra
   `x turnos / N % ocupación` (`bookedMinutes / capacityMinutes`).
2. **Detalle de prestador/tratamiento**: el backend expone `GET /admin/providers/:id` y `GET /admin/treatments/:id`, pero hoy el detalle se toma del listado (mejora pendiente: usar los endpoints de detalle).
3. **"Pedir Reenvío"** (Control de Señas) no está en las reglas: se muestra deshabilitado con el tooltip
   "Pendiente de definir con el negocio". Tampoco hay flujo para re-subir un comprobante rechazado
   (el turno pasa a `EXPIRED` según el contrato).
4. **Datos del comprobante** (banco de origen, n.º de transacción, "OCR verificado") no existen en `Deposit`:
   se muestran cuenta destino, fecha de recepción y monto esperado.
5. **Sede/dirección, "10 minutos de tolerancia", teléfono de secretaría, "Sede Central / Caja abierta"** no
   están en el contrato: se omitieron.
6. **Campanita de notificaciones**: no hay endpoint; marca un punto si hay señas pendientes y lleva a
   Control de Señas.
7. **Vista "Mes"** de la agenda: no implementada (Día con grilla propia y Semana con FullCalendar).
8. **Filtro por categoría en la agenda**: `Appointment.service` no trae categorías; se resuelve consultando
   `/catalog/services?categoryId=` (sólo servicios activos) y filtrando por `service.id`.
9. **"Almuerzo fijo"** no existe en el modelo: la agenda muestra una banda "Pausa" donde ningún profesional
   trabaja; en la matriz de disponibilidad el almuerzo es simplemente un hueco entre rangos.
10. **Buscador de la topbar**: usa `GET /appointments?search=` (sirve para PROVIDER y ADMIN, porque
    `/admin/clients` es sólo ADMIN). Asume que el backend busca por nombre y teléfono. Ese endpoint exige
    `from`/`to`: se usa una ventana por defecto de −30/+60 días, editable.
11. **Nueva Reserva para PROVIDER sin rol ADMIN**: no puede buscar pacientes (endpoint ADMIN), carga los datos
    a mano y reserva siempre en su propia agenda (`providerId` propio).
12. **Reprogramar con "cualquier profesional"**: se envía el primer `provider` del slot elegido.
13. **`Recommendation.confidence`**: se asume 0..1 (si llegara 0..100 también se interpreta bien).
14. **Informes JSON** sin esquema: se renderizan genéricamente (resumen clave/valor + tablas).
15. **Query `from`/`to` de excepciones** sin formato definido: se envía `YYYY-MM-DD`.
16. **Zona horaria en FullCalendar**: sin plugin de zonas, los eventos se pasan con la hora de pared de
    Buenos Aires y `timeZone: 'local'`; si el navegador está en otra zona, sólo el indicador de "ahora" de la
    vista semanal queda desfasado (la Agenda Diaria propia sí usa la zona del negocio).
17. **Seguimiento de tratamientos**: el paso actual viaja en la URL (`treatmentId` + `step`); cada reserva
    envía el `recommendationId`. No hay endpoint para persistir el avance del tratamiento.
18. **Vencimiento del bloqueo**: el front deja de permitir subir el comprobante al llegar `holdExpiresAt` y
    refresca el turno; se asume que el backend lo pasa a `EXPIRED` (y responde `HOLD_EXPIRED` si llega tarde).
19. **"Última validada"** en Control de Señas se muestra sólo para validaciones hechas en la sesión actual.
20. **Confirmación de contraseña** en el registro es sólo del lado del cliente (no viaja al backend).
