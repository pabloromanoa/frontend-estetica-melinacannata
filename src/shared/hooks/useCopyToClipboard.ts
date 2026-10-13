import { useCallback, useEffect, useRef, useState } from 'react';
import { COPY_FEEDBACK_MS } from '@/config/constants';

/** Copia texto al portapapeles y expone `copied` durante unos segundos para dar feedback. */
export function useCopyToClipboard(): {
  copied: boolean;
  failed: boolean;
  copy: (text: string) => Promise<boolean>;
} {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(async (text: string) => {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setFailed(false);
      timer.current = setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
      return true;
    } catch {
      setFailed(true);
      return false;
    }
  }, []);

  return { copied, failed, copy };
}
