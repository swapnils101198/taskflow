import { useEffect, useState } from 'react';
import { listProjects, deleteProject, ApiError } from '../../api/client.js';
import { Button } from '../../components/Button.js';
import { Card } from '../../components/Card.js';
import { useToast } from '../../lib/toast.js';
import { useConfirm } from '../../lib/confirm.js';
import { actions, useStore } from '../../lib/store.js';
import { AddProjectForm } from './AddProjectForm.js';
import styles from './ProjectsPage.module.css';

export function ProjectsPage() {
  const projects = useStore((s) => s.projects);
  const status = useStore((s) => s.projectsStatus);
  const toast = useToast();
  const confirm = useConfirm();
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'idle') return;
    actions.setProjectsStatus('loading');
    let cancelled = false;
    listProjects()
      .then((data) => {
        if (!cancelled) actions.setProjects(data);
      })
      .catch((e: Error) => {
        if (!cancelled) {
          actions.setProjectsStatus('error');
          actions.setError(e.message);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onDelete(id: string, name: string) {
    const ok = await confirm({
      title: 'Delete project',
      message: `"${name}" and all its tasks will be removed. This cannot be undone.`,
      confirmLabel: 'Delete',
      tone: 'danger',
    });
    if (!ok) return;
    setDeleting(id);
    try {
      await deleteProject(id);
      actions.removeProject(id);
      toast.push('success', `Project "${name}" deleted`);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Delete failed';
      toast.push('error', msg);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <Card title="Projects">
      <AddProjectForm />
      {status === 'loading' && <Skeleton rows={3} />}
      {status === 'error' && (
        <p role="alert" className={styles.error}>
          Failed to load projects.
        </p>
      )}
      {status === 'ready' && projects.length === 0 && (
        <p className={styles.empty}>No projects yet. Add one above to get started.</p>
      )}
      {status === 'ready' && projects.length > 0 && (
        <ul className={styles.list}>
          {projects.map((p) => (
            <li key={p.id} className={styles.item}>
              <span className={styles.dot} aria-hidden />
              <span className={styles.name}>{p.name}</span>
              <Button
                variant="ghost"
                size="sm"
                loading={deleting === p.id}
                onClick={() => onDelete(p.id, p.name)}
                aria-label={`Delete project ${p.name}`}
              >
                Delete
              </Button>
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
