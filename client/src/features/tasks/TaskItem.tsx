import { useState } from 'react';
import {
  transitionTask,
  deleteTask,
  ApiError,
  type Task,
  type TaskStatus,
} from '../../api/client.js';
import { Badge, type BadgeTone } from '../../components/Badge.js';
import { Button } from '../../components/Button.js';
import { useToast } from '../../lib/toast.js';
import { useConfirm } from '../../lib/confirm.js';
import { actions } from '../../lib/store.js';
import styles from './TaskItem.module.css';

const STATUS_TONE: Record<TaskStatus, BadgeTone> = {
  todo: 'neutral',
  doing: 'info',
  done: 'success',
};

const PRIORITY_TONE: Record<Task['priority'], BadgeTone> = {
  low: 'neutral',
  med: 'warn',
  high: 'danger',
};

interface TransitionAction {
  label: string;
  next: TaskStatus;
  variant: 'primary' | 'ghost';
}

function actionsFor(status: TaskStatus): TransitionAction[] {
  switch (status) {
    case 'todo':
      return [{ label: 'Start', next: 'doing', variant: 'primary' }];
    case 'doing':
      return [
        { label: 'Complete', next: 'done', variant: 'primary' },
        { label: 'Reopen', next: 'todo', variant: 'ghost' },
      ];
    case 'done':
      return [];
  }
}

interface TaskItemProps {
  task: Task;
  projectName?: string | undefined;
}

export function TaskItem({ task, projectName }: TaskItemProps) {
  const toast = useToast();
  const confirm = useConfirm();
  const [busy, setBusy] = useState<string | null>(null);

  async function onTransition(next: TaskStatus, label: string) {
    setBusy(label);
    try {
      const updated = await transitionTask(task.id, { status: next });
      actions.updateTask(updated);
      toast.push('success', `Task moved to ${next}`);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Transition failed';
      toast.push('error', msg);
    } finally {
      setBusy(null);
    }
  }

  async function onDelete() {
    const ok = await confirm({
      title: 'Delete task',
      message: `"${task.title}" will be removed. This cannot be undone.`,
      confirmLabel: 'Delete',
      tone: 'danger',
    });
    if (!ok) return;
    setBusy('Delete');
    try {
      await deleteTask(task.id);
      actions.removeTask(task.id);
      toast.push('success', 'Task deleted');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Delete failed';
      toast.push('error', msg);
    } finally {
      setBusy(null);
    }
  }

  return (
    <li className={styles.item}>
      <div className={styles.rowTop}>
        <span className={styles.title}>{task.title}</span>
        <Badge tone={STATUS_TONE[task.status]}>{task.status}</Badge>
      </div>

      <div className={styles.rowMeta}>
        <Badge tone={PRIORITY_TONE[task.priority]}>{task.priority}</Badge>
        {projectName ? <span className={styles.project}>{projectName}</span> : null}
        <span className={styles.assignee}>
          {task.assigneeId ? `@${task.assigneeId}` : 'unassigned'}
        </span>
      </div>

      <div className={styles.rowActions}>
        {actionsFor(task.status).map((a) => (
          <Button
            key={a.label}
            size="sm"
            variant={a.variant}
            loading={busy === a.label}
            onClick={() => onTransition(a.next, a.label)}
          >
            {a.label}
          </Button>
        ))}
        <Button
          size="sm"
          variant="danger"
          loading={busy === 'Delete'}
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </li>
  );
}
