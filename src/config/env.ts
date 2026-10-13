import { z } from 'zod';

/**
 * Variables de entorno validadas al iniciar la app.
 * Si falta alguna, la app falla rápido con un mensaje claro en lugar de romper en runtime.
 */
const envSchema = z.object({
  VITE_API_URL: z.url({ error: 'VITE_API_URL debe ser una URL válida (ej. http://localhost:3000/api/v1)' }),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(import.meta.env);
  if (!parsed.success) {
    const detail = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    throw new Error(`Configuración de entorno inválida → ${detail}. Copiá .env.example a .env.`);
  }
  return { VITE_API_URL: parsed.data.VITE_API_URL.replace(/\/+$/, '') };
}

export const env = loadEnv();
