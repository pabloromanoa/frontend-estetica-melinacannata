import { useSearchParams } from 'react-router';
import { Search, WandSparkles } from 'lucide-react';
import { useDebouncedValue } from '@/shared/hooks';
import { ButtonLink, ErrorState, Input, LoadingBlock } from '@/shared/ui';
import { CategoryFilter } from '../components/CategoryFilter';
import { ServiceGrid } from '../components/ServiceGrid';
import { useCategories, useServices } from '../hooks/useCatalog';

export function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const categoryId = params.get('categoria');
  const search = params.get('buscar') ?? '';
  const debouncedSearch = useDebouncedValue(search);
  const categories = useCategories();
  const services = useServices({ categoryId: categoryId ?? undefined, search: debouncedSearch || undefined });

  const update = (key: string, value: string | null) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-6 rounded-2xl bg-sidebar p-8">
        <div className="max-w-xl">
          <h1 className="text-4xl font-semibold tracking-tight text-ink">Nuestros servicios</h1>
          <p className="mt-2 text-ink-soft">
            Elegí el tratamiento, reservá tu horario y confirmá con una seña del 50%. Sin registrarte, si
            preferís.
          </p>
        </div>
        <ButtonLink
          to="/recomendame"
          variant="secondary"
          leftIcon={<WandSparkles className="size-4" aria-hidden />}
        >
          ¿No sabés qué elegir? Recomendame
        </ButtonLink>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4">
        {categories.data && (
          <CategoryFilter
            categories={categories.data}
            value={categoryId}
            onChange={(id) => update('categoria', id)}
          />
        )}
        <div className="relative w-full max-w-xs">
          <Search className="absolute top-3 left-3 size-4 text-ink-soft" aria-hidden />
          <label htmlFor="catalog-search" className="sr-only">
            Buscar servicio
          </label>
          <Input
            id="catalog-search"
            type="search"
            placeholder="Buscar servicio…"
            className="pl-9"
            value={search}
            onChange={(event) => update('buscar', event.target.value)}
          />
        </div>
      </div>

      {services.isLoading && <LoadingBlock label="Cargando servicios…" />}
      {services.isError && <ErrorState error={services.error} onRetry={() => void services.refetch()} />}
      {services.data && <ServiceGrid services={services.data} />}
    </div>
  );
}
