/** Props de accesibilidad para vincular un control con su error. */
export function fieldA11y(
  id: string,
  error?: string,
): { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string } {
  return { id, 'aria-invalid': Boolean(error), 'aria-describedby': error ? `${id}-error` : undefined };
}
