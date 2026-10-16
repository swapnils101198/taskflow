import { useEffect, useState } from 'react';
import type { Project, Task } from '../api/client.js';

export type Status = 'idle' | 'loading' | 'ready' | 'error';

export interface AppState {
  projects: Project[];
  tasks: Task[];
  projectsStatus: Status;
  tasksStatus: Status;
  error: string | null;
}

const INITIAL: AppState = {
  projects: [],
  tasks: [],
  projectsStatus: 'idle',
  tasksStatus: 'idle',
  error: null,
};

let state: AppState = INITIAL;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function setState(partial: Partial<AppState>) {
  state = { ...state, ...partial };
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): AppState {
  return state;
}

export function useStore<T>(selector: (s: AppState) => T): T {
  const [snap, setSnap] = useState<AppState>(getSnapshot);
  useEffect(() => {
    setSnap(getSnapshot());
    return subscribe(() => setSnap(getSnapshot()));
  }, []);
  return selector(snap);
}

export const actions = {
  setProjects(projects: Project[]) {
    setState({ projects, projectsStatus: 'ready', error: null });
  },
  setTasks(tasks: Task[]) {
    setState({ tasks, tasksStatus: 'ready', error: null });
  },
  addProject(project: Project) {
    setState({ projects: [...state.projects, project] });
  },
  removeProject(id: string) {
    setState({
      projects: state.projects.filter((p) => p.id !== id),
      tasks: state.tasks.filter((t) => t.projectId !== id),
    });
  },
  addTask(task: Task) {
    setState({ tasks: [...state.tasks, task] });
  },
  updateTask(task: Task) {
    setState({ tasks: state.tasks.map((t) => (t.id === task.id ? task : t)) });
  },
  removeTask(id: string) {
    setState({ tasks: state.tasks.filter((t) => t.id !== id) });
  },
  setProjectsStatus(status: Status) {
    setState({ projectsStatus: status });
  },
  setTasksStatus(status: Status) {
    setState({ tasksStatus: status });
  },
  setError(error: string | null) {
    setState({ error });
  },
  reset() {
    state = INITIAL;
    emit();
  },
};
