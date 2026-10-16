import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectsPage } from '../src/features/projects/ProjectsPage.js';

beforeEach(() => vi.restoreAllMocks());

describe('ProjectsPage', () => {
  it('renders projects from the API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          projects: [{ id: 'p1', name: 'Demo', createdAt: new Date().toISOString() }],
        }),
      }),
    );
    render(<ProjectsPage />);
    expect(await screen.findByText('Demo')).toBeInTheDocument();
  });

  it('shows an empty state when there are no projects', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ projects: [] }) }),
    );
    render(<ProjectsPage />);
    expect(await screen.findByText('No projects yet.')).toBeInTheDocument();
  });

  it('shows an error when the API fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    render(<ProjectsPage />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});
