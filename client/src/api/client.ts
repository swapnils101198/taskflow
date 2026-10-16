export type TaskStatus = 'todo' | 'doing' | 'done';
export type TaskPriority = 'low' | 'med' | 'high';

export interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
}

export class ApiError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const base = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    let code = 'HTTP_' + res.status;
    let message = `${path} failed: ${res.status}`;
    try {
      const body = (await res.json()) as { error?: { code?: string; message?: string } };
      if (body.error?.code) code = body.error.code;
      if (body.error?.message) message = body.error.message;
    } catch {
      // non-JSON error body — keep defaults
    }
    throw new ApiError(res.status, code, message);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ---------- reads ----------

export const listProjects = () =>
  request<{ projects: Project[] }>('/projects').then((r) => r.projects);

export const listTasks = (projectId?: string) =>
  request<{ tasks: Task[] }>(
    `/tasks${projectId ? `?projectId=${projectId}` : ''}`,
  ).then((r) => r.tasks);

// ---------- project mutations ----------

export const createProject = (input: { id: string; name: string }) =>
  request<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(input),
  });

// ---------- task mutations ----------

export const createTask = (input: {
  id: string;
  projectId: string;
  title: string;
  priority?: TaskPriority;
  assigneeId?: string | null;
}) =>
  request<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  });

export const transitionTask = (
  taskId: string,
  input: { status: TaskStatus; assigneeId?: string | null },
) =>
  request<Task>(`/tasks/${taskId}/transition`, {
    method: 'POST',
    body: JSON.stringify(input),
  });

export const deleteTask = (taskId: string) =>
  request<void>(`/tasks/${taskId}`, { method: 'DELETE' });

export const deleteProject = (projectId: string) =>
  request<void>(`/projects/${projectId}`, { method: 'DELETE' });
