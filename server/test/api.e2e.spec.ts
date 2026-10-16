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

describe('DELETE /tasks/:id', () => {
  it('deletes an existing task and returns 204', async () => {
    const app = createApp(createContainer());
    await request(app).post('/projects').send({ id: 'p1', name: 'Demo' });
    await request(app).post('/tasks').send({ id: 't1', projectId: 'p1', title: 'write docs' });

    const del = await request(app).delete('/tasks/t1');
    expect(del.status).toBe(204);

    const list = await request(app).get('/tasks');
    expect(list.body.tasks).toHaveLength(0);
  });

  it('returns 404 for a missing task', async () => {
    const app = createApp(createContainer());
    const res = await request(app).delete('/tasks/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('TASK_NOT_FOUND');
  });
});

describe('DELETE /projects/:id', () => {
  it('deletes the project and all its tasks', async () => {
    const app = createApp(createContainer());
    await request(app).post('/projects').send({ id: 'p1', name: 'Demo' });
    await request(app).post('/projects').send({ id: 'p2', name: 'Other' });
    await request(app).post('/tasks').send({ id: 't1', projectId: 'p1', title: 'a task' });
    await request(app).post('/tasks').send({ id: 't2', projectId: 'p1', title: 'another' });
    await request(app).post('/tasks').send({ id: 't3', projectId: 'p2', title: 'keep me' });

    const del = await request(app).delete('/projects/p1');
    expect(del.status).toBe(204);

    const projects = await request(app).get('/projects');
    expect(projects.body.projects).toHaveLength(1);
    expect(projects.body.projects[0].id).toBe('p2');

    const tasks = await request(app).get('/tasks');
    expect(tasks.body.tasks).toHaveLength(1);
    expect(tasks.body.tasks[0].id).toBe('t3');
  });

  it('returns 404 for a missing project', async () => {
    const app = createApp(createContainer());
    const res = await request(app).delete('/projects/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('PROJECT_NOT_FOUND');
  });
});
