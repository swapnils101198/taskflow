export interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  priority: 'low' | 'med' | 'high';
  assigneeId: string | null;
}

const base = '/api';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${base}${path}`);
  if (!res.ok) throw new Error(`${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

export const listProjects = () =>
  getJson<{ projects: Project[] }>('/projects').then((r) => r.projects);

export const listTasks = (projectId?: string) =>
  getJson<{ tasks: Task[] }>(`/tasks${projectId ? `?projectId=${projectId}` : ''}`).then(
    (r) => r.tasks,
  );
