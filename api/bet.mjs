import { Redis } from '@upstash/redis';

export const config = {
  runtime: 'edge',
};

// Initialize Redis
const redis = new Redis({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

export default function handler(request, response, x, y, z) {
  console.log(request);
  console.log(response);
  console.log(x, y, z);
  return new Response(JSON.stringify({ text: 'Hello world!' }), { status: 200 });
}
