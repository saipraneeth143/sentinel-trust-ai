import { app } from './app';
import { env } from './config/env';

const port = Number(process.env.PORT || env.PORT) || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, '0.0.0.0', () => {
    console.log(
      `[SentinelTrust AI] Security, Privacy & Trust Intelligence API running on http://0.0.0.0:${port}/api/v1`
    );
  });
}

export default app;
