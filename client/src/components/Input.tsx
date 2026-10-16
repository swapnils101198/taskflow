import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | undefined;
}

export function Input({ label, error, id, className, ...rest }: InputProps) {
  const inputId = id ?? rest.name;
  return (
    <label className={styles.wrap} htmlFor={inputId}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <input
        id={inputId}
        className={[styles.field, error ? styles.fieldError : null, className]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
      {error ? <span className={styles.error}>{error}</span> : null}
    </label>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, id, className, children, ...rest }: SelectProps) {
  const selectId = id ?? rest.name;
  return (
    <label className={styles.wrap} htmlFor={selectId}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <select
        id={selectId}
        className={[styles.field, styles.select, className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </select>
    </label>
  );
}
