import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'hab-tasting-list';

interface TastingListValue {
  ids: string[];
  count: number;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const TastingListContext = createContext<TastingListValue | null>(null);

function readStoredIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function TastingListProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => readStoredIds());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Ignore storage errors (private mode, quota, etc.)
    }
  }, [ids]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }, []);

  const remove = useCallback((id: string) => {
    setIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const value = useMemo<TastingListValue>(
    () => ({
      ids,
      count: ids.length,
      has: (id: string) => ids.includes(id),
      toggle,
      remove,
      clear,
    }),
    [ids, toggle, remove, clear]
  );

  return <TastingListContext.Provider value={value}>{children}</TastingListContext.Provider>;
}

export function useTastingList(): TastingListValue {
  const ctx = useContext(TastingListContext);
  if (!ctx) throw new Error('useTastingList must be used inside TastingListProvider');
  return ctx;
}
