## ¿Qué cambia?

<!-- Descripción breve del cambio y del motivo. Linkeá el issue/tarea si existe. -->

## Tipo de cambio

- [ ] feat — nueva funcionalidad
- [ ] fix — corrección de bug
- [ ] refactor — sin cambio de comportamiento
- [ ] test / docs / chore

## ¿Cómo se probó?

<!-- Pasos para probarlo a mano + tests agregados. -->

## Checklist

- [ ] Las reglas de negocio nuevas están en `src/domain/` y tienen tests unitarios.
- [ ] Ningún componente llama a `fetch` directo (feature `api/` → `hooks/`).
- [ ] Colores sólo desde tokens del tema; sin números mágicos (constantes en `src/config/`).
- [ ] Textos de UI en español (Argentina); botones con ícono tienen `aria-label`.
- [ ] `npm run lint`, `npm run typecheck`, `npm test` y `npm run build` pasan.
- [ ] Si cambió algún endpoint, se actualizó `docs/api-contract.md` **en ambos repos**.
- [ ] Capturas de pantalla (si cambia la UI).
