import { useEffect, useMemo, useState } from 'react';
import { listTasks, type Task } from '../../api/client.js';
import { Card } from '../../components/Card.js';
import { actions, useStore } from '../../lib/store.js';
import { AddTaskForm } from './AddTaskForm.js';
import { TaskItem } from './TaskItem.js';
import styles from './TasksPage.module.css';

const FILTERS = ['all', 'todo', 'doing', 'done'] as const;
type Filter = (typeof FILTERS)[number];

export function TasksPage() {
  const tasks = useStore((s) => s.tasks);
  const projects = useStore((s) => s.projects);
  const status = useStore((s) => s.tasksStatus);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    if (status !== 'idle') return;
    actions.setTasksStatus('loading');
    let cancelled = false;
    listTasks()
      .then((data) => {
        if (!cancelled) actions.setTasks(data);
      })
      .catch((e: Error) => {
        if (!cancelled) {
          actions.setTasksStatus('error');
          actions.setError(e.message);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const projectNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of projects) map.set(p.id, p.name);
    return map;
  }, [projects]);

  return (
    <Card title="Tasks">
      <AddTaskForm />
      <div className={styles.filters} role="tablist" aria-label="Filter tasks by status">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            className={filter === f ? `${styles.filter} ${styles.filterActive}` : styles.filter}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {status === 'loading' && <Skeleton rows={4} />}
      {status === 'error' && (
        <p role="alert" className={styles.error}>
          Failed to load tasks.
        </p>
      )}
      {status === 'ready' && visible.length === 0 && (
        <p className={styles.empty}>
          {filter === 'all' ? 'No tasks yet. Add one above.' : `No ${filter} tasks.`}
        </p>
      )}
      {status === 'ready' && visible.length > 0 && (
        <ul className={styles.list}>
          {visible.map((t) => (
            <TaskItem key={t.id} task={t} projectName={projectNameById.get(t.projectId)} />
          ))}
        </ul>
      )}
    </Card>
  );
}

function Skeleton({ rows }: { rows: number }) {
  return (
    <div className={styles.skeleton} aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.skeletonRow} />
      ))}
    </div>
  );
}
