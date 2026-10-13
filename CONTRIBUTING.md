# Cómo contribuir

1. **Rama**: partí de `main` actualizada y creá `feature/<descripcion-corta>` (o `fix/…`, `chore/…`).
2. **Commits**: usamos [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/)
   (`feat(agenda): …`, `fix(senas): …`, `test(domain): …`).
3. **Antes de abrir el PR** corré localmente:
   ```bash
   npm run format && npm run lint && npm run typecheck && npm test && npm run build
   ```
4. **PR**: completá la plantilla, pedí al menos una revisión y esperá a que la CI esté en verde.
   `main` está protegida: no se pushea directo.
5. **Contrato de API**: el front no inventa endpoints ni campos. Si hace falta algo nuevo, se acuerda con
   backend y se actualiza `docs/api-contract.md` en ambos repos en el mismo PR.
6. **Reglas de arquitectura** (ver README): negocio en `src/domain/` (TS puro + tests), llamadas HTTP sólo
   en `features/*/api`, estado de servidor sólo con hooks de TanStack Query, páginas delgadas, componentes
   chicos y accesibles, colores sólo desde los tokens del tema.
