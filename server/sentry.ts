import * as Sentry from '@sentry/node';

export const sentryInit = () => {
  Sentry.init({
    dsn: "https://3e55e10fadec4e3896eaf04416b96487@o1065124.ingest.sentry.io/6056458",
    tracesSampleRate: 1.0,
  });
}