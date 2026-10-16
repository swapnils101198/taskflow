import { Router } from 'express';
import { z } from 'zod';
import { createProject } from '../domain/projects.js';
import type { Container } from '../container.js';

const schema = z.object({ id: z.string().min(1), name: z.string().min(1) });

export function projectsRouter(c: Container): Router {
  const r = Router();

  r.get('/', (_req, res) => {
    res.json({ projects: [...c.store.projects.values()] });
  });

  r.post('/', (req, res, next) => {
    try {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: { code: 'VALIDATION', issues: parsed.error.issues } });
        return;
      }
      const project = createProject(parsed.data, c.store.projects);
      c.store.projects.set(project.id, project);
      res.status(201).json(project);
    } catch (err) {
      next(err);
    }
  });

  r.delete('/:id', (req, res) => {
    const project = c.store.projects.get(req.params.id);
    if (!project) {
      res.status(404).json({ error: { code: 'PROJECT_NOT_FOUND' } });
      return;
    }
    c.store.projects.delete(req.params.id);
    for (const [taskId, task] of c.store.tasks) {
      if (task.projectId === req.params.id) {
        c.store.tasks.delete(taskId);
      }
    }
    res.status(204).end();
  });

  return r;
}
