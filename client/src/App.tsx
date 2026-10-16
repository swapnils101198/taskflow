import { ProjectsPage } from './features/projects/ProjectsPage.js';
import { TasksPage } from './features/tasks/TasksPage.js';
import styles from './App.module.css';

export function App() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>taskflow</div>
        <div className={styles.tagline}>Projects and tasks, kept simple.</div>
      </header>
      <main className={styles.main}>
        <ProjectsPage />
        <TasksPage />
      </main>
    </div>
  );
}
