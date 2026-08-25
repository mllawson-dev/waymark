/**
 * Single place errors are surfaced from, so failures that are recovered from
 * still leave a trace instead of disappearing. Swap the console call here for
 * a real reporting service (Sentry, etc.) when one is added.
 */
export function reportError(context: string, error: unknown, details?: Record<string, unknown>): void {
  console.error(`[waymark] ${context}`, error, details ?? {});
}
