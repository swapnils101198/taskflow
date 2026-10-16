import { Router } from 'express';
import { z } from 'zod';
import { createTask, transitionTask } from '../domain/tasks.js';
import type { Container } from '../container.js';

const createSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  title: z.string().min(1),
  priority: z.enum(['low', 'med', 'high']).optional(),
  status: z.enum(['todo', 'doing', 'done']).optional(),
  assigneeId: z.string().nullable().optional(),
});

const transitionSchema = z.object({
  status: z.enum(['todo', 'doing', 'done']),
  assigneeId: z.string().nullable().optional(),
});

export function tasksRouter(c: Container): Router {
  const r = Router();

  r.get('/', (req, res) => {
    const projectId = req.query.projectId;
    const all = [...c.store.tasks.values()];
    const filtered =
      typeof projectId === 'string' ? all.filter((t) => t.projectId === projectId) : all;
    res.json({ tasks: filtered });
  });

  r.post('/', (req, res, next) => {
    try {
      const parsed = createSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: { code: 'VALIDATION', issues: parsed.error.issues } });
        return;
      }
      if (!c.store.projects.has(parsed.data.projectId)) {
        res.status(404).json({ error: { code: 'PROJECT_NOT_FOUND' } });
        return;
      }
      const task = createTask(parsed.data, c.store.tasks);
      c.store.tasks.set(task.id, task);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  });

  r.post('/:id/transition', (req, res, next) => {
    try {
      const task = c.store.tasks.get(req.params.id);
      if (!task) {
        res.status(404).json({ error: { code: 'TASK_NOT_FOUND' } });
        return;
      }
      const parsed = transitionSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: { code: 'VALIDATION', issues: parsed.error.issues } });
        return;
      }
      const next = transitionTask(task, parsed.data.status, parsed.data.assigneeId ?? task.assigneeId);
      c.store.tasks.set(next.id, next);
      res.json(next);
    } catch (err) {
      next(err);
    }
  });

  return r;
}
