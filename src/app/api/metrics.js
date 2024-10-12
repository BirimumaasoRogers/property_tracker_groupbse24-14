// app/api/metrics/route.js

import { NextResponse } from 'next/server';
import client from 'prom-client'; // Make sure prom-client is installed

// Create a Registry to register the metrics
const register = new client.Registry();

// Create custom metrics (example: HTTP request counter)
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'status'],
});

// Register the metric
register.registerMetric(httpRequestCounter);

// Update the counter for every request (this can be done in middleware)
export function updateHttpRequestCounter(method, status) {
  httpRequestCounter.inc({ method, status });
}

// Export the metrics as a response
export async function GET() {
  const metrics = await register.metrics();
  return NextResponse.text(metrics, {
    headers: { 'Content-Type': register.contentType },
  });
}
