/**
 * Used when WEBSITE_AUDIT_N8N_WEBHOOK_URL / REQUEST_DEMO_N8N_WEBHOOK_URL are unset
 * (e.g. production host env not configured). Override via env for staging or a different workflow.
 */
export const DEFAULT_WEBSITE_AUDIT_N8N_WEBHOOK_URL =
  'https://lwa24ysc.app.n8n.cloud/webhook/fd50bef9-f4cb-4a92-82b6-a2ad5395c15e'

export const DEFAULT_REQUEST_DEMO_N8N_WEBHOOK_URL = DEFAULT_WEBSITE_AUDIT_N8N_WEBHOOK_URL
