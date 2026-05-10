const WEBHOOK_TIMEOUT_MS = 15_000

export type PostN8nWebhookResult =
  | { ok: true }
  | { ok: false; status: 502 | 503; error: string; logDetail: string }

/**
 * POST JSON to an n8n Webhook node. Caller supplies correlation id and log label for server logs.
 */
export async function postLeadJsonToN8nWebhook(options: {
  webhookUrl: string
  webhookSecret?: string
  payload: unknown
  correlationId: string
  logLabel: string
  /** Shown in timeout / connection error copy (env var name). */
  webhookEnvName: string
}): Promise<PostN8nWebhookResult> {
  const { webhookUrl, webhookSecret, payload, correlationId, logLabel, webhookEnvName } = options
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS)

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(webhookSecret ? { 'X-Webhook-Secret': webhookSecret } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    if (!res.ok) {
      const bodySnippet = (await res.text().catch(() => '')).slice(0, 300)
      const logDetail = `n8n status ${res.status} ${bodySnippet}`
      console.error(`[${logLabel}]`, correlationId, logDetail)

      let error =
        'Could not reach the lead webhook. Check n8n is reachable and the workflow is active.'
      if (res.status === 404) {
        error = webhookUrl.includes('webhook-test')
          ? 'n8n returned 404: test webhooks only work briefly while “Listen for test event” is running in the editor. Copy the Production webhook URL (path contains /webhook/, not /webhook-test/), activate the workflow, and set the webhook env URL to that value.'
          : 'n8n returned 404: wrong webhook path or the workflow is not active. Open the Webhook node in n8n, confirm the Production URL, and ensure the workflow is turned on.'
      } else if (res.status === 401 || res.status === 403) {
        error =
          'n8n rejected the request (HTTP ' +
          res.status +
          '). If the Webhook node uses authentication, set N8N_WEBHOOK_SECRET to match.'
      }

      return { ok: false, status: 502, error, logDetail }
    }

    return { ok: true }
  } catch (e) {
    const aborted = e instanceof Error && e.name === 'AbortError'
    console.error(`[${logLabel}]`, correlationId, aborted ? 'timeout' : 'fetch_error')
    return {
      ok: false,
      status: 503,
      error: aborted
        ? 'The lead webhook timed out. Try again or check n8n status.'
        : `Could not connect to the lead webhook. Check network, firewall, and ${webhookEnvName}.`,
      logDetail: aborted ? 'timeout' : 'fetch_error',
    }
  } finally {
    clearTimeout(timeout)
  }
}
