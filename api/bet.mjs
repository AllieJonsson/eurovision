import { Redis } from '@upstash/redis';

export const config = {
  runtime: 'edge',
};

// Initialize Redis
const redis = new Redis({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

export default function handler(request, response) {
  console.log(request);
  return response.status(200).json({ text: 'I am an Edge Function!' });
}
