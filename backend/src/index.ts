import { app } from './app';
import { env } from './config/env';

const port = Number(env.PORT) || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(
      `[SentinelTrust AI] Security, Privacy & Trust Intelligence API running on http://localhost:${port}/api/v1`
    );
  });
}

export default app;

