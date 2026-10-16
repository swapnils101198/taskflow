import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warn' | 'danger';

interface BadgeProps {
  tone?: BadgeTone | undefined;
  children: string;
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
