import { Redis } from '@upstash/redis';

export const config = {
  runtime: 'edge',
};

// Initialize Redis
const redis = new Redis({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

const scoreMap = {
  0: 12,
  1: 10,
  2: 8,
  3: 7,
  4: 6,
  5: 5,
  6: 4,
  7: 3,
  8: 2,
  9: 1,
};

export default async function handler(request) {
  const url = new URL(request.url);
  if (request.method === 'GET') {
    const result = [40, 2, 39, 35, 21, 22, 20, 38, 30, 19, 10, 28, 26, 14, 34, 36, 13, 37, 11, 1, 23, 18, 7, 16, 9];
    const betKeys = await redis.keys('bet.*');
    const ids = betKeys.map((k) => k.split('.')[1]);
    const bets = await redis.mget(betKeys);
    const users = await redis.mget(ids.map((k) => 'user.' + k));
    // {
    //     users: {name: string, points: number, bets: {id: number, points: number}[]}[],
    //     entries: number[]
    // }
    const calculatePoints = (bet) => {
      let totalPoints = 0;
      const betsWithPoints =
        result.length === 0
          ? bet.map((b) => {
              return { id: b, points: 0 };
            })
          : bet.map((b, index) => {
              const correct = result.indexOf(b);
              const diff = Math.abs(correct - index);
              if (diff in scoreMap) {
                totalPoints += scoreMap[diff];
                return { id: b, points: scoreMap[diff] };
              }
              return { id: b, points: 0 };
            });
      return [totalPoints, betsWithPoints];
    };
    const completeUsers = users
      .map((user, index) => {
        const [totalPoints, betsWithPoints] = calculatePoints(bets[index]);
        return {
          name: user,
          points: totalPoints,
          bets: betsWithPoints,
        };
      })
      .sort((a, b) => b.points - a.points);
    return new Response(JSON.stringify({ entries: result, users: completeUsers }), { status: 200 });
  }
}
