import { createApp } from './app.js';
import { createContainer } from './container.js';

const port = Number(process.env.PORT ?? 4000);
createApp(createContainer()).listen(port, () => {
  console.log(`[server] http://localhost:${port}`);
});
