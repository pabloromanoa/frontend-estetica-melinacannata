import { useState } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import type { Category, CategoryInput } from '@/domain';
import { Badge, IconButton, Input } from '@/shared/ui';

interface CategoryRowProps {
  category: Category;
  onUpdate: (input: CategoryInput) => void;
  onDelete: () => void;
  disabled: boolean;
}

export function CategoryRow({ category, onUpdate, onDelete, disabled }: CategoryRowProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const save = () => {
    if (name.trim()) onUpdate({ name: name.trim(), isActive: category.isActive });
    setEditing(false);
  };
  return (
    <li className="flex flex-wrap items-center gap-3 py-3">
      {editing ? (
        <Input
          aria-label={`Nombre de ${category.name}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-xs"
          autoFocus
        />
      ) : (
        <span className="min-w-40 font-medium text-ink">{category.name}</span>
      )}
      {category.isActive ? <Badge tone="success">Activa</Badge> : <Badge>Inactiva</Badge>}
      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          className="size-4 accent-primary"
          checked={category.isActive}
          disabled={disabled}
          onChange={(e) => onUpdate({ name: category.name, isActive: e.target.checked })}
        />
        Activa
      </label>
      <div className="ml-auto flex gap-1">
        {editing ? (
          <>
            <IconButton aria-label="Guardar nombre" size="sm" onClick={save}>
              <Check className="size-4" />
            </IconButton>
            <IconButton
              aria-label="Cancelar edición"
              size="sm"
              onClick={() => {
                setName(category.name);
                setEditing(false);
              }}
            >
              <X className="size-4" />
            </IconButton>
          </>
        ) : (
          <IconButton aria-label={`Renombrar ${category.name}`} size="sm" onClick={() => setEditing(true)}>
            <Pencil className="size-4" />
          </IconButton>
        )}
        <IconButton aria-label={`Eliminar ${category.name}`} size="sm" variant="danger" onClick={onDelete}>
          <Trash2 className="size-4" />
        </IconButton>
      </div>
    </li>
  );
}
