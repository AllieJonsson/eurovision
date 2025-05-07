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
  0: 100,
  1: 70,
  2: 60,
  3: 50,
  4: 40,
  5: 30,
  6: 25,
  7: 20,
  8: 15,
  9: 10,
  10: 5,
};

export default async function handler(request) {
  console.log(request);
  const url = new URL(request.url);
  if (request.method === 'GET') {
    const result = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      32, 33, 34, 35, 36, 37,
    ].sort((a, b) => Math.random() * 2 - 1);
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
      const betsWithPoints = bet.map((b, index) => {
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
      .sort((a, b) => a.points - b.points);
    return new Response(JSON.stringify({ entries: result, users: completeUsers }), { status: 200 });
  }
}
