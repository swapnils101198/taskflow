import { useState, type FormEvent } from 'react';
import { createTask, ApiError, type TaskPriority } from '../../api/client.js';
import { Button } from '../../components/Button.js';
import { Input, Select } from '../../components/Input.js';
import { useToast } from '../../lib/toast.js';
import { actions, useStore } from '../../lib/store.js';
import styles from './AddTaskForm.module.css';

function newId(): string {
  return 't-' + Math.random().toString(36).slice(2, 8);
}

export function AddTaskForm() {
  const projects = useStore((s) => s.projects);
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('med');
  const [error, setError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const disabled = projects.length === 0;
  const effectiveProjectId = projectId || projects[0]?.id || '';

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disabled) return;
    const trimmed = title.trim();
    if (trimmed.length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }
    if (!effectiveProjectId) {
      setError('Choose a project');
      return;
    }
    setError(undefined);
    setSubmitting(true);
    try {
      const task = await createTask({
        id: newId(),
        projectId: effectiveProjectId,
        title: trimmed,
        priority,
      });
      actions.addTask(task);
      setTitle('');
      toast.push('success', `Task "${task.title}" created`);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to create task';
      setError(msg);
      toast.push('error', msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <Input
        name="taskTitle"
        placeholder={disabled ? 'Add a project first' : 'New task title'}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={error}
        disabled={disabled || submitting}
        aria-label="New task title"
      />
      <div className={styles.row}>
        <Select
          name="taskProject"
          value={effectiveProjectId}
          onChange={(e) => setProjectId(e.target.value)}
          disabled={disabled || submitting}
          aria-label="Project"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
        <Select
          name="taskPriority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          disabled={submitting}
          aria-label="Priority"
        >
          <option value="low">low</option>
          <option value="med">med</option>
          <option value="high">high</option>
        </Select>
        <Button type="submit" size="sm" loading={submitting} disabled={disabled}>
          Add
        </Button>
      </div>
    </form>
  );
}
