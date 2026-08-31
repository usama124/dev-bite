const GOOGLE_ANALYTICS_ID_PATTERN = /^G-[A-Z0-9]+$/i;

export function normalizeGoogleAnalyticsId(value: string | undefined) {
  const measurementId = value?.trim();
  return measurementId && GOOGLE_ANALYTICS_ID_PATTERN.test(measurementId)
    ? measurementId.toUpperCase()
    : null;
}

/**
 * Google Analytics is opt-in at build/deployment time. GA4 measurement IDs are
 * public browser configuration, so Next.js must expose this value to the client.
 */
export const GOOGLE_ANALYTICS_ID = normalizeGoogleAnalyticsId(
  process.env.GOOGLE_ANALYTICS_ID ??
    process.env.GOOGLE_ANALYTICS_ID
);
