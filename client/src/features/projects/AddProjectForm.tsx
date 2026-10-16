import { useState, type FormEvent } from 'react';
import { createProject, ApiError } from '../../api/client.js';
import { Button } from '../../components/Button.js';
import { Input } from '../../components/Input.js';
import { useToast } from '../../lib/toast.js';
import { actions } from '../../lib/store.js';
import styles from './AddProjectForm.module.css';

function slugify(input: string): string {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const suffix = Math.random().toString(36).slice(2, 6);
  return base ? `${base}-${suffix}` : `p-${suffix}`;
}

export function AddProjectForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    setError(undefined);
    setSubmitting(true);
    try {
      const project = await createProject({ id: slugify(trimmed), name: trimmed });
      actions.addProject(project);
      setName('');
      toast.push('success', `Project "${project.name}" created`);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to create project';
      setError(msg);
      toast.push('error', msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <Input
        name="projectName"
        placeholder="New project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error}
        disabled={submitting}
        aria-label="New project name"
      />
      <Button type="submit" size="sm" loading={submitting}>
        Add
      </Button>
    </form>
  );
}
