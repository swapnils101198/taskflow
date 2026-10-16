import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { Button } from '../components/Button.js';
import styles from '../components/Confirm.module.css';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string | undefined;
  cancelLabel?: string | undefined;
  tone?: 'default' | 'danger';
}

type Resolver = (ok: boolean) => void;

interface Pending {
  options: ConfirmOptions;
  resolve: Resolver;
}

interface ConfirmApi {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmApi | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null);

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> =>
      new Promise<boolean>((resolve) => {
        setPending({ options, resolve });
      }),
    [],
  );

  const close = useCallback(
    (ok: boolean) => {
      setPending((p) => {
        p?.resolve(ok);
        return null;
      });
    },
    [],
  );

  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(false);
      if (e.key === 'Enter') close(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pending, close]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {pending ? (
        <div
          className={styles.backdrop}
          role="presentation"
          onClick={() => close(false)}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="confirm-title" className={styles.title}>
              {pending.options.title}
            </h3>
            <p className={styles.message}>{pending.options.message}</p>
            <div className={styles.actions}>
              <Button variant="ghost" size="sm" onClick={() => close(false)}>
                {pending.options.cancelLabel ?? 'Cancel'}
              </Button>
              <Button
                variant={pending.options.tone === 'danger' ? 'danger' : 'primary'}
                size="sm"
                onClick={() => close(true)}
                autoFocus
              >
                {pending.options.confirmLabel ?? 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmApi['confirm'] {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used inside <ConfirmProvider>');
  return ctx.confirm;
}
