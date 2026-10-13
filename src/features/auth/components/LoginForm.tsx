import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, fieldA11y, FormField, Input } from '@/shared/ui';
import { loginSchema, type LoginValues } from '../schemas';

interface LoginFormProps {
  onSubmit: (values: LoginValues) => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

export function LoginForm({ onSubmit, isSubmitting = false, errorMessage }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {errorMessage && <Alert tone="danger">{errorMessage}</Alert>}
      <FormField label="Email" htmlFor="login-email" error={errors.email?.message} required>
        <Input
          type="email"
          autoComplete="email"
          {...fieldA11y('login-email', errors.email?.message)}
          {...register('email')}
        />
      </FormField>
      <FormField label="Contraseña" htmlFor="login-password" error={errors.password?.message} required>
        <Input
          type="password"
          autoComplete="current-password"
          {...fieldA11y('login-password', errors.password?.message)}
          {...register('password')}
        />
      </FormField>
      <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
        Ingresar
      </Button>
    </form>
  );
}
