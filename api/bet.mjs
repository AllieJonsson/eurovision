import { Redis } from '@upstash/redis';

export const config = {
  runtime: 'edge',
};

// Initialize Redis
const redis = new Redis({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

export default async function handler(request, response, x, y, z) {
  console.log(request);
  const url = new URL(request.url);
  if (request.method === 'GET') {
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'Missing param: id' }), { status: 400 });
    const cached = await redis.get(`bet.${id}`);
    return new Response(JSON.stringify({ bet: cached ? JSON.parse(cached) : [] }), { status: 200 });
  } else if (request.method === 'POST') {
    console.log(await request.body.json());
  }
}
