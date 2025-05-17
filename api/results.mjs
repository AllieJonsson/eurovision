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
    // const result = [
    //   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
    //   32, 33, 34, 35, 36, 37,
    // ].sort((a, b) => Math.random() * 2 - 1);
    const result = [16, 2, 33, 1, 21, 19, 10, 26, 30, 15, 22, 3, 25, 28,
                   7, 18, 37, 14, 9, 12, 27, 8, 20, 5, 32, 4];
    /*const entries = [
        {
          country: 'Sverige',
          song: 'Bara bada bastu',
          artist: 'KAJ',
          id: 1,
          code: 'se',
        },
        {
          country: 'Israel',
          song: 'New Day Will Rise',
          artist: 'Yuval Raphael',
          id: 2,
          code: 'il',
        },
        {
          country: 'Nederländerna',
          song: 'C’est la vie',
          artist: 'Claude',
          id: 3,
          code: 'nl',
        },
        {
          country: 'San Marino',
          song: 'Tutta l’Italia',
          artist: 'Gabry Ponte',
          id: 4,
          code: 'sm',
        },
        {
          country: 'Spanien',
          song: 'Esa diva',
          artist: 'Melody',
          id: 5,
          code: 'es',
        },
        // {
        //   country: 'Slovenien',
        //   song: 'How Much Time Do We Have Left',
        //   artist: 'Klemen',
        //   id: 6,
        //   code: 'si',
        // },
        {
          country: 'Tyskland',
          song: 'Baller',
          artist: 'Abor & Tynna',
          id: 7,
          code: 'de',
        },
        {
          country: 'Luxemburg',
          song: 'La poupée monte le son',
          artist: 'Laura Thorn',
          id: 8,
          code: 'lu',
        },
        {
          country: 'Storbritannien',
          song: 'What The Hell Just Happened?',
          artist: 'Remember Monday',
          id: 9,
          code: 'gb',
        },
        {
          country: 'Frankrike',
          song: 'Maman',
          artist: 'Louane',
          id: 10,
          code: 'fr',
        },
        // {
        //   country: 'Cypern',
        //   song: 'Shh',
        //   artist: 'Theo Evan',
        //   id: 11,
        //   code: 'cy',
        // },
        {
          country: 'Armenien',
          song: 'Survivor',
          artist: 'Parg',
          id: 12,
          code: 'am',
        },
        // {
        //   country: 'Serbien',
        //   song: 'Mila',
        //   artist: 'Princ',
        //   id: 13,
        //   code: 'rs',
        // },
        {
          country: 'Norge',
          song: 'Lighter',
          artist: 'Kyle Alessandro',
          id: 14,
          code: 'no',
        },
        {
          country: 'Schweiz',
          song: 'Voyage',
          artist: 'Zoë Më',
          id: 15,
          code: 'ch',
        },
        {
          country: 'Österrike',
          song: 'Wasted Love',
          artist: 'JJ',
          id: 16,
          code: 'at',
        },
        // {
        //   country: 'Irland',
        //   song: 'Laika Party',
        //   artist: 'Emmy',
        //   id: 17,
        //   code: 'ie',
        // },
        {
          country: 'Litauen',
          song: 'Tavo akys',
          artist: 'Katarsis',
          id: 18,
          code: 'lt',
        },
        {
          country: 'Grekland',
          song: 'Asteromáta',
          artist: 'Klavdia',
          id: 19,
          code: 'gr',
        },
        {
          country: 'Danmark',
          song: 'Hallucination',
          artist: 'Sissal',
          id: 20,
          code: 'dk',
        },
        {
          country: 'Italien',
          song: 'Volevo essere un duro',
          artist: 'Lucio Corsi',
          id: 21,
          code: 'it',
        },
        {
          country: 'Finland',
          song: 'Ich komme',
          artist: 'Erika Vikman',
          id: 22,
          code: 'fi',
        },
        // {
        //   country: 'Belgien',
        //   song: 'Strobe Lights',
        //   artist: 'Red Sebastian',
        //   id: 23,
        //   code: 'be',
        // },
        // {
        //   country: 'Montenegro',
        //   song: 'Dobrodošli',
        //   artist: 'Nina Žižić',
        //   id: 24,
        //   code: 'me',
        // },
        {
          country: 'Lettland',
          song: 'Bur man laimi',
          artist: 'Tautumeitas',
          id: 25,
          code: 'lv',
        },
        {
          country: 'Albanien',
          song: 'Zjerm',
          artist: 'Shkodra Elektronike',
          id: 26,
          code: 'al',
        },
        {
          country: 'Portugal',
          song: 'Deslocado',
          artist: 'Napa',
          id: 27,
          code: 'pt',
        },
        {
          country: 'Polen',
          song: 'Gaja',
          artist: 'Justyna Steczkowska',
          id: 28,
          code: 'pl',
        },
        // {
        //   country: 'Azerbajdzjan',
        //   song: 'Run with U',
        //   artist: 'Mamagama',
        //   id: 29,
        //   code: 'az',
        // },
        {
          country: 'Ukraina',
          song: 'Bird of Pray',
          artist: 'Ziferblat',
          id: 30,
          code: 'ua',
        },
        // {
        //   country: 'Georgien',
        //   song: 'Freedom',
        //   artist: 'Mariam Shengelia',
        //   id: 31,
        //   code: 'ge',
        // },
        {
          country: 'Island',
          song: 'Róa',
          artist: 'Væb',
          id: 32,
          code: 'is',
        },
        {
          country: 'Estland',
          song: 'Espresso Macchiato',
          artist: 'Tommy Cash',
          id: 33,
          code: 'ee',
        },
        // {
        //   country: 'Kroatien',
        //   song: 'Poison Cake',
        //   artist: 'Marko Bošnjak',
        //   id: 34,
        //   code: 'hr',
        // },
        // {
        //   country: 'Australien',
        //   song: 'Milkshake Man',
        //   artist: 'Go-Jo',
        //   id: 35,
        //   code: 'au',
        // },
        // {
        //   country: 'Tjeckien',
        //   song: 'Kiss Kiss Goodbye',
        //   artist: 'Adonxs',
        //   id: 36,
        //   code: 'cz',
        // },
        {
          country: 'Malta',
          song: 'Serving',
          artist: 'Miriana Conte',
          id: 37,
          code: 'mt',
        },
      ];*/
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
