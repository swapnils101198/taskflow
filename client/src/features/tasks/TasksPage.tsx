import { useEffect, useMemo, useState } from 'react';
import { listTasks, type Task } from '../../api/client.js';
import { Badge, type BadgeTone } from '../../components/Badge.js';
import { Card } from '../../components/Card.js';
import styles from './TasksPage.module.css';

type State =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; tasks: Task[] };

const STATUS_TONE: Record<Task['status'], BadgeTone> = {
  todo: 'neutral',
  doing: 'info',
  done: 'success',
};

const PRIORITY_TONE: Record<Task['priority'], BadgeTone> = {
  low: 'neutral',
  med: 'warn',
  high: 'danger',
};

const FILTERS = ['all', 'todo', 'doing', 'done'] as const;
type Filter = (typeof FILTERS)[number];

export function TasksPage() {
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    let cancelled = false;
    listTasks()
      .then((tasks) => {
        if (!cancelled) setState({ kind: 'ready', tasks });
      })
      .catch((e: Error) => {
        if (!cancelled) setState({ kind: 'error', message: e.message });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    if (state.kind !== 'ready') return [];
    return filter === 'all' ? state.tasks : state.tasks.filter((t) => t.status === filter);
  }, [state, filter]);

  return (
    <Card title="Tasks">
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

      {state.kind === 'loading' && <Skeleton rows={4} />}
      {state.kind === 'error' && (
        <p role="alert" className={styles.error}>
          {state.message}
        </p>
      )}
      {state.kind === 'ready' && visible.length === 0 && (
        <p className={styles.empty}>
          {filter === 'all' ? 'No tasks yet.' : `No ${filter} tasks.`}
        </p>
      )}
      {state.kind === 'ready' && visible.length > 0 && (
        <ul className={styles.list}>
          {visible.map((t) => (
            <li key={t.id} className={styles.item}>
              <div className={styles.rowTop}>
                <span className={styles.title}>{t.title}</span>
                <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge>
              </div>
              <div className={styles.rowBottom}>
                <Badge tone={PRIORITY_TONE[t.priority]}>{t.priority}</Badge>
                <span className={styles.assignee}>
                  {t.assigneeId ? `@${t.assigneeId}` : 'unassigned'}
                </span>
              </div>
            </li>
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
