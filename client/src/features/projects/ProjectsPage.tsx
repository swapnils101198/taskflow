import { useEffect, useState } from 'react';
import { listProjects, type Project } from '../../api/client.js';
import { Card } from '../../components/Card.js';
import styles from './ProjectsPage.module.css';

type State =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; projects: Project[] };

export function ProjectsPage() {
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    listProjects()
      .then((projects) => {
        if (!cancelled) setState({ kind: 'ready', projects });
      })
      .catch((e: Error) => {
        if (!cancelled) setState({ kind: 'error', message: e.message });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card title="Projects">
      {state.kind === 'loading' && <Skeleton rows={3} />}
      {state.kind === 'error' && (
        <p role="alert" className={styles.error}>
          {state.message}
        </p>
      )}
      {state.kind === 'ready' && state.projects.length === 0 && (
        <p className={styles.empty}>No projects yet.</p>
      )}
      {state.kind === 'ready' && state.projects.length > 0 && (
        <ul className={styles.list}>
          {state.projects.map((p) => (
            <li key={p.id} className={styles.item}>
              <span className={styles.dot} aria-hidden />
              <span className={styles.name}>{p.name}</span>
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
