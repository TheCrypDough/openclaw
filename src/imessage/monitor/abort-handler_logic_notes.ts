/*
 * AUTO ANNOTATION
 * File: src/imessage/monitor/abort-handler.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
export type IMessageMonitorClient = {
  request: (method: string, params?: Record<string, unknown>) => Promise<unknown>;
  stop: () => Promise<void>;
};

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export function attachIMessageMonitorAbortHandler(params: {
  abortSignal?: AbortSignal;
  client: IMessageMonitorClient;
  getSubscriptionId: () => number | null;
}): () => void {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const abort = params.abortSignal;
  if (!abort) {
    return () => {};
  }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const onAbort = () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const subscriptionId = params.getSubscriptionId();
    if (subscriptionId) {
      void params.client
        .request("watch.unsubscribe", {
          subscription: subscriptionId,
        })
        .catch(() => {
          // Ignore disconnect errors during shutdown.
        });
    }
    void params.client.stop().catch(() => {
      // Ignore disconnect errors during shutdown.
    });
  };

  abort.addEventListener("abort", onAbort, { once: true });
  return () => abort.removeEventListener("abort", onAbort);
}
