import express from 'express';
import type { Container } from './container.js';
import { requestId } from './middleware/requestId.js';
import { errorHandler } from './middleware/errorHandler.js';
import { projectsRouter } from './routes/projects.js';
import { tasksRouter } from './routes/tasks.js';

export function createApp(c: Container) {
  const app = express();
  app.use(express.json());
  app.use(requestId);
  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.use('/projects', projectsRouter(c));
  app.use('/tasks', tasksRouter(c));
  app.use(errorHandler);
  return app;
}
