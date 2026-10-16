import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createContainer } from '../src/container.js';

describe('api', () => {
  it('creates a project and a task', async () => {
    const app = createApp(createContainer());
    const p = await request(app).post('/projects').send({ id: 'p1', name: 'Demo' });
    expect(p.status).toBe(201);

    const t = await request(app)
      .post('/tasks')
      .send({ id: 't1', projectId: 'p1', title: 'write docs' });
    expect(t.status).toBe(201);
    expect(t.body.status).toBe('todo');
  });

  it('rejects a task under a missing project with 404', async () => {
    const app = createApp(createContainer());
    const res = await request(app)
      .post('/tasks')
      .send({ id: 't1', projectId: 'nope', title: 'write docs' });
    expect(res.status).toBe(404);
  });

  it('rejects done transition without assignee with 422', async () => {
    const app = createApp(createContainer());
    await request(app).post('/projects').send({ id: 'p1', name: 'Demo' });
    await request(app).post('/tasks').send({ id: 't1', projectId: 'p1', title: 'write docs' });
    await request(app).post('/tasks/t1/transition').send({ status: 'doing' });
    const res = await request(app).post('/tasks/t1/transition').send({ status: 'done' });
    expect(res.status).toBe(422);
  });
});
