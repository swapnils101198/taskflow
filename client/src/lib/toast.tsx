import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import styles from '../components/Toast.module.css';

export type ToastTone = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  tone: ToastTone;
  message: string;
}

interface ToastApi {
  push: (tone: ToastTone, message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

let seq = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((tone: ToastTone, message: string) => {
    const id = ++seq;
    setItems((prev) => [...prev, { id, tone, message }]);
  }, []);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className={styles.stack} role="status" aria-live="polite">
        {items.map((t) => (
          <ToastBubble key={t.id} item={t} onDone={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastBubble({ item, onDone }: { item: ToastItem; onDone: () => void }) {
  useEffect(() => {
    const id = window.setTimeout(onDone, 3000);
    return () => window.clearTimeout(id);
  }, [onDone]);

  return <div className={`${styles.toast} ${styles[item.tone]}`}>{item.message}</div>;
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
