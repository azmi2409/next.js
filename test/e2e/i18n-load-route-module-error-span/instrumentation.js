import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'

globalThis.__testSpans = []

class CollectingSpanProcessor {
  onStart() {}
  onEnd(span) {
    globalThis.__testSpans.push({
      name: span.name,
      // SpanStatusCode: 0 = UNSET, 1 = OK, 2 = ERROR
      status: span.status.code,
    })
  }
  shutdown() {
    return Promise.resolve()
  }
  forceFlush() {
    return Promise.resolve()
  }
}

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const provider = new NodeTracerProvider()
    provider.addSpanProcessor(new CollectingSpanProcessor())
    provider.register()
  }
}
